import {inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Area, DocumentoEvento, DocumentoEventoRelations} from '../models';

export class DocumentoEventoRepository extends DefaultCrudRepository<
  DocumentoEvento,
  typeof DocumentoEvento.prototype.id,
  DocumentoEventoRelations
> {
  public readonly area: BelongsToAccessor<
    Area,
    typeof DocumentoEvento.prototype.id
  >;

  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(DocumentoEvento, dataSource);
  }
}
