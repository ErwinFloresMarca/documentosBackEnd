import {inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Area, CartaEvento, CartaEventoRelations} from '../models';

export class CartaEventoRepository extends DefaultCrudRepository<
  CartaEvento,
  typeof CartaEvento.prototype.id,
  CartaEventoRelations
> {
  public readonly area: BelongsToAccessor<
    Area,
    typeof CartaEvento.prototype.id
  >;

  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(CartaEvento, dataSource);
  }
}
