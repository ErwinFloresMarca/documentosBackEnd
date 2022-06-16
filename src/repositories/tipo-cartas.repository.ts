import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {TipoCartas, TipoCartasRelations} from '../models';

export class TipoCartasRepository extends DefaultCrudRepository<
  TipoCartas,
  typeof TipoCartas.prototype.id,
  TipoCartasRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(TipoCartas, dataSource);
  }
}
