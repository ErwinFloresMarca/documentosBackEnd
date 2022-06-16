import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Campo, CampoRelations, TipoCartas, TipoCartaCampo} from '../models';
import {TipoCartaCampoRepository} from './tipo-carta-campo.repository';
import {TipoCartasRepository} from './tipo-cartas.repository';

export class CampoRepository extends DefaultCrudRepository<
  Campo,
  typeof Campo.prototype.id,
  CampoRelations
> {

  public readonly tipoCartas: HasManyThroughRepositoryFactory<TipoCartas, typeof TipoCartas.prototype.id,
          TipoCartaCampo,
          typeof Campo.prototype.id
        >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('TipoCartaCampoRepository') protected tipoCartaCampoRepositoryGetter: Getter<TipoCartaCampoRepository>, @repository.getter('TipoCartasRepository') protected tipoCartasRepositoryGetter: Getter<TipoCartasRepository>,
  ) {
    super(Campo, dataSource);
    this.tipoCartas = this.createHasManyThroughRepositoryFactoryFor('tipoCartas', tipoCartasRepositoryGetter, tipoCartaCampoRepositoryGetter,);
    this.registerInclusionResolver('tipoCartas', this.tipoCartas.inclusionResolver);
  }
}
