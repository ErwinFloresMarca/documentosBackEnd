import {hasMany, hasOne, model, property} from '@loopback/repository';
import {Responsable, ResponsableWithRelations} from './responsable.model';
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
    nullable: true,
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
    nullable: true,
  })
  ci: string;

  @property({
    type: 'string',
    nullable: true,
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
    nullable: true,
  })
  email: string;

  @property({
    type: 'string',
    nullable: true,
  })
  avatar?: string;

  @property({
    type: 'string',
  })
  rol: string;

  @hasOne(() => UsuarioCredentials)
  usuarioCredentials: UsuarioCredentials;

  @hasMany(() => Responsable)
  responsables: Responsable[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
  responsables?: ResponsableWithRelations[];
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
