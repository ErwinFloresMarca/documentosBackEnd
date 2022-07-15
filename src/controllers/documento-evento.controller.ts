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
import {DocumentoEvento} from '../models';
import {DocumentoEventoRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class DocumentoEventoController {
  constructor(
    @repository(DocumentoEventoRepository)
    protected documentoEventoRepository: DocumentoEventoRepository,
  ) {}

  @get('/documento-eventos', {
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
    @param.query.object('filter') filter?: Filter<DocumentoEvento>,
  ): Promise<DocumentoEvento[]> {
    return this.documentoEventoRepository.find(filter);
  }

  @post('/documento-eventos', {
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
    return this.documentoEventoRepository.create(documentoEvento);
  }

  @patch('/documento-eventos', {
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
    return this.documentoEventoRepository.updateAll(documentoEvento, where);
  }

  @del('/documento-eventos', {
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
    @param.query.object('where', getWhereSchemaFor(DocumentoEvento))
    where?: Where<DocumentoEvento>,
  ): Promise<Count> {
    return this.documentoEventoRepository.deleteAll(where);
  }
}
