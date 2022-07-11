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
import {Area, Carta, File, ManyToMany, TipoCartas} from '../models';
import {CartaRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class CartaController {
  constructor(
    @repository(CartaRepository)
    public cartaRepository: CartaRepository,
  ) {}

  @post('/cartas')
  @response(200, {
    description: 'Carta model instance',
    content: {'application/json': {schema: getModelSchemaRef(Carta)}},
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carta, {
            title: 'NewCarta',
            exclude: ['id'],
          }),
        },
      },
    })
    carta: Omit<Carta, 'id'>,
  ): Promise<Carta> {
    const lastNumDoc = await this.cartaRepository.findOne({
      order: ['numDoc DESC'],
    });
    carta.numDoc = lastNumDoc?.numDoc ? lastNumDoc.numDoc + 1 : 1;
    return this.cartaRepository.create(carta);
  }

  @get('/cartas/count')
  @response(200, {
    description: 'Carta model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async count(@param.where(Carta) where?: Where<Carta>): Promise<Count> {
    return this.cartaRepository.count(where);
  }

  @get('/cartas')
  @response(200, {
    description: 'Array of Carta model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Carta, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
  async find(@param.filter(Carta) filter?: Filter<Carta>): Promise<Carta[]> {
    return this.cartaRepository.find(filter);
  }

  @patch('/cartas')
  @response(200, {
    description: 'Carta PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carta, {partial: true}),
        },
      },
    })
    carta: Carta,
    @param.where(Carta) where?: Where<Carta>,
  ): Promise<Count> {
    return this.cartaRepository.updateAll(carta, where);
  }

  @get('/cartas/{id}')
  @response(200, {
    description: 'Carta model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Carta, {includeRelations: true}),
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Carta, {exclude: 'where'})
    filter?: FilterExcludingWhere<Carta>,
  ): Promise<Carta> {
    return this.cartaRepository.findById(id, filter);
  }

  @patch('/cartas/{id}')
  @response(204, {
    description: 'Carta PATCH success',
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carta, {partial: true}),
        },
      },
    })
    carta: Carta,
  ): Promise<void> {
    await this.cartaRepository.updateById(id, carta);
  }

  @del('/cartas/{id}')
  @response(204, {
    description: 'Carta DELETE success',
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cartaRepository.deleteById(id);
  }

  @get('/cartas/{id}/areas', {
    responses: {
      '200': {
        description: 'Array of Carta has many Area through CartaArea',
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
    return this.cartaRepository.areas(id).find(filter);
  }

  @get('/cartas/{id}/tipo-cartas', {
    responses: {
      '200': {
        description: 'TipoCartas belonging to Carta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoCartas)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getTipoCartas(
    @param.path.number('id') id: typeof Carta.prototype.id,
  ): Promise<TipoCartas> {
    return this.cartaRepository.tipoCarta(id);
  }

  @get('/cartas/{id}/file', {
    responses: {
      '200': {
        description: 'File belonging to Carta',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(File)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getFile(
    @param.path.number('id') id: typeof Carta.prototype.id,
  ): Promise<File> {
    return this.cartaRepository.file(id);
  }

  @post('/cartas/{id}/areas/links', {
    responses: {
      '200': {
        description: 'crear relación con área',
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
    if (data.link) await this.cartaRepository.areas(id).link(data.relationId);
    else await this.cartaRepository.areas(id).unlink(data.relationId);
    return (
      await this.cartaRepository.areas(id).find({fields: {id: true}})
    ).map(c => c.id);
  }

  @get('/cartas/{id}/areas/links', {
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
      await this.cartaRepository.areas(id).find({fields: {id: true}})
    ).map(a => a.id);
  }
}
