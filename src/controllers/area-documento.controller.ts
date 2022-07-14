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
import {Area, Documento} from '../models';
import {AreaRepository} from '../repositories';
import Roles from '../utils/roles.util';
import {DocumentoRepository} from './../repositories/documento.repository';

export class AreaDocumentoController {
  constructor(
    @repository(AreaRepository) protected areaRepository: AreaRepository,
    @repository(DocumentoRepository)
    protected documentoRepository: DocumentoRepository,
  ) {}

  @authenticate('jwt')
  @get('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'Array of Area has many Documento through DocumentoArea',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Documento)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Documento>,
  ): Promise<Documento[]> {
    return this.areaRepository.documentos(id).find(filter);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @post('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'create a Documento model instance',
        content: {'application/json': {schema: getModelSchemaRef(Documento)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Area.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, {
            title: 'NewDocumentoInArea',
            exclude: ['id'],
          }),
        },
      },
    })
    documento: Omit<Documento, 'id'>,
  ): Promise<Documento> {
    return this.areaRepository.documentos(id).create(documento);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @patch('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'Area.Documento PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, {partial: true}),
        },
      },
    })
    documento: Partial<Documento>,
    @param.query.object('where', getWhereSchemaFor(Documento))
    where?: Where<Documento>,
  ): Promise<Count> {
    return this.areaRepository.documentos(id).patch(documento, where);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @del('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'Area.Documento DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Documento))
    where?: Where<Documento>,
  ): Promise<Count> {
    return this.areaRepository.documentos(id).delete(where);
  }
}
