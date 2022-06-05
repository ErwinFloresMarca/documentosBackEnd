import {model, property} from '@loopback/repository';
import {TimeStamp} from './time-stamp.model';

@model()
export class UsuarioCredentials extends TimeStamp {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'number',
    required: true,
  })
  usuarioId: number;

  constructor(data?: Partial<UsuarioCredentials>) {
    super(data);
  }
}

export interface UsuarioCredentialsRelations {
  // describe navigational properties here
}

export type UsuarioCredentialsWithRelations = UsuarioCredentials &
  UsuarioCredentialsRelations;
