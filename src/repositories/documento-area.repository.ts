import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {DocumentoArea, DocumentoAreaRelations} from '../models';

export class DocumentoAreaRepository extends DefaultCrudRepository<
  DocumentoArea,
  typeof DocumentoArea.prototype.id,
  DocumentoAreaRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(DocumentoArea, dataSource);
  }
}
