import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../repositories';

export function validateCredentials(credentials: Credentials) {
  // Validate Email
  // validate credentials
  if (!credentials.usuario) {
    throw new HttpErrors.UnprocessableEntity('invalid user');
  }

  // Validate Password Length
  if (!credentials.password || credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }
}
