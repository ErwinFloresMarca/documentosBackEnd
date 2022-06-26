import {Entity, hasMany, model, property} from '@loopback/repository';
import {TipoCartaCampo} from './tipo-carta-campo.model';
import {TipoCartas, TipoCartasWithRelations} from './tipo-cartas.model';

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

  @hasMany(() => TipoCartas, {through: {model: () => TipoCartaCampo}})
  tipoCartas: TipoCartas[];

  constructor(data?: Partial<Campo>) {
    super(data);
  }
}

export interface CampoRelations {
  tipoCartas?: TipoCartasWithRelations[];
  // describe navigational properties here
}

export type CampoWithRelations = Campo & CampoRelations;
