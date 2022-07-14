import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {
  Area,
  AreaTipoDocumento,
  Campo,
  TipoDocumentoCampo,
  TipoDocumentos,
  TipoDocumentosRelations,
} from '../models';
import {AreaTipoDocumentoRepository} from './area-tipo-documento.repository';
import {AreaRepository} from './area.repository';
import {CampoRepository} from './campo.repository';
import {TipoDocumentoCampoRepository} from './tipo-documento-campo.repository';

export class TipoDocumentosRepository extends DefaultCrudRepository<
  TipoDocumentos,
  typeof TipoDocumentos.prototype.id,
  TipoDocumentosRelations
> {
  public readonly campos: HasManyThroughRepositoryFactory<
    Campo,
    typeof Campo.prototype.id,
    TipoDocumentoCampo,
    typeof TipoDocumentos.prototype.id
  >;

  public readonly areas: HasManyThroughRepositoryFactory<
    Area,
    typeof Area.prototype.id,
    AreaTipoDocumento,
    typeof TipoDocumentos.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('TipoDocumentoCampoRepository')
    protected tipoDocumentoCampoRepositoryGetter: Getter<TipoDocumentoCampoRepository>,
    @repository.getter('CampoRepository')
    protected campoRepositoryGetter: Getter<CampoRepository>,
    @repository.getter('AreaTipoDocumentoRepository')
    protected areaTipoDocumentoRepositoryGetter: Getter<AreaTipoDocumentoRepository>,
    @repository.getter('AreaRepository')
    protected areaRepositoryGetter: Getter<AreaRepository>,
  ) {
    super(TipoDocumentos, dataSource);
    this.areas = this.createHasManyThroughRepositoryFactoryFor(
      'areas',
      areaRepositoryGetter,
      areaTipoDocumentoRepositoryGetter,
    );
    this.registerInclusionResolver('areas', this.areas.inclusionResolver);
    this.campos = this.createHasManyThroughRepositoryFactoryFor(
      'campos',
      campoRepositoryGetter,
      tipoDocumentoCampoRepositoryGetter,
    );
    this.registerInclusionResolver('campos', this.campos.inclusionResolver);
  }
}
