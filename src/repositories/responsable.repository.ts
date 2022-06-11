import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Responsable, ResponsableRelations, Usuario, Area} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {AreaRepository} from './area.repository';

export class ResponsableRepository extends DefaultCrudRepository<
  Responsable,
  typeof Responsable.prototype.id,
  ResponsableRelations
> {

  public readonly usuario: BelongsToAccessor<Usuario, typeof Responsable.prototype.id>;

  public readonly area: BelongsToAccessor<Area, typeof Responsable.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>,
  ) {
    super(Responsable, dataSource);
    this.area = this.createBelongsToAccessorFor('area', areaRepositoryGetter,);
    this.registerInclusionResolver('area', this.area.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor('usuario', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}
