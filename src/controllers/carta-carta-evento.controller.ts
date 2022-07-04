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
import {Carta, CartaEvento} from '../models';
import {CartaRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class CartaCartaEventoController {
  constructor(
    @repository(CartaRepository) protected cartaRepository: CartaRepository,
  ) {}

  @get('/cartas/{id}/carta-eventos', {
    responses: {
      '200': {
        description: 'Array of Carta has many CartaEvento',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CartaEvento)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<CartaEvento>,
  ): Promise<CartaEvento[]> {
    return this.cartaRepository.cartaEventos(id).find(filter);
  }

  @post('/cartas/{id}/carta-eventos', {
    responses: {
      '200': {
        description: 'Carta model instance',
        content: {'application/json': {schema: getModelSchemaRef(CartaEvento)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof Carta.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CartaEvento, {
            title: 'NewCartaEventoInCarta',
            exclude: ['id'],
            optional: ['cartaId'],
          }),
        },
      },
    })
    cartaEvento: Omit<CartaEvento, 'id'>,
  ): Promise<CartaEvento> {
    return this.cartaRepository.cartaEventos(id).create(cartaEvento);
  }

  @patch('/cartas/{id}/carta-eventos', {
    responses: {
      '200': {
        description: 'Carta.CartaEvento PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CartaEvento, {partial: true}),
        },
      },
    })
    cartaEvento: Partial<CartaEvento>,
    @param.query.object('where', getWhereSchemaFor(CartaEvento))
    where?: Where<CartaEvento>,
  ): Promise<Count> {
    return this.cartaRepository.cartaEventos(id).patch(cartaEvento, where);
  }

  @del('/cartas/{id}/carta-eventos', {
    responses: {
      '200': {
        description: 'Carta.CartaEvento DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(CartaEvento))
    where?: Where<CartaEvento>,
  ): Promise<Count> {
    return this.cartaRepository.cartaEventos(id).delete(where);
  }
}
