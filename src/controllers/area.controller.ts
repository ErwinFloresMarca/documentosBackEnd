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
import {Area, ManyToMany, Responsable, TipoCartas} from '../models';
import {AreaRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class AreaController {
  constructor(
    @repository(AreaRepository)
    public areaRepository: AreaRepository,
  ) {}

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
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

  @authenticate('jwt')
  @get('/areas/count')
  @response(200, {
    description: 'Area model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Area) where?: Where<Area>): Promise<Count> {
    return this.areaRepository.count(where);
  }

  @authenticate('jwt')
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
  async find(@param.filter(Area) filter?: Filter<Area>): Promise<Area[]> {
    return this.areaRepository.find(filter);
  }

  @authenticate('jwt')
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
    @param.filter(Area, {exclude: 'where'}) filter?: FilterExcludingWhere<Area>,
  ): Promise<Area> {
    return this.areaRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
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
    area.updatedAt = new Date().toISOString();
    await this.areaRepository.updateById(id, area);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @del('/areas/{id}')
  @response(204, {
    description: 'Area DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.areaRepository.deleteById(id);
  }

  // relación con responsable
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
  @authenticate('jwt')
  async findResponsables(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Responsable>,
  ): Promise<Responsable[]> {
    return this.areaRepository.responsables(id).find(filter);
  }

  // relacion muchos a muchos con tipo cartas
  @get('/areas/{id}/tipo-cartas', {
    responses: {
      '200': {
        description: 'Array of Area has many TipoCartas through AreaTipoCarta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoCartas)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findTipoCartas(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<TipoCartas>,
  ): Promise<TipoCartas[]> {
    return this.areaRepository.tipoCartas(id).find(filter);
  }

  @post('/areas/{id}/tipo-cartas/links', {
    responses: {
      '200': {
        description: 'crear relación',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link tipo cartas',
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
  async linkTipoCarta(
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
      await this.areaRepository.tipoCartas(id).link(data.relationId);
    else await this.areaRepository.tipoCartas(id).unlink(data.relationId);
    return (
      await this.areaRepository.tipoCartas(id).find({fields: {id: true}})
    ).map(tp => tp.id);
  }

  @get('/areas/{id}/tipo-cartas/links', {
    responses: {
      '200': {
        description: 'lista ids relacionados tipo cartas',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link tipo cartas',
              type: 'number[]',
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getLinkTipoCarta(
    @param.path.number('id') id: number,
  ): Promise<Array<number | undefined>> {
    return (
      await this.areaRepository.tipoCartas(id).find({fields: {id: true}})
    ).map(tp => tp.id);
  }
}
