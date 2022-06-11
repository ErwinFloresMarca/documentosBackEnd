import {model, property, belongsTo} from '@loopback/repository';
import {TimeStamp} from './time-stamp.model';
import {Usuario} from './usuario.model';
import {Area} from './area.model';

@model()
export class Responsable extends TimeStamp {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Usuario)
  usuarioId: number;

  @belongsTo(() => Area)
  areaId: number;

  constructor(data?: Partial<Responsable>) {
    super(data);
  }
}

export interface ResponsableRelations {
  // describe navigational properties here
}

export type ResponsableWithRelations = Responsable & ResponsableRelations;
