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
import {Campo, ManyToMany, TipoCartas} from '../models';
import {CampoRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class CampoController {
  constructor(
    @repository(CampoRepository)
    public campoRepository: CampoRepository,
  ) {}

  @post('/campos')
  @response(200, {
    description: 'Campo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Campo)}},
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
          schema: getModelSchemaRef(Campo, {
            title: 'NewCampo',
            exclude: ['id'],
          }),
        },
      },
    })
    campo: Omit<Campo, 'id'>,
  ): Promise<Campo> {
    return this.campoRepository.create(campo);
  }

  @get('/campos/count')
  @response(200, {
    description: 'Campo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async count(@param.where(Campo) where?: Where<Campo>): Promise<Count> {
    return this.campoRepository.count(where);
  }

  @get('/campos')
  @response(200, {
    description: 'Array of Campo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Campo, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
  async find(@param.filter(Campo) filter?: Filter<Campo>): Promise<Campo[]> {
    return this.campoRepository.find(filter);
  }

  @get('/campos/{id}')
  @response(200, {
    description: 'Campo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Campo, {includeRelations: true}),
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Campo, {exclude: 'where'})
    filter?: FilterExcludingWhere<Campo>,
  ): Promise<Campo> {
    return this.campoRepository.findById(id, filter);
  }

  @patch('/campos/{id}')
  @response(204, {
    description: 'Campo PATCH success',
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
          schema: getModelSchemaRef(Campo, {partial: true}),
        },
      },
    })
    campo: Campo,
  ): Promise<void> {
    await this.campoRepository.updateById(id, campo);
  }

  @del('/campos/{id}')
  @response(204, {
    description: 'Campo DELETE success',
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.campoRepository.deleteById(id);
  }

  // relacion con tipo cartas
  @get('/campos/{id}/tipo-cartas', {
    responses: {
      '200': {
        description:
          'Array of Campo has many TipoCartas through TipoCartaCampo',
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
    return this.campoRepository.tipoCartas(id).find(filter);
  }

  @post('/campos/tipo-cartas/link', {
    responses: {
      '200': {
        description: 'crear relación',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ManyToMany, {
              title: 'ManyToManySchema',
            }),
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
  ): Promise<void> {
    return this.campoRepository.tipoCartas(data.id).link(data.relationId);
  }

  @post('/campos/tipo-cartas/unlink', {
    responses: {
      '200': {
        description: 'eliminar relación',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ManyToMany, {
              title: 'ManyToManySchema',
            }),
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
  async unlinkTipoCarta(
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
  ): Promise<void> {
    return this.campoRepository.tipoCartas(data.id).unlink(data.relationId);
  }
}
