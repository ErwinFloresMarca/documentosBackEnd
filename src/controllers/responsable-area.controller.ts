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
  Area,
} from '../models';
import {ResponsableRepository} from '../repositories';

export class ResponsableAreaController {
  constructor(
    @repository(ResponsableRepository)
    public responsableRepository: ResponsableRepository,
  ) { }

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
  async getArea(
    @param.path.number('id') id: typeof Responsable.prototype.id,
  ): Promise<Area> {
    return this.responsableRepository.area(id);
  }
}
