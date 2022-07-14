import {Entity, model, property} from '@loopback/repository';

@model()
export class TipoDocumentoCampo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  tipoDocumentosId?: number;

  @property({
    type: 'number',
  })
  campoId?: number;

  constructor(data?: Partial<TipoDocumentoCampo>) {
    super(data);
  }
}

export interface TipoDocumentoCampoRelations {
  // describe navigational properties here
}

export type TipoDocumentoCampoWithRelations = TipoDocumentoCampo &
  TipoDocumentoCampoRelations;
