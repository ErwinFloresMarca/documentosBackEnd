import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {AreaTipoDocumento, AreaTipoDocumentoRelations} from '../models';

export class AreaTipoDocumentoRepository extends DefaultCrudRepository<
  AreaTipoDocumento,
  typeof AreaTipoDocumento.prototype.id,
  AreaTipoDocumentoRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(AreaTipoDocumento, dataSource);
  }
}
