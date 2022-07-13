import {model, property} from '@loopback/repository';
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

  constructor(data?: Partial<CartaEvento>) {
    super(data);
  }
}

export interface CartaEventoRelations {
  // describe navigational properties here
}

export type CartaEventoWithRelations = CartaEvento & CartaEventoRelations;
