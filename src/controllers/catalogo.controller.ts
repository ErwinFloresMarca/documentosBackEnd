import {authenticate} from '@loopback/authentication';
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
import {Catalogos} from '../models';
import {CatalogosRepository} from '../repositories';

export class CatalogoController {
  constructor(
    @repository(CatalogosRepository)
    public catalogosRepository: CatalogosRepository,
  ) {}

  @post('/catalogos')
  @response(200, {
    description: 'Catalogos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Catalogos)}},
  })
  @authenticate('jwt')
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
  @authenticate('jwt')
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
  @authenticate('jwt')
  async find(
    @param.filter(Catalogos) filter?: Filter<Catalogos>,
  ): Promise<Catalogos[]> {
    return this.catalogosRepository.find(filter);
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
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Catalogos, {exclude: 'where'})
    filter?: FilterExcludingWhere<Catalogos>,
  ): Promise<Catalogos> {
    return this.catalogosRepository.findById(id, filter);
  }

  @patch('/catalogos/{id}')
  @response(204, {
    description: 'Catalogos PATCH success',
  })
  @authenticate('jwt')
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

  @del('/catalogos/{id}')
  @response(204, {
    description: 'Catalogos DELETE success',
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.catalogosRepository.deleteById(id);
  }
}
