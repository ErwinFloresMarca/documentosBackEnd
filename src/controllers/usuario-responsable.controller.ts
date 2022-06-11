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
  Responsable,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioResponsableController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/responsables', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Responsable',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Responsable)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Responsable>,
  ): Promise<Responsable[]> {
    return this.usuarioRepository.responsables(id).find(filter);
  }

  @post('/usuarios/{id}/responsables', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Responsable)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Responsable, {
            title: 'NewResponsableInUsuario',
            exclude: ['id'],
            optional: ['usuarioId']
          }),
        },
      },
    }) responsable: Omit<Responsable, 'id'>,
  ): Promise<Responsable> {
    return this.usuarioRepository.responsables(id).create(responsable);
  }

  @patch('/usuarios/{id}/responsables', {
    responses: {
      '200': {
        description: 'Usuario.Responsable PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Responsable, {partial: true}),
        },
      },
    })
    responsable: Partial<Responsable>,
    @param.query.object('where', getWhereSchemaFor(Responsable)) where?: Where<Responsable>,
  ): Promise<Count> {
    return this.usuarioRepository.responsables(id).patch(responsable, where);
  }

  @del('/usuarios/{id}/responsables', {
    responses: {
      '200': {
        description: 'Usuario.Responsable DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Responsable)) where?: Where<Responsable>,
  ): Promise<Count> {
    return this.usuarioRepository.responsables(id).delete(where);
  }
}
