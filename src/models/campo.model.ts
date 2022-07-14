import {Entity, hasMany, model, property} from '@loopback/repository';
import {TipoDocumentoCampo} from './tipo-documento-campo.model';
import {
  TipoDocumentos,
  TipoDocumentosWithRelations,
} from './tipo-documentos.model';

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

  @hasMany(() => TipoDocumentos, {through: {model: () => TipoDocumentoCampo}})
  tipoDocumentos: TipoDocumentos[];

  constructor(data?: Partial<Campo>) {
    super(data);
  }
}

export interface CampoRelations {
  tipoDocumentos?: TipoDocumentosWithRelations[];
  // describe navigational properties here
}

export type CampoWithRelations = Campo & CampoRelations;
