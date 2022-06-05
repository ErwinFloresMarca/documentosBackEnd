import {Entity, model, property} from '@loopback/repository';

@model()
export class TimeStamp extends Entity {
  @property({
    type: 'boolean',
    default: true,
    required: false,
  })
  estado?: boolean;

  @property({
    type: 'date',
    defaultFn: 'now',
    required: false,
  })
  createdAt?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    required: false,
  })
  updatedAt?: string;

  constructor(data?: Partial<TimeStamp>) {
    super(data);
  }
}

export interface TimeStampRelations {
  // describe navigational properties here
}

export type TimeStampWithRelations = TimeStamp & TimeStampRelations;
