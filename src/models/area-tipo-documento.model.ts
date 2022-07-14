import {Entity, model, property} from '@loopback/repository';

@model()
export class AreaTipoDocumento extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  areaId?: number;

  @property({
    type: 'number',
  })
  tipoDocumentosId?: number;

  constructor(data?: Partial<AreaTipoDocumento>) {
    super(data);
  }
}

export interface AreaTipoDocumentoRelations {
  // describe navigational properties here
}

export type AreaTipoDocumentoWithRelations = AreaTipoDocumento &
  AreaTipoDocumentoRelations;
