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
import {Area, Campo, ManyToMany, TipoDocumentos} from '../models';
import {
  AreaTipoDocumentoRepository,
  TipoDocumentosRepository,
} from '../repositories';
import Roles from '../utils/roles.util';

export class TipoDocumentoController {
  constructor(
    @repository(TipoDocumentosRepository)
    public tipoDocumentosRepository: TipoDocumentosRepository,
    @repository(AreaTipoDocumentoRepository)
    public areaTipoDocumentoRepository: AreaTipoDocumentoRepository,
  ) {}

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @post('/tipo-documentos')
  @response(200, {
    description: 'TipoDocumentos model instance',
    content: {'application/json': {schema: getModelSchemaRef(TipoDocumentos)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumentos, {
            title: 'NewTipoDocumentos',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoDocumentos: Omit<TipoDocumentos, 'id'>,
  ): Promise<TipoDocumentos> {
    return this.tipoDocumentosRepository.create(tipoDocumentos);
  }

  @authenticate('jwt')
  @get('/tipo-documentos/count')
  @response(200, {
    description: 'TipoDocumentos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TipoDocumentos) where?: Where<TipoDocumentos>,
  ): Promise<Count> {
    if (where) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const locWhere: any = {...where};
      if (locWhere.areas) {
        const whereATD = {
          where: {areaId: locWhere.areas?.id},
        };
        const listOfAreaTipoDocumentos =
          await this.areaTipoDocumentoRepository.find(whereATD);
        const refactorWhere = {
          ...locWhere,
          id: {
            inq: [
              ...new Set(
                listOfAreaTipoDocumentos.map(atp => atp.tipoDocumentosId),
              ),
            ],
          },
          areas: undefined,
        };
        Object.assign(where, refactorWhere);
      }
    }
    return this.tipoDocumentosRepository.count(where);
  }

  @authenticate('jwt')
  @get('/tipo-documentos')
  @response(200, {
    description: 'Array of TipoDocumentos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoDocumentos, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TipoDocumentos) filter?: Filter<TipoDocumentos>,
  ): Promise<TipoDocumentos[]> {
    if (filter?.where) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {...filter.where};
      if (where.areas) {
        const whereATD = {
          where: {areaId: where.areas?.id},
        };
        const listOfAreaTipoDocumentos =
          await this.areaTipoDocumentoRepository.find(whereATD);
        filter.where = {
          ...filter.where,
          id: {
            inq: [...new Set(listOfAreaTipoDocumentos.map(atp => atp.areaId))],
          },
          areas: undefined,
        };
      }
    }
    return this.tipoDocumentosRepository.find(filter);
  }

  @authenticate('jwt')
  @get('/tipo-documentos/{id}')
  @response(200, {
    description: 'TipoDocumentos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoDocumentos, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TipoDocumentos, {exclude: 'where'})
    filter?: FilterExcludingWhere<TipoDocumentos>,
  ): Promise<TipoDocumentos> {
    return this.tipoDocumentosRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @patch('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumentos PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TipoDocumentos, {partial: true}),
        },
      },
    })
    tipoDocumentos: TipoDocumentos,
  ): Promise<void> {
    tipoDocumentos.updatedAt = new Date().toISOString();
    await this.tipoDocumentosRepository.updateById(id, tipoDocumentos);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @del('/tipo-documentos/{id}')
  @response(204, {
    description: 'TipoDocumentos DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tipoDocumentosRepository.deleteById(id);
  }

  // relación campos
  @get('/tipo-documentos/{id}/campos', {
    responses: {
      '200': {
        description:
          'Array of TipoDocumentos has many Campo through TipoDocumentoCampo',
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
    return this.tipoDocumentosRepository.campos(id).find(filter);
  }

  @post('/tipo-documentos/{id}/campos', {
    responses: {
      '200': {
        description: 'create a Campo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Campo)}},
      },
    },
  })
  async createCampo(
    @param.path.number('id') id: typeof TipoDocumentos.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Campo, {
            title: 'NewCampoInTipoDocumentos',
            exclude: ['id'],
          }),
        },
      },
    })
    campo: Omit<Campo, 'id'>,
  ): Promise<Campo> {
    return this.tipoDocumentosRepository.campos(id).create(campo);
  }

  @post('/tipo-documentos/{id}/campos/links', {
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
      await this.tipoDocumentosRepository.campos(id).link(data.relationId);
    else await this.tipoDocumentosRepository.campos(id).unlink(data.relationId);
    return (
      await this.tipoDocumentosRepository.campos(id).find({fields: {id: true}})
    ).map(tp => tp.id);
  }

  @get('/tipo-documentos/{id}/campos/links', {
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
      await this.tipoDocumentosRepository.campos(id).find({fields: {id: true}})
    ).map(c => c.id);
  }

  // realcion muchos a muchos con areas
  @get('/tipo-documentos/{id}/areas', {
    responses: {
      '200': {
        description:
          'Array of TipoDocumentos has many Area through AreaTipoDocumento',
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
    return this.tipoDocumentosRepository.areas(id).find(filter);
  }

  @post('/tipo-documentos/{id}/areas/links', {
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
  async linkTipoDocumento(
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
      await this.tipoDocumentosRepository.areas(id).link(data.relationId);
    else await this.tipoDocumentosRepository.areas(id).unlink(data.relationId);
    return (
      await this.tipoDocumentosRepository.areas(id).find({fields: {id: true}})
    ).map(tp => tp.id);
  }

  @get('/tipo-documentos/{id}/areas/links', {
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
  async getLinkTipoDocumento(
    @param.path.number('id') id: number,
  ): Promise<Array<number | undefined>> {
    return (
      await this.tipoDocumentosRepository.areas(id).find({fields: {id: true}})
    ).map(a => a.id);
  }
}
