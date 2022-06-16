import {Entity, model, property} from '@loopback/repository';

@model()
export class Catalogos extends Entity {
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
  tipo: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  constructor(data?: Partial<Catalogos>) {
    super(data);
  }
}

export interface CatalogosRelations {
  // describe navigational properties here
}

export type CatalogosWithRelations = Catalogos & CatalogosRelations;
