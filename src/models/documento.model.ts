import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {Area, AreaWithRelations} from './area.model';
import {DocumentoArea} from './documento-area.model';
import {
  DocumentoEvento,
  DocumentoEventoWithRelations,
} from './documento-evento.model';
import {File, FileWithRelations} from './file.model';
import {TimeStamp} from './time-stamp.model';
import {
  TipoDocumentos,
  TipoDocumentosWithRelations,
} from './tipo-documentos.model';

@model()
export class Documento extends TimeStamp {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  numDoc?: number;

  @property({
    type: 'date',
    required: true,
  })
  fechaRecepcion: string;

  @property({
    type: 'object',
    required: true,
  })
  campos: object;

  @belongsTo(() => TipoDocumentos, {name: 'tipoDocumento'})
  tipoDocumentosId: number;

  @belongsTo(() => File)
  fileId: number;

  @hasMany(() => Area, {through: {model: () => DocumentoArea}})
  areas: Area[];

  @hasMany(() => DocumentoEvento)
  documentoEventos: DocumentoEvento[];

  @property({
    type: 'string',
  })
  tipoUltimoEvento: string;

  @belongsTo(() => DocumentoEvento, {
    name: 'ultimoEvento',
    keyFrom: 'ultimoEventoId',
  })
  ultimoEventoId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Documento>) {
    super(data);
  }
}

export interface DocumentoRelations {
  // describe navigational properties here
  tipoDocumento?: TipoDocumentosWithRelations;
  file?: FileWithRelations;
  areas?: AreaWithRelations[];
  documentoEventos?: DocumentoEventoWithRelations[];
  ultimoEvento?: DocumentoEventoWithRelations;
}

export type DocumentoWithRelations = Documento & DocumentoRelations;
