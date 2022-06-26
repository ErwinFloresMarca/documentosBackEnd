import {belongsTo, model, property} from '@loopback/repository';
import {Area, AreaWithRelations} from './area.model';
import {TimeStamp} from './time-stamp.model';
import {Usuario, UsuarioWithRelations} from './usuario.model';

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
  usuario?: UsuarioWithRelations;
  area?: AreaWithRelations;
}

export type ResponsableWithRelations = Responsable & ResponsableRelations;
