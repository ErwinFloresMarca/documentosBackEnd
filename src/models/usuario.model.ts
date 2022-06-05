import {hasOne, model, property} from '@loopback/repository';
import {TimeStamp} from './time-stamp.model';
import {UsuarioCredentials} from './usuario-credentials.model';

@model()
export class Usuario extends TimeStamp {
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
  nombres: string;

  @property({
    type: 'string',
  })
  paterno: string;

  @property({
    type: 'string',
    required: true,
  })
  materno: string;

  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  ci: string;

  @property({
    type: 'string',
  })
  celular: string;

  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  usuario: string;

  @property({
    type: 'string',
    index: {unique: true},
  })
  email: string;

  @property({
    type: 'string',
  })
  avatar?: string;

  @property({
    type: 'string',
  })
  rol: string;

  @hasOne(() => UsuarioCredentials)
  usuarioCredentials: UsuarioCredentials;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
