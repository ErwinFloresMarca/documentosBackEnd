import {Entity, model, property} from '@loopback/repository';

@model()
export class AreaTipoCarta extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  areaId?: number;

  @property({
    type: 'number',
  })
  tipoCartasId?: number;

  constructor(data?: Partial<AreaTipoCarta>) {
    super(data);
  }
}

export interface AreaTipoCartaRelations {
  // describe navigational properties here
}

export type AreaTipoCartaWithRelations = AreaTipoCarta & AreaTipoCartaRelations;
