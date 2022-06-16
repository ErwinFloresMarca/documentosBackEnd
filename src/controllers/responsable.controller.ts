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
import {Area, Responsable, Usuario} from '../models';
import {ResponsableRepository} from '../repositories';
import Roles from '../utils/roles.util';

export class ResponsableController {
  constructor(
    @repository(ResponsableRepository)
    public responsableRepository: ResponsableRepository,
  ) {}

  @post('/responsables')
  @response(200, {
    description: 'Responsable model instance',
    content: {'application/json': {schema: getModelSchemaRef(Responsable)}},
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
          schema: getModelSchemaRef(Responsable, {
            title: 'NewResponsable',
            exclude: ['id'],
          }),
        },
      },
    })
    responsable: Omit<Responsable, 'id'>,
  ): Promise<Responsable> {
    return this.responsableRepository.create(responsable);
  }

  @get('/responsables/count')
  @response(200, {
    description: 'Responsable model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async count(
    @param.where(Responsable) where?: Where<Responsable>,
  ): Promise<Count> {
    return this.responsableRepository.count(where);
  }

  @get('/responsables')
  @response(200, {
    description: 'Array of Responsable model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Responsable, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Responsable) filter?: Filter<Responsable>,
  ): Promise<Responsable[]> {
    return this.responsableRepository.find(filter);
  }

  @get('/responsables/{id}')
  @response(200, {
    description: 'Responsable model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Responsable, {includeRelations: true}),
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Responsable, {exclude: 'where'})
    filter?: FilterExcludingWhere<Responsable>,
  ): Promise<Responsable> {
    return this.responsableRepository.findById(id, filter);
  }

  @patch('/responsables/{id}')
  @response(204, {
    description: 'Responsable PATCH success',
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
          schema: getModelSchemaRef(Responsable, {partial: true}),
        },
      },
    })
    responsable: Responsable,
  ): Promise<void> {
    await this.responsableRepository.updateById(id, responsable);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @del('/responsables/{id}')
  @response(204, {
    description: 'Responsable DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.responsableRepository.deleteById(id);
  }

  // relacion con area
  @get('/responsables/{id}/area', {
    responses: {
      '200': {
        description: 'Area belonging to Responsable',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Area)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getArea(
    @param.path.number('id') id: typeof Responsable.prototype.id,
  ): Promise<Area> {
    return this.responsableRepository.area(id);
  }

  // relacion con usuario
  @get('/responsables/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Responsable',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuario)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getUsuario(
    @param.path.number('id') id: typeof Responsable.prototype.id,
  ): Promise<Usuario> {
    return this.responsableRepository.usuario(id);
  }
}
