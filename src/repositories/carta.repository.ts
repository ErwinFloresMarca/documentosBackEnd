import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Carta, CartaRelations, TipoCartas, File, Area, CartaArea, CartaEvento} from '../models';
import {TipoCartasRepository} from './tipo-cartas.repository';
import {FileRepository} from './file.repository';
import {CartaAreaRepository} from './carta-area.repository';
import {AreaRepository} from './area.repository';
import {CartaEventoRepository} from './carta-evento.repository';

export class CartaRepository extends DefaultCrudRepository<
  Carta,
  typeof Carta.prototype.id,
  CartaRelations
> {

  public readonly tipoCarta: BelongsToAccessor<TipoCartas, typeof Carta.prototype.id>;

  public readonly file: BelongsToAccessor<File, typeof Carta.prototype.id>;

  public readonly areas: HasManyThroughRepositoryFactory<Area, typeof Area.prototype.id,
          CartaArea,
          typeof Carta.prototype.id
        >;

  public readonly cartaEventos: HasManyRepositoryFactory<CartaEvento, typeof Carta.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('TipoCartasRepository') protected tipoCartasRepositoryGetter: Getter<TipoCartasRepository>, @repository.getter('FileRepository') protected fileRepositoryGetter: Getter<FileRepository>, @repository.getter('CartaAreaRepository') protected cartaAreaRepositoryGetter: Getter<CartaAreaRepository>, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>, @repository.getter('CartaEventoRepository') protected cartaEventoRepositoryGetter: Getter<CartaEventoRepository>,
  ) {
    super(Carta, dataSource);
    this.cartaEventos = this.createHasManyRepositoryFactoryFor('cartaEventos', cartaEventoRepositoryGetter,);
    this.registerInclusionResolver('cartaEventos', this.cartaEventos.inclusionResolver);
    this.areas = this.createHasManyThroughRepositoryFactoryFor('areas', areaRepositoryGetter, cartaAreaRepositoryGetter,);
    this.registerInclusionResolver('areas', this.areas.inclusionResolver);
    this.file = this.createBelongsToAccessorFor('file', fileRepositoryGetter,);
    this.registerInclusionResolver('file', this.file.inclusionResolver);
    this.tipoCarta = this.createBelongsToAccessorFor('tipoCarta', tipoCartasRepositoryGetter,);
    this.registerInclusionResolver('tipoCarta', this.tipoCarta.inclusionResolver);
  }
}
