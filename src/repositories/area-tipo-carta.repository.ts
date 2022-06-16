import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {AreaTipoCarta, AreaTipoCartaRelations} from '../models';

export class AreaTipoCartaRepository extends DefaultCrudRepository<
  AreaTipoCarta,
  typeof AreaTipoCarta.prototype.id,
  AreaTipoCartaRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(AreaTipoCarta, dataSource);
  }
}
