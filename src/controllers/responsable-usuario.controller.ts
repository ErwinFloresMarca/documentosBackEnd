import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Responsable,
  Usuario,
} from '../models';
import {ResponsableRepository} from '../repositories';

export class ResponsableUsuarioController {
  constructor(
    @repository(ResponsableRepository)
    public responsableRepository: ResponsableRepository,
  ) { }

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
  async getUsuario(
    @param.path.number('id') id: typeof Responsable.prototype.id,
  ): Promise<Usuario> {
    return this.responsableRepository.usuario(id);
  }
}
