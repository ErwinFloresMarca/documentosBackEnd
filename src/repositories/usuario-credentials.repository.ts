import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {UsuarioCredentials, UsuarioCredentialsRelations} from '../models';

export class UsuarioCredentialsRepository extends DefaultCrudRepository<
  UsuarioCredentials,
  typeof UsuarioCredentials.prototype.id,
  UsuarioCredentialsRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(UsuarioCredentials, dataSource);
  }
}
