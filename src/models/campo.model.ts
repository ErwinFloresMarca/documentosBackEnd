import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {Catalogos} from './catalogos.model';
import {TipoCartas} from './tipo-cartas.model';
import {TipoCartaCampo} from './tipo-carta-campo.model';

@model()
export class Campo extends Entity {
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

  @property({
    type: 'string',
    required: true,
  })
  label: string;

  @property({
    type: 'string',
    required: true,
  })
  placeholder: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  dataType: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'boolean',
    default: false,
  })
  conCatalogo?: boolean;

  @property({
    type: 'string',
  })
  tipoCatalogo?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  required?: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  estado?: boolean;

  @hasOne(() => Catalogos, {keyTo: 'tipo'})
  catalogos: Catalogos;

  @hasMany(() => TipoCartas, {through: {model: () => TipoCartaCampo}})
  tipoCartas: TipoCartas[];

  constructor(data?: Partial<Campo>) {
    super(data);
  }
}

export interface CampoRelations {
  // describe navigational properties here
}

export type CampoWithRelations = Campo & CampoRelations;
