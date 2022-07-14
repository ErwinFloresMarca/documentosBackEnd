import {hasMany, model, property} from '@loopback/repository';
import {AreaTipoDocumento} from './area-tipo-documento.model';
import {DocumentoArea} from './documento-area.model';
import {Documento} from './documento.model';
import {Responsable, ResponsableWithRelations} from './responsable.model';
import {TimeStamp} from './time-stamp.model';
import {
  TipoDocumentos,
  TipoDocumentosWithRelations,
} from './tipo-documentos.model';

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

  @hasMany(() => TipoDocumentos, {through: {model: () => AreaTipoDocumento}})
  tipoDocumentos: TipoDocumentos[];

  @hasMany(() => Documento, {through: {model: () => DocumentoArea}})
  documentos: Documento[];

  constructor(data?: Partial<Area>) {
    super(data);
  }
}

export interface AreaRelations {
  responsables?: ResponsableWithRelations[];
  tipoDocumentos?: TipoDocumentosWithRelations[];
  // describe navigational properties here
}

export type AreaWithRelations = Area & AreaRelations;
