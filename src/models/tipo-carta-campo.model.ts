import {Entity, model, property} from '@loopback/repository';

@model()
export class TipoCartaCampo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  tipoCartasId?: number;

  @property({
    type: 'number',
  })
  campoId?: number;

  constructor(data?: Partial<TipoCartaCampo>) {
    super(data);
  }
}

export interface TipoCartaCampoRelations {
  // describe navigational properties here
}

export type TipoCartaCampoWithRelations = TipoCartaCampo & TipoCartaCampoRelations;
