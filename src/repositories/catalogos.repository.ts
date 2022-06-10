import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Catalogos, CatalogosRelations} from '../models';

export class CatalogosRepository extends DefaultCrudRepository<
  Catalogos,
  typeof Catalogos.prototype.id,
  CatalogosRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Catalogos, dataSource);
  }
}
