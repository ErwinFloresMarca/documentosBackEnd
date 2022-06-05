import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Usuario, UsuarioCredentials, UsuarioRelations} from '../models';
import {UsuarioCredentialsRepository} from './usuario-credentials.repository';

export type Credentials = {
  nombres?: string;
  paterno?: string;
  materno?: string;
  usuario: string;
  celular?: string;
  ci?: string;
  password: string;
  email?: string;
  rol?: string;
};

export type LoginCredentials = {
  usuario: string;
  password: string;
};

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {
  public readonly usuarioCredentials: HasOneRepositoryFactory<
    UsuarioCredentials,
    typeof Usuario.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('UsuarioCredentialsRepository')
    protected usuarioCredentialsRepositoryGetter: Getter<UsuarioCredentialsRepository>,
  ) {
    super(Usuario, dataSource);
    this.usuarioCredentials = this.createHasOneRepositoryFactoryFor(
      'usuarioCredentials',
      usuarioCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'usuarioCredentials',
      this.usuarioCredentials.inclusionResolver,
    );
  }
  async findCredentials(
    userId: typeof Usuario.prototype.id,
  ): Promise<UsuarioCredentials | undefined> {
    try {
      return await this.usuarioCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
