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
  Area,
  Responsable,
} from '../models';
import {AreaRepository} from '../repositories';

export class AreaResponsableController {
  constructor(
    @repository(AreaRepository) protected areaRepository: AreaRepository,
  ) { }

  @get('/areas/{id}/responsables', {
    responses: {
      '200': {
        description: 'Array of Area has many Responsable',
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
    return this.areaRepository.responsables(id).find(filter);
  }

  @post('/areas/{id}/responsables', {
    responses: {
      '200': {
        description: 'Area model instance',
        content: {'application/json': {schema: getModelSchemaRef(Responsable)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Area.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Responsable, {
            title: 'NewResponsableInArea',
            exclude: ['id'],
            optional: ['areaId']
          }),
        },
      },
    }) responsable: Omit<Responsable, 'id'>,
  ): Promise<Responsable> {
    return this.areaRepository.responsables(id).create(responsable);
  }

  @patch('/areas/{id}/responsables', {
    responses: {
      '200': {
        description: 'Area.Responsable PATCH success count',
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
    return this.areaRepository.responsables(id).patch(responsable, where);
  }

  @del('/areas/{id}/responsables', {
    responses: {
      '200': {
        description: 'Area.Responsable DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Responsable)) where?: Where<Responsable>,
  ): Promise<Count> {
    return this.areaRepository.responsables(id).delete(where);
  }
}
