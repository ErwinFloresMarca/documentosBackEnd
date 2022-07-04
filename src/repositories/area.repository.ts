import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Area, AreaRelations, Responsable, TipoCartas, AreaTipoCarta, Carta, CartaArea} from '../models';
import {ResponsableRepository} from './responsable.repository';
import {AreaTipoCartaRepository} from './area-tipo-carta.repository';
import {TipoCartasRepository} from './tipo-cartas.repository';
import {CartaAreaRepository} from './carta-area.repository';
import {CartaRepository} from './carta.repository';

export class AreaRepository extends DefaultCrudRepository<
  Area,
  typeof Area.prototype.id,
  AreaRelations
> {

  public readonly responsables: HasManyRepositoryFactory<Responsable, typeof Area.prototype.id>;

  public readonly tipoCartas: HasManyThroughRepositoryFactory<TipoCartas, typeof TipoCartas.prototype.id,
          AreaTipoCarta,
          typeof Area.prototype.id
        >;

  public readonly cartas: HasManyThroughRepositoryFactory<Carta, typeof Carta.prototype.id,
          CartaArea,
          typeof Area.prototype.id
        >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('ResponsableRepository') protected responsableRepositoryGetter: Getter<ResponsableRepository>, @repository.getter('AreaTipoCartaRepository') protected areaTipoCartaRepositoryGetter: Getter<AreaTipoCartaRepository>, @repository.getter('TipoCartasRepository') protected tipoCartasRepositoryGetter: Getter<TipoCartasRepository>, @repository.getter('CartaAreaRepository') protected cartaAreaRepositoryGetter: Getter<CartaAreaRepository>, @repository.getter('CartaRepository') protected cartaRepositoryGetter: Getter<CartaRepository>,
  ) {
    super(Area, dataSource);
    this.cartas = this.createHasManyThroughRepositoryFactoryFor('cartas', cartaRepositoryGetter, cartaAreaRepositoryGetter,);
    this.registerInclusionResolver('cartas', this.cartas.inclusionResolver);
    this.tipoCartas = this.createHasManyThroughRepositoryFactoryFor('tipoCartas', tipoCartasRepositoryGetter, areaTipoCartaRepositoryGetter,);
    this.registerInclusionResolver('tipoCartas', this.tipoCartas.inclusionResolver);
    this.responsables = this.createHasManyRepositoryFactoryFor('responsables', responsableRepositoryGetter,);
    this.registerInclusionResolver('responsables', this.responsables.inclusionResolver);
  }
}
