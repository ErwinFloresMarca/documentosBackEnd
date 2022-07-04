import {Entity, model, property} from '@loopback/repository';

@model()
export class CartaArea extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  cartaId?: number;

  @property({
    type: 'number',
  })
  areaId?: number;

  constructor(data?: Partial<CartaArea>) {
    super(data);
  }
}

export interface CartaAreaRelations {
  // describe navigational properties here
}

export type CartaAreaWithRelations = CartaArea & CartaAreaRelations;
