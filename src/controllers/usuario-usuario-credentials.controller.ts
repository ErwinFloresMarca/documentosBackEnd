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
import {
  Usuario,
  UsuarioCredentials,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioUsuarioCredentialsController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/usuario-credentials', {
    responses: {
      '200': {
        description: 'Usuario has one UsuarioCredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UsuarioCredentials),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UsuarioCredentials>,
  ): Promise<UsuarioCredentials> {
    return this.usuarioRepository.usuarioCredentials(id).get(filter);
  }

  @post('/usuarios/{id}/usuario-credentials', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(UsuarioCredentials)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCredentials, {
            title: 'NewUsuarioCredentialsInUsuario',
            exclude: ['id'],
            optional: ['usuarioId']
          }),
        },
      },
    }) usuarioCredentials: Omit<UsuarioCredentials, 'id'>,
  ): Promise<UsuarioCredentials> {
    return this.usuarioRepository.usuarioCredentials(id).create(usuarioCredentials);
  }

  @patch('/usuarios/{id}/usuario-credentials', {
    responses: {
      '200': {
        description: 'Usuario.UsuarioCredentials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UsuarioCredentials, {partial: true}),
        },
      },
    })
    usuarioCredentials: Partial<UsuarioCredentials>,
    @param.query.object('where', getWhereSchemaFor(UsuarioCredentials)) where?: Where<UsuarioCredentials>,
  ): Promise<Count> {
    return this.usuarioRepository.usuarioCredentials(id).patch(usuarioCredentials, where);
  }

  @del('/usuarios/{id}/usuario-credentials', {
    responses: {
      '200': {
        description: 'Usuario.UsuarioCredentials DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UsuarioCredentials)) where?: Where<UsuarioCredentials>,
  ): Promise<Count> {
    return this.usuarioRepository.usuarioCredentials(id).delete(where);
  }
}
