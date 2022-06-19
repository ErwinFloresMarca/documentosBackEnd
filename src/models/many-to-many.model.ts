import {Model, model, property} from '@loopback/repository';

@model()
export class ManyToMany extends Model {
  @property({
    type: 'number',
    min: 1,
    required: true,
  })
  relationId: number;

  @property({
    type: 'boolean',
    required: true,
  })
  link: boolean;

  constructor(data?: Partial<ManyToMany>) {
    super(data);
  }
}

export interface ManyToManyRelations {
  // describe navigational properties here
}

export type ManyToManyWithRelations = ManyToMany & ManyToManyRelations;
