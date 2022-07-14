import {Entity, model, property} from '@loopback/repository';

@model()
export class DocumentoArea extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  documentoId?: number;

  @property({
    type: 'number',
  })
  areaId?: number;

  constructor(data?: Partial<DocumentoArea>) {
    super(data);
  }
}

export interface DocumentoAreaRelations {
  // describe navigational properties here
}

export type DocumentoAreaWithRelations = DocumentoArea & DocumentoAreaRelations;
