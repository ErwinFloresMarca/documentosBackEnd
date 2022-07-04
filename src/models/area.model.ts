import {hasMany, model, property} from '@loopback/repository';
import {AreaTipoCarta} from './area-tipo-carta.model';
import {Responsable, ResponsableWithRelations} from './responsable.model';
import {TimeStamp} from './time-stamp.model';
import {TipoCartas, TipoCartasWithRelations} from './tipo-cartas.model';
import {Carta} from './carta.model';
import {CartaArea} from './carta-area.model';

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

  @hasMany(() => Carta, {through: {model: () => CartaArea}})
  cartas: Carta[];

  constructor(data?: Partial<Area>) {
    super(data);
  }
}

export interface AreaRelations {
  responsables?: ResponsableWithRelations[];
  tipoCartas?: TipoCartasWithRelations[];
  // describe navigational properties here
}

export type AreaWithRelations = Area & AreaRelations;
