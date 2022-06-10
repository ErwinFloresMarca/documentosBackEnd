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
import {Catalogos} from '../models';
import {CatalogosRepository} from '../repositories';

export class CatalogoController {
  constructor(
    @repository(CatalogosRepository)
    public catalogosRepository : CatalogosRepository,
  ) {}

  @post('/catalogos')
  @response(200, {
    description: 'Catalogos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Catalogos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Catalogos, {
            title: 'NewCatalogos',
            exclude: ['id'],
          }),
        },
      },
    })
    catalogos: Omit<Catalogos, 'id'>,
  ): Promise<Catalogos> {
    return this.catalogosRepository.create(catalogos);
  }

  @get('/catalogos/count')
  @response(200, {
    description: 'Catalogos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Catalogos) where?: Where<Catalogos>,
  ): Promise<Count> {
    return this.catalogosRepository.count(where);
  }

  @get('/catalogos')
  @response(200, {
    description: 'Array of Catalogos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Catalogos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Catalogos) filter?: Filter<Catalogos>,
  ): Promise<Catalogos[]> {
    return this.catalogosRepository.find(filter);
  }

  @patch('/catalogos')
  @response(200, {
    description: 'Catalogos PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Catalogos, {partial: true}),
        },
      },
    })
    catalogos: Catalogos,
    @param.where(Catalogos) where?: Where<Catalogos>,
  ): Promise<Count> {
    return this.catalogosRepository.updateAll(catalogos, where);
  }

  @get('/catalogos/{id}')
  @response(200, {
    description: 'Catalogos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Catalogos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Catalogos, {exclude: 'where'}) filter?: FilterExcludingWhere<Catalogos>
  ): Promise<Catalogos> {
    return this.catalogosRepository.findById(id, filter);
  }

  @patch('/catalogos/{id}')
  @response(204, {
    description: 'Catalogos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Catalogos, {partial: true}),
        },
      },
    })
    catalogos: Catalogos,
  ): Promise<void> {
    await this.catalogosRepository.updateById(id, catalogos);
  }

  @put('/catalogos/{id}')
  @response(204, {
    description: 'Catalogos PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() catalogos: Catalogos,
  ): Promise<void> {
    await this.catalogosRepository.replaceById(id, catalogos);
  }

  @del('/catalogos/{id}')
  @response(204, {
    description: 'Catalogos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.catalogosRepository.deleteById(id);
  }
}
