import {Entity, model, property} from '@loopback/repository';

@model()
export class File extends Entity {
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
  mimeType: string;

  @property({
    type: 'string',
    required: true,
  })
  originalName: string;

  @property({
    type: 'number',
    required: true,
  })
  size: number;

  @property({
    type: 'string',
    required: true,
  })
  fileName: string;

  constructor(data?: Partial<File>) {
    super(data);
  }
}

export interface FileRelations {
  // describe navigational properties here
}

export type FileWithRelations = File & FileRelations;
