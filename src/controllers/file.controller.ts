import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  oas,
  param,
  post,
  Request,
  requestBody,
  response,
  Response,
  RestBindings,
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from '../keys';
import {File} from '../models';
import {FileRepository} from '../repositories';
import {FileUploadHandler} from '../types';

const readdir = promisify(fs.readdir);
/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileController {
  /**
   * Constructor
   * @param handler - Inject an express request handler to deal with the request
   */
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
    @repository(FileRepository)
    public fileRepository: FileRepository,
  ) {}
  @post('/files', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) resp: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, resp, (err: unknown) => {
        if (err) reject(err);
        else {
          const resolver = async () => {
            const respData = await this.saveFile(request);
            resolve(respData);
          };
          resolver().catch(error => reject(error));
        }
      });
    });
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  async saveFile(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File): File => {
      return new File({
        fileName: f.filename,
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
      });
    };
    let files: File[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    const dbFiles: object[] = [];
    for (const f of files) {
      const resp = await this.fileRepository.save(f);
      dbFiles.push(resp);
    }
    return {files: dbFiles};
  }

  // download files
  @get('/files', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles() {
    const files = await readdir(this.storageDirectory);
    return files;
  }

  @get('/files/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) resp: Response,
  ) {
    const file = this.validateFileName(fileName);
    resp.download(file, fileName);
    return resp;
  }

  @get('/files/by-id/{fileId}')
  @response(200, {
    description: 'File model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(File, {includeRelations: true}),
      },
    },
  })
  fileById(@param.path.number('fileId') fileId: number) {
    return this.fileRepository.findById(fileId);
  }

  @get('/files/download/by-id/{fileId}')
  @response(200, {
    description: 'File model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(File, {includeRelations: true}),
      },
    },
  })
  async downloadFileById(
    @param.path.number('fileId') fileId: number,
    @inject(RestBindings.Http.RESPONSE) resp: Response,
  ) {
    const fileData = await this.fileRepository.findById(fileId);
    const file = this.validateFileName(fileData.fileName);
    resp.download(file, fileData.fileName);
    return resp;
  }

  @get('/files/base64/by-id/{fileId}')
  @response(200, {
    description: 'File model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['base64'],
          properties: {
            base64: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async base64FileById(@param.path.number('fileId') fileId: number) {
    const fileData = await this.fileRepository.findById(fileId);
    const file = this.validateFileName(fileData.fileName);
    return {
      base64: fs.readFileSync(file, {encoding: 'base64'}),
    };
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }
}
