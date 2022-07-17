import {inject} from '@loopback/core';
import {
  AnyObject,
  DataObject,
  DefaultCrudRepository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {DocumentoEvento, DocumentoEventoRelations} from '../models';

export class DocumentoEventoRepository extends DefaultCrudRepository<
  DocumentoEvento,
  typeof DocumentoEvento.prototype.id,
  DocumentoEventoRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(DocumentoEvento, dataSource);
  }

  async create(
    entity: DataObject<DocumentoEvento>,
    options?: AnyObject | undefined,
  ): Promise<DocumentoEvento> {
    const resp = await super.create(entity, options);
    if (resp) {
      await this.dataSource.execute(
        `UPDATE Documento SET updatedAt = '${new Date()
          .toISOString()
          .split('.')[0]
          .replace('T', ' ')}', tipoUltimoEvento = '${
          resp.tipoEvento
        }' WHERE id = ${resp.documentoId}`,
      );
    }
    return resp;
  }
}
