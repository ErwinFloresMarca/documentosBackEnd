import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {TipoCartas, TipoCartasRelations, Campo, TipoCartaCampo, Area, AreaTipoCarta} from '../models';
import {TipoCartaCampoRepository} from './tipo-carta-campo.repository';
import {CampoRepository} from './campo.repository';
import {AreaTipoCartaRepository} from './area-tipo-carta.repository';
import {AreaRepository} from './area.repository';

export class TipoCartasRepository extends DefaultCrudRepository<
  TipoCartas,
  typeof TipoCartas.prototype.id,
  TipoCartasRelations
> {

  public readonly campos: HasManyThroughRepositoryFactory<Campo, typeof Campo.prototype.id,
          TipoCartaCampo,
          typeof TipoCartas.prototype.id
        >;

  public readonly areas: HasManyThroughRepositoryFactory<Area, typeof Area.prototype.id,
          AreaTipoCarta,
          typeof TipoCartas.prototype.id
        >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('TipoCartaCampoRepository') protected tipoCartaCampoRepositoryGetter: Getter<TipoCartaCampoRepository>, @repository.getter('CampoRepository') protected campoRepositoryGetter: Getter<CampoRepository>, @repository.getter('AreaTipoCartaRepository') protected areaTipoCartaRepositoryGetter: Getter<AreaTipoCartaRepository>, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>,
  ) {
    super(TipoCartas, dataSource);
    this.areas = this.createHasManyThroughRepositoryFactoryFor('areas', areaRepositoryGetter, areaTipoCartaRepositoryGetter,);
    this.registerInclusionResolver('areas', this.areas.inclusionResolver);
    this.campos = this.createHasManyThroughRepositoryFactoryFor('campos', campoRepositoryGetter, tipoCartaCampoRepositoryGetter,);
    this.registerInclusionResolver('campos', this.campos.inclusionResolver);
  }
}
