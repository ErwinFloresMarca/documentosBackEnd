import {model, property, hasMany} from '@loopback/repository';
import {TimeStamp} from './time-stamp.model';
import {Responsable} from './responsable.model';
import {TipoCartas} from './tipo-cartas.model';
import {AreaTipoCarta} from './area-tipo-carta.model';

@model()
export class Area extends TimeStamp {
  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  responsableActualId?: number;

  @hasMany(() => Responsable)
  responsables: Responsable[];

  @hasMany(() => TipoCartas, {through: {model: () => AreaTipoCarta}})
  tipoCartas: TipoCartas[];

  constructor(data?: Partial<Area>) {
    super(data);
  }
}

export interface AreaRelations {
  // describe navigational properties here
}

export type AreaWithRelations = Area & AreaRelations;
