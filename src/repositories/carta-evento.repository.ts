import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {CartaEvento, CartaEventoRelations, Area} from '../models';
import {AreaRepository} from './area.repository';

export class CartaEventoRepository extends DefaultCrudRepository<
  CartaEvento,
  typeof CartaEvento.prototype.id,
  CartaEventoRelations
> {

  public readonly area: BelongsToAccessor<Area, typeof CartaEvento.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>,
  ) {
    super(CartaEvento, dataSource);
    this.area = this.createBelongsToAccessorFor('area', areaRepositoryGetter,);
    this.registerInclusionResolver('area', this.area.inclusionResolver);
  }
}
