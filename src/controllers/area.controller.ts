import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Area} from '../models';
import {AreaRepository} from '../repositories';

export class AreaController {
  constructor(
    @repository(AreaRepository)
    public areaRepository : AreaRepository,
  ) {}

  @post('/areas')
  @response(200, {
    description: 'Area model instance',
    content: {'application/json': {schema: getModelSchemaRef(Area)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Area, {
            title: 'NewArea',
            exclude: ['id'],
          }),
        },
      },
    })
    area: Omit<Area, 'id'>,
  ): Promise<Area> {
    return this.areaRepository.create(area);
  }

  @get('/areas/count')
  @response(200, {
    description: 'Area model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Area) where?: Where<Area>,
  ): Promise<Count> {
    return this.areaRepository.count(where);
  }

  @get('/areas')
  @response(200, {
    description: 'Array of Area model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Area, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Area) filter?: Filter<Area>,
  ): Promise<Area[]> {
    return this.areaRepository.find(filter);
  }

  @patch('/areas')
  @response(200, {
    description: 'Area PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Area, {partial: true}),
        },
      },
    })
    area: Area,
    @param.where(Area) where?: Where<Area>,
  ): Promise<Count> {
    return this.areaRepository.updateAll(area, where);
  }

  @get('/areas/{id}')
  @response(200, {
    description: 'Area model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Area, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Area, {exclude: 'where'}) filter?: FilterExcludingWhere<Area>
  ): Promise<Area> {
    return this.areaRepository.findById(id, filter);
  }

  @patch('/areas/{id}')
  @response(204, {
    description: 'Area PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Area, {partial: true}),
        },
      },
    })
    area: Area,
  ): Promise<void> {
    await this.areaRepository.updateById(id, area);
  }

  @put('/areas/{id}')
  @response(204, {
    description: 'Area PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() area: Area,
  ): Promise<void> {
    await this.areaRepository.replaceById(id, area);
  }

  @del('/areas/{id}')
  @response(204, {
    description: 'Area DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.areaRepository.deleteById(id);
  }
}
