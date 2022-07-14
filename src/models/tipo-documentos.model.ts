import {hasMany, model, property} from '@loopback/repository';
import {AreaTipoDocumento} from './area-tipo-documento.model';
import {Area, AreaWithRelations} from './area.model';
import {Campo, CampoWithRelations} from './campo.model';
import {TimeStamp} from './time-stamp.model';
import {TipoDocumentoCampo} from './tipo-documento-campo.model';

@model()
export class TipoDocumentos extends TimeStamp {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @hasMany(() => Campo, {through: {model: () => TipoDocumentoCampo}})
  campos: Campo[];

  @hasMany(() => Area, {through: {model: () => AreaTipoDocumento}})
  areas: Area[];

  constructor(data?: Partial<TipoDocumentos>) {
    super(data);
  }
}

export interface TipoDocumentosRelations {
  // describe navigational properties here
  campos?: CampoWithRelations[];
  areas?: AreaWithRelations[];
}

export type TipoDocumentosWithRelations = TipoDocumentos &
  TipoDocumentosRelations;
