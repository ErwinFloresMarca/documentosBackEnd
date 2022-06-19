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
import {Area, Campo, ManyToMany, TipoCartas} from '../models';
import {TipoCartasRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class TipoCartaController {
  constructor(
    @repository(TipoCartasRepository)
    public tipoCartasRepository: TipoCartasRepository,
  ) {}

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @post('/tipo-cartas')
  @response(200, {
    description: 'TipoCartas model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoCartas)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCartas, {
            title: 'NewTipoCartas',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoCartas: Omit<TipoCartas, 'id'>,
  ): Promise<TipoCartas> {
    return this.tipoCartasRepository.create(tipoCartas);
  }

  @authenticate('jwt')
  @get('/tipo-cartas/count')
  @response(200, {
    description: 'TipoCartas model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoCartas) where?: Where<TipoCartas>,
  ): Promise<Count> {
    return this.tipoCartasRepository.count(where);
  }

  @authenticate('jwt')
  @get('/tipo-cartas')
  @response(200, {
    description: 'Array of TipoCartas model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoCartas, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoCartas) filter?: Filter<TipoCartas>,
  ): Promise<TipoCartas[]> {
    return this.tipoCartasRepository.find(filter);
  }

  @authenticate('jwt')
  @get('/tipo-cartas/{id}')
  @response(200, {
    description: 'TipoCartas model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoCartas, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoCartas, {exclude: 'where'})
    filter?: FilterExcludingWhere<TipoCartas>,
  ): Promise<TipoCartas> {
    return this.tipoCartasRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @patch('/tipo-cartas/{id}')
  @response(204, {
    description: 'TipoCartas PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoCartas, {partial: true}),
        },
      },
    })
    tipoCartas: TipoCartas,
  ): Promise<void> {
    tipoCartas.updatedAt = new Date().toISOString();
    await this.tipoCartasRepository.updateById(id, tipoCartas);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @del('/tipo-cartas/{id}')
  @response(204, {
    description: 'TipoCartas DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoCartasRepository.deleteById(id);
  }

  // relación campos
  @get('/tipo-cartas/{id}/campos', {
    responses: {
      '200': {
        description:
          'Array of TipoCartas has many Campo through TipoCartaCampo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Campo)},
          },
        },
      },
    },
  })
  async findCampos(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Campo>,
  ): Promise<Campo[]> {
    return this.tipoCartasRepository.campos(id).find(filter);
  }

  @post('/tipo-cartas/{id}/campos', {
    responses: {
      '200': {
        description: 'create a Campo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Campo)}},
      },
    },
  })
  async createCampo(
    @param.path.number('id') id: typeof TipoCartas.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Campo, {
            title: 'NewCampoInTipoCartas',
            exclude: ['id'],
          }),
        },
      },
    })
    campo: Omit<Campo, 'id'>,
  ): Promise<Campo> {
    return this.tipoCartasRepository.campos(id).create(campo);
  }

  @post('/tipo-cartas/{id}/campos/links', {
    responses: {
      '200': {
        description: 'crear relación',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link campos',
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
  async linkCampos(
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
      await this.tipoCartasRepository.campos(id).link(data.relationId);
    else await this.tipoCartasRepository.campos(id).unlink(data.relationId);
    return (
      await this.tipoCartasRepository.campos(id).find({fields: {id: true}})
    ).map(tp => tp.id);
  }

  @get('/tipo-cartas/{id}/campos/links', {
    responses: {
      '200': {
        description: 'lista ids relacionados campos',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link campos',
              type: 'number[]',
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getLinkCampos(
    @param.path.number('id') id: number,
  ): Promise<Array<number | undefined>> {
    return (
      await this.tipoCartasRepository.campos(id).find({fields: {id: true}})
    ).map(c => c.id);
  }

  // realcion muchos a muchos con areas
  @get('/tipo-cartas/{id}/areas', {
    responses: {
      '200': {
        description: 'Array of TipoCartas has many Area through AreaTipoCarta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Area)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findAreas(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Area>,
  ): Promise<Area[]> {
    return this.tipoCartasRepository.areas(id).find(filter);
  }

  @post('/tipo-cartas/{id}/areas/links', {
    responses: {
      '200': {
        description: 'crear relación',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link areas',
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
      await this.tipoCartasRepository.areas(id).link(data.relationId);
    else await this.tipoCartasRepository.areas(id).unlink(data.relationId);
    return (
      await this.tipoCartasRepository.areas(id).find({fields: {id: true}})
    ).map(tp => tp.id);
  }

  @get('/tipo-cartas/{id}/areas/links', {
    responses: {
      '200': {
        description: 'lista ids relacionados areas',
        content: {
          'application/json': {
            schema: {
              title: 'ids of link areas',
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
      await this.tipoCartasRepository.areas(id).find({fields: {id: true}})
    ).map(a => a.id);
  }
}
