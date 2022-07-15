import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {
  Area,
  Documento,
  DocumentoArea,
  DocumentoEvento,
  DocumentoRelations,
  File,
  TipoDocumentos,
} from '../models';
import {AreaRepository} from './area.repository';
import {DocumentoAreaRepository} from './documento-area.repository';
import {DocumentoEventoRepository} from './documento-evento.repository';
import {FileRepository} from './file.repository';
import {TipoDocumentosRepository} from './tipo-documentos.repository';

export class DocumentoRepository extends DefaultCrudRepository<
  Documento,
  typeof Documento.prototype.id,
  DocumentoRelations
> {
  public readonly tipoDocumento: BelongsToAccessor<
    TipoDocumentos,
    typeof Documento.prototype.id
  >;

  public readonly file: BelongsToAccessor<File, typeof Documento.prototype.id>;

  public readonly areas: HasManyThroughRepositoryFactory<
    Area,
    typeof Area.prototype.id,
    DocumentoArea,
    typeof Documento.prototype.id
  >;

  public readonly documentoEventos: HasManyRepositoryFactory<
    DocumentoEvento,
    typeof Documento.prototype.id
  >;

  public readonly ultimoEvento: BelongsToAccessor<
    DocumentoEvento,
    typeof Documento.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('TipoDocumentosRepository')
    protected tipoDocumentosRepositoryGetter: Getter<TipoDocumentosRepository>,
    @repository.getter('FileRepository')
    protected fileRepositoryGetter: Getter<FileRepository>,
    @repository.getter('DocumentoAreaRepository')
    protected documentoAreaRepositoryGetter: Getter<DocumentoAreaRepository>,
    @repository.getter('AreaRepository')
    protected areaRepositoryGetter: Getter<AreaRepository>,
    @repository.getter('DocumentoEventoRepository')
    protected documentoEventoRepositoryGetter: Getter<DocumentoEventoRepository>,
  ) {
    super(Documento, dataSource);
    this.ultimoEvento = this.createBelongsToAccessorFor(
      'ultimoEvento',
      documentoEventoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'ultimoEvento',
      this.ultimoEvento.inclusionResolver,
    );
    this.documentoEventos = this.createHasManyRepositoryFactoryFor(
      'documentoEventos',
      documentoEventoRepositoryGetter,
    );
    this.registerInclusionResolver(
      'documentoEventos',
      this.documentoEventos.inclusionResolver,
    );
    this.areas = this.createHasManyThroughRepositoryFactoryFor(
      'areas',
      areaRepositoryGetter,
      documentoAreaRepositoryGetter,
    );
    this.registerInclusionResolver('areas', this.areas.inclusionResolver);
    this.file = this.createBelongsToAccessorFor('file', fileRepositoryGetter);
    this.registerInclusionResolver('file', this.file.inclusionResolver);
    this.tipoDocumento = this.createBelongsToAccessorFor(
      'tipoDocumento',
      tipoDocumentosRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tipoDocumento',
      this.tipoDocumento.inclusionResolver,
    );
  }
}
