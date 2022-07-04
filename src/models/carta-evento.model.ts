import {belongsTo, model, property} from '@loopback/repository';
import {Area, AreaWithRelations} from './area.model';
import {TimeStamp} from './time-stamp.model';

@model()
export class CartaEvento extends TimeStamp {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  tipoEvento: string;

  @property({
    type: 'string',
    required: true,
  })
  color: string;

  @property({
    type: 'object',
    required: true,
  })
  ejecutor: object;

  @property({
    type: 'number',
  })
  cartaId?: number;

  @belongsTo(() => Area)
  areaId: number;

  constructor(data?: Partial<CartaEvento>) {
    super(data);
  }
}

export interface CartaEventoRelations {
  area?: AreaWithRelations;
  // describe navigational properties here
}

export type CartaEventoWithRelations = CartaEvento & CartaEventoRelations;
