import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {
  Campo,
  CampoRelations,
  TipoDocumentoCampo,
  TipoDocumentos,
} from '../models';
import {TipoDocumentoCampoRepository} from './tipo-documento-campo.repository';
import {TipoDocumentosRepository} from './tipo-documentos.repository';

export class CampoRepository extends DefaultCrudRepository<
  Campo,
  typeof Campo.prototype.id,
  CampoRelations
> {
  public readonly tipoDocumentos: HasManyThroughRepositoryFactory<
    TipoDocumentos,
    typeof TipoDocumentos.prototype.id,
    TipoDocumentoCampo,
    typeof Campo.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('TipoDocumentoCampoRepository')
    protected tipoDocumentoCampoRepositoryGetter: Getter<TipoDocumentoCampoRepository>,
    @repository.getter('TipoDocumentosRepository')
    protected tipoDocumentosRepositoryGetter: Getter<TipoDocumentosRepository>,
  ) {
    super(Campo, dataSource);
    this.tipoDocumentos = this.createHasManyThroughRepositoryFactoryFor(
      'tipoDocumentos',
      tipoDocumentosRepositoryGetter,
      tipoDocumentoCampoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tipoDocumentos',
      this.tipoDocumentos.inclusionResolver,
    );
  }
}
