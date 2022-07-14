import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {Documento, DocumentoEvento} from '../models';
import {DocumentoRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class DocumentoDocumentoEventoController {
  constructor(
    @repository(DocumentoRepository)
    protected documentoRepository: DocumentoRepository,
  ) {}

  @get('/documentos/{id}/documento-eventos', {
    responses: {
      '200': {
        description: 'Array of Documento has many DocumentoEvento',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DocumentoEvento)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DocumentoEvento>,
  ): Promise<DocumentoEvento[]> {
    return this.documentoRepository.documentoEventos(id).find(filter);
  }

  @post('/documentos/{id}/documento-eventos', {
    responses: {
      '200': {
        description: 'Documento model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(DocumentoEvento)},
        },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof Documento.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentoEvento, {
            title: 'NewDocumentoEventoInDocumento',
            exclude: ['id'],
            optional: ['documentoId'],
          }),
        },
      },
    })
    documentoEvento: Omit<DocumentoEvento, 'id'>,
  ): Promise<DocumentoEvento> {
    return this.documentoRepository
      .documentoEventos(id)
      .create(documentoEvento);
  }

  @patch('/documentos/{id}/documento-eventos', {
    responses: {
      '200': {
        description: 'Documento.DocumentoEvento PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentoEvento, {partial: true}),
        },
      },
    })
    documentoEvento: Partial<DocumentoEvento>,
    @param.query.object('where', getWhereSchemaFor(DocumentoEvento))
    where?: Where<DocumentoEvento>,
  ): Promise<Count> {
    return this.documentoRepository
      .documentoEventos(id)
      .patch(documentoEvento, where);
  }

  @del('/documentos/{id}/documento-eventos', {
    responses: {
      '200': {
        description: 'Documento.DocumentoEvento DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DocumentoEvento))
    where?: Where<DocumentoEvento>,
  ): Promise<Count> {
    return this.documentoRepository.documentoEventos(id).delete(where);
  }
}
