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
  response,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {Documento} from '../models';
import {AreaRepository, DocumentoAreaRepository} from '../repositories';
import Roles from '../utils/roles.util';
import {Area} from './../models/area.model';
import {DocumentoRepository} from './../repositories/documento.repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SQLoperators: any = {
  eq: '=',
  and: 'and',
  or: 'or',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  between: 'BETWEEN',
  inq: 'IN',
  nin: 'NOT IN',
  neq: '!=',
  like: 'LIKE',
};

export class AreaDocumentoController {
  constructor(
    @repository(AreaRepository) protected areaRepository: AreaRepository,
    @repository(DocumentoAreaRepository)
    protected documentoAreaRepository: DocumentoAreaRepository,
    @repository(DocumentoRepository)
    protected documentoRepository: DocumentoRepository,
  ) {}

  @authenticate('jwt')
  @get('/areas/{id}/documentos/count')
  @response(200, {
    description: 'Documento model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.path.number('id') id: number,
    @param.where(Documento) where?: Where<Documento>,
  ): Promise<Count> {
    let conditions = `da.areaId = ${id}`;
    if (where) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lw: any = {...where};
      Object.keys(lw).forEach(key => {
        let column = key.includes('.')
          ? `JSON_EXTRACT(d.${key.split('.')[0]},'$.${key.split('.')[1]}')`
          : `d.${key}`;
        let operator = '=';
        let value = lw[key];
        if (typeof value === 'string') {
          value = `'${value}'`;
        }
        if (typeof lw[key] == 'object') {
          operator = Object.keys(lw[key])[0];
          value = lw[key][operator];
          if (typeof value === 'string') {
            value = `'${value}'`;
          }
          if (operator === 'like') {
            if (lw[key].options) {
              column = `LOWER(${column})`;
              value = `LOWER(${value})`;
            }
          }
          if (operator === 'between') {
            value = `${
              typeof value[0] === 'string' ? `'${value[0]}'` : value[0]
            } AND ${typeof value[1] === 'string' ? `'${value[1]}'` : value[1]}`;
          }
          if (operator === 'inq') {
            value = JSON.stringify(value).replace('[', '(').replace(']', ')');
          }
        }
        const condition = `${column} ${
          SQLoperators[operator] ? SQLoperators[operator] : operator
        } ${value}`;
        // console.log('condition: ', condition);
        conditions += ` and ${condition}`;
      });
    }
    const queryString = `SELECT count(*) as count FROM DocumentoArea as da, Documento as d WHERE da.documentoId = d.id and ${conditions}`;
    // console.log('query sql: ', queryString);
    const resp = await this.areaRepository.execute(queryString);
    return resp[0];
  }

  @authenticate('jwt')
  @get('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'Array of Area has many Documento through DocumentoArea',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Documento)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Documento>,
  ): Promise<Documento[]> {
    let conditions = `da.areaId = ${id}`;
    if (filter?.where) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lw: any = {...filter.where};
      Object.keys(lw).forEach(key => {
        let column = key.includes('.')
          ? `JSON_EXTRACT(d.${key.split('.')[0]},'$.${key.split('.')[1]}')`
          : `d.${key}`;
        let operator = '=';
        let value = lw[key];
        if (typeof value === 'string') {
          value = `'${value}'`;
        }
        if (typeof lw[key] == 'object') {
          operator = Object.keys(lw[key])[0];
          value = lw[key][operator];
          if (typeof value === 'string') {
            value = `'${value}'`;
          }
          if (operator === 'like') {
            if (lw[key].options) {
              column = `LOWER(${column})`;
              value = `LOWER(${value})`;
            }
          }
          if (operator === 'between') {
            value = `${
              typeof value[0] === 'string' ? `'${value[0]}'` : value[0]
            } AND ${typeof value[1] === 'string' ? `'${value[1]}'` : value[1]}`;
          }
          if (operator === 'inq') {
            value = JSON.stringify(value).replace('[', '(').replace(']', ')');
          }
        }
        const condition = `${column} ${
          SQLoperators[operator] ? SQLoperators[operator] : operator
        } ${value}`;
        conditions += ` and ${condition}`;
      });
    }
    let queryString = `SELECT d.id FROM DocumentoArea as da, Documento as d WHERE da.documentoId = d.id and ${conditions}`;
    // order
    if (filter?.order) {
      queryString += ` ORDER BY ${filter?.order}`;
    }
    if (filter?.limit) {
      queryString += ` LIMIT ${filter?.limit}`;
      if (filter?.skip) {
        queryString += ` OFFSET  ${filter?.skip}`;
      }
    }
    const resp = (await this.areaRepository.execute(queryString)) as Array<{
      id: number;
    }>;
    // map result
    // include relations
    const documentos: Documento[] = [];
    for (const doc of resp) {
      documentos.push(
        await this.documentoRepository.findById(doc.id, {
          include: filter?.include,
        }),
      );
    }
    return documentos;
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @post('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'create a Documento model instance',
        content: {'application/json': {schema: getModelSchemaRef(Documento)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Area.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, {
            title: 'NewDocumentoInArea',
            exclude: ['id'],
          }),
        },
      },
    })
    documento: Omit<Documento, 'id'>,
  ): Promise<Documento> {
    return this.areaRepository.documentos(id).create(documento);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @patch('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'Area.Documento PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Documento, {partial: true}),
        },
      },
    })
    documento: Partial<Documento>,
    @param.query.object('where', getWhereSchemaFor(Documento))
    where?: Where<Documento>,
  ): Promise<Count> {
    return this.areaRepository.documentos(id).patch(documento, where);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.admin, Roles.secretario, Roles.director],
    voters: [basicAuthorization],
  })
  @del('/areas/{id}/documentos', {
    responses: {
      '200': {
        description: 'Area.Documento DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Documento))
    where?: Where<Documento>,
  ): Promise<Count> {
    return this.areaRepository.documentos(id).delete(where);
  }
}
