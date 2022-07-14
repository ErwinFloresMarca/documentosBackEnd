import {model, property} from '@loopback/repository';
import {TimeStamp} from './time-stamp.model';

@model()
export class DocumentoEvento extends TimeStamp {
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
  tipoEvento: string;

  @property({
    type: 'string',
    required: true,
  })
  color: string;

  @property({
    type: 'object',
    required: true,
  })
  ejecutor: object;

  @property({
    type: 'number',
  })
  documentoId?: number;

  constructor(data?: Partial<DocumentoEvento>) {
    super(data);
  }
}

export interface DocumentoEventoRelations {
  // describe navigational properties here
}

export type DocumentoEventoWithRelations = DocumentoEvento &
  DocumentoEventoRelations;
