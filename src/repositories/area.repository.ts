import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {
  Area,
  AreaRelations,
  AreaTipoDocumento,
  Documento,
  DocumentoArea,
  Responsable,
  TipoDocumentos,
} from '../models';
import {AreaTipoDocumentoRepository} from './area-tipo-documento.repository';
import {DocumentoAreaRepository} from './documento-area.repository';
import {DocumentoRepository} from './documento.repository';
import {ResponsableRepository} from './responsable.repository';
import {TipoDocumentosRepository} from './tipo-documentos.repository';

export class AreaRepository extends DefaultCrudRepository<
  Area,
  typeof Area.prototype.id,
  AreaRelations
> {
  public readonly responsables: HasManyRepositoryFactory<
    Responsable,
    typeof Area.prototype.id
  >;

  public readonly tipoDocumentos: HasManyThroughRepositoryFactory<
    TipoDocumentos,
    typeof TipoDocumentos.prototype.id,
    AreaTipoDocumento,
    typeof Area.prototype.id
  >;

  public readonly documentos: HasManyThroughRepositoryFactory<
    Documento,
    typeof Documento.prototype.id,
    DocumentoArea,
    typeof Area.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('ResponsableRepository')
    protected responsableRepositoryGetter: Getter<ResponsableRepository>,
    @repository.getter('AreaTipoDocumentoRepository')
    protected areaTipoDocumentoRepositoryGetter: Getter<AreaTipoDocumentoRepository>,
    @repository.getter('TipoDocumentosRepository')
    protected tipoDocumentosRepositoryGetter: Getter<TipoDocumentosRepository>,
    @repository.getter('DocumentoAreaRepository')
    protected documentoAreaRepositoryGetter: Getter<DocumentoAreaRepository>,
    @repository.getter('DocumentoRepository')
    protected documentoRepositoryGetter: Getter<DocumentoRepository>,
  ) {
    super(Area, dataSource);
    this.documentos = this.createHasManyThroughRepositoryFactoryFor(
      'documentos',
      documentoRepositoryGetter,
      documentoAreaRepositoryGetter,
    );
    this.registerInclusionResolver(
      'documentos',
      this.documentos.inclusionResolver,
    );
    this.tipoDocumentos = this.createHasManyThroughRepositoryFactoryFor(
      'tipoDocumentos',
      tipoDocumentosRepositoryGetter,
      areaTipoDocumentoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tipoDocumentos',
      this.tipoDocumentos.inclusionResolver,
    );
    this.responsables = this.createHasManyRepositoryFactoryFor(
      'responsables',
      responsableRepositoryGetter,
    );
    this.registerInclusionResolver(
      'responsables',
      this.responsables.inclusionResolver,
    );
  }
}
