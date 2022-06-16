import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {TipoCartaCampo, TipoCartaCampoRelations} from '../models';

export class TipoCartaCampoRepository extends DefaultCrudRepository<
  TipoCartaCampo,
  typeof TipoCartaCampo.prototype.id,
  TipoCartaCampoRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(TipoCartaCampo, dataSource);
  }
}
