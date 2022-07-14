import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {TipoDocumentoCampo, TipoDocumentoCampoRelations} from '../models';

export class TipoDocumentoCampoRepository extends DefaultCrudRepository<
  TipoDocumentoCampo,
  typeof TipoDocumentoCampo.prototype.id,
  TipoDocumentoCampoRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(TipoDocumentoCampo, dataSource);
  }
}
