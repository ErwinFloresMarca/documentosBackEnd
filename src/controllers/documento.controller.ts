import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {Area, Documento, File, ManyToMany, TipoDocumentos} from '../models';
import {DocumentoRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class DocumentoController {
  constructor(
    @repository(DocumentoRepository)
    public documentoRepository: DocumentoRepository,
  ) {}

  @post('/documentos')
  @response(200, {
    description: 'Documento model instance',
    content: {'application/json': {schema: getModelSchemaRef(Documento)}},
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, {
            title: 'NewDocumento',
            exclude: ['id'],
          }),
        },
      },
    })
    documento: Omit<Documento, 'id'>,
  ): Promise<Documento> {
    const lastNumDoc = await this.documentoRepository.findOne({
      order: ['numDoc DESC'],
    });
    documento.numDoc = lastNumDoc?.numDoc ? lastNumDoc.numDoc + 1 : 1;
    return this.documentoRepository.create(documento);
  }

  @get('/documentos/count')
  @response(200, {
    description: 'Documento model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async count(
    @param.where(Documento) where?: Where<Documento>,
  ): Promise<Count> {
    return this.documentoRepository.count(where);
  }

  @get('/documentos')
  @response(200, {
    description: 'Array of Documento model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Documento, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Documento) filter?: Filter<Documento>,
  ): Promise<Documento[]> {
    return this.documentoRepository.find(filter);
  }

  @get('/documentos/{id}')
  @response(200, {
    description: 'Documento model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Documento, {includeRelations: true}),
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Documento, {exclude: 'where'})
    filter?: FilterExcludingWhere<Documento>,
  ): Promise<Documento> {
    return this.documentoRepository.findById(id, filter);
  }

  @patch('/documentos/{id}')
  @response(204, {
    description: 'Documento PATCH success',
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, {partial: true}),
        },
      },
    })
    documento: Documento,
  ): Promise<void> {
    await this.documentoRepository.updateById(id, documento);
  }

  @del('/documentos/{id}')
  @response(204, {
    description: 'Documento DELETE success',
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.documentoRepository.deleteById(id);
  }

  @get('/documentos/{id}/areas', {
    responses: {
      '200': {
        description: 'Array of Documento has many Area through DocumentoArea',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Area)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findAreas(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Area>,
  ): Promise<Area[]> {
    return this.documentoRepository.areas(id).find(filter);
  }

  @get('/documentos/{id}/tipo-documentos', {
    responses: {
      '200': {
        description: 'TipoDocumentos belonging to Documento',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoDocumentos)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getTipoDocumentos(
    @param.path.number('id') id: typeof Documento.prototype.id,
  ): Promise<TipoDocumentos> {
    return this.documentoRepository.tipoDocumento(id);
  }

  @get('/documentos/{id}/file', {
    responses: {
      '200': {
        description: 'File belonging to Documento',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(File)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getFile(
    @param.path.number('id') id: typeof Documento.prototype.id,
  ): Promise<File> {
    return this.documentoRepository.file(id);
  }

  @post('/documentos/{id}/areas/links', {
    responses: {
      '200': {
        description: 'crear relación con área',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link areas',
              type: 'number[]',
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async linkTipoDocumento(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ManyToMany, {
            title: 'ManyToManySchema',
          }),
        },
      },
    })
    data: ManyToMany,
  ): Promise<Array<number | undefined>> {
    if (data.link)
      await this.documentoRepository.areas(id).link(data.relationId);
    else await this.documentoRepository.areas(id).unlink(data.relationId);
    return (
      await this.documentoRepository.areas(id).find({fields: {id: true}})
    ).map(c => c.id);
  }

  @get('/documentos/{id}/areas/links', {
    responses: {
      '200': {
        description: 'lista ids relacionados areas',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link areas',
              type: 'number[]',
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getLinkTipoDocumento(
    @param.path.number('id') id: number,
  ): Promise<Array<number | undefined>> {
    return (
      await this.documentoRepository.areas(id).find({fields: {id: true}})
    ).map(a => a.id);
  }
}
