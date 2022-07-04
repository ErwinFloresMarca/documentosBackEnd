import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {CartaArea, CartaAreaRelations} from '../models';

export class CartaAreaRepository extends DefaultCrudRepository<
  CartaArea,
  typeof CartaArea.prototype.id,
  CartaAreaRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(CartaArea, dataSource);
  }
}
