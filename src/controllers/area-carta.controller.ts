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
import {Area, Carta} from '../models';
import {AreaRepository} from '../repositories';
import Roles from '../utils/roles.util';
import {CartaRepository} from './../repositories/carta.repository';

export class AreaCartaController {
  constructor(
    @repository(AreaRepository) protected areaRepository: AreaRepository,
    @repository(CartaRepository) protected cartaRepository: CartaRepository,
  ) {}

  @authenticate('jwt')
  @get('/areas/{id}/cartas', {
    responses: {
      '200': {
        description: 'Array of Area has many Carta through CartaArea',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Carta)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Carta>,
  ): Promise<Carta[]> {
    return this.areaRepository.cartas(id).find(filter);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @post('/areas/{id}/cartas', {
    responses: {
      '200': {
        description: 'create a Carta model instance',
        content: {'application/json': {schema: getModelSchemaRef(Carta)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Area.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carta, {
            title: 'NewCartaInArea',
            exclude: ['id'],
          }),
        },
      },
    })
    carta: Omit<Carta, 'id'>,
  ): Promise<Carta> {
    return this.areaRepository.cartas(id).create(carta);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @patch('/areas/{id}/cartas', {
    responses: {
      '200': {
        description: 'Area.Carta PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Carta, {partial: true}),
        },
      },
    })
    carta: Partial<Carta>,
    @param.query.object('where', getWhereSchemaFor(Carta)) where?: Where<Carta>,
  ): Promise<Count> {
    return this.areaRepository.cartas(id).patch(carta, where);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @del('/areas/{id}/cartas', {
    responses: {
      '200': {
        description: 'Area.Carta DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Carta)) where?: Where<Carta>,
  ): Promise<Count> {
    return this.areaRepository.cartas(id).delete(where);
  }
}
