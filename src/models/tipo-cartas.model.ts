import {model, property} from '@loopback/repository';
import {TimeStamp} from './';

@model()
export class TipoCartas extends TimeStamp {
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
  nombre: string;

  constructor(data?: Partial<TipoCartas>) {
    super(data);
  }
}

export interface TipoCartasRelations {
  // describe navigational properties here
}

export type TipoCartasWithRelations = TipoCartas & TipoCartasRelations;
