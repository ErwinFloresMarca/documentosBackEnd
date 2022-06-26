import {hasMany, model, property} from '@loopback/repository';
import {AreaTipoCarta} from './area-tipo-carta.model';
import {Area, AreaWithRelations} from './area.model';
import {Campo, CampoWithRelations} from './campo.model';
import {TimeStamp} from './time-stamp.model';
import {TipoCartaCampo} from './tipo-carta-campo.model';

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

  @hasMany(() => Campo, {through: {model: () => TipoCartaCampo}})
  campos: Campo[];

  @hasMany(() => Area, {through: {model: () => AreaTipoCarta}})
  areas: Area[];

  constructor(data?: Partial<TipoCartas>) {
    super(data);
  }
}

export interface TipoCartasRelations {
  // describe navigational properties here
  campos?: CampoWithRelations[];
  areas?: AreaWithRelations[];
}

export type TipoCartasWithRelations = TipoCartas & TipoCartasRelations;
