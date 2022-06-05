import {SchemaObject} from '@loopback/rest';

export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'number'},
    ci: {type: 'string'},
    usuario: {type: 'string'},
    rol: {type: 'string'},
  },
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['usuario', 'password'],
  properties: {
    usuario: {
      type: 'string',
      minLength: 8,
    },
    rol: {
      type: 'string',
    },
    nombres: {
      type: 'string',
    },
    paterno: {
      type: 'string',
    },
    materno: {
      type: 'string',
    },
    celular: {
      type: 'string',
    },
    ci: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

const LoginCredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['usuario', 'password'],
  properties: {
    usuario: {
      type: 'string',
      minLength: 8,
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of sign up function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export const LoginRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: LoginCredentialsSchema},
  },
};
