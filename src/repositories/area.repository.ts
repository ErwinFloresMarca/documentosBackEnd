import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Area, AreaRelations, Responsable} from '../models';
import {ResponsableRepository} from './responsable.repository';

export class AreaRepository extends DefaultCrudRepository<
  Area,
  typeof Area.prototype.id,
  AreaRelations
> {

  public readonly responsables: HasManyRepositoryFactory<Responsable, typeof Area.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('ResponsableRepository') protected responsableRepositoryGetter: Getter<ResponsableRepository>,
  ) {
    super(Area, dataSource);
    this.responsables = this.createHasManyRepositoryFactoryFor('responsables', responsableRepositoryGetter,);
    this.registerInclusionResolver('responsables', this.responsables.inclusionResolver);
  }
}
