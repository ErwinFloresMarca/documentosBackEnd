import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {Area, AreaWithRelations} from './area.model';
import {CartaArea} from './carta-area.model';
import {CartaEvento, CartaEventoWithRelations} from './carta-evento.model';
import {File, FileWithRelations} from './file.model';
import {TimeStamp} from './time-stamp.model';
import {TipoCartas, TipoCartasWithRelations} from './tipo-cartas.model';

@model()
export class Carta extends TimeStamp {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  numDoc?: number;

  @property({
    type: 'string',
  })
  solicitante?: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaRecepcion: string;

  @property({
    type: 'object',
    required: true,
  })
  campos: object;

  @belongsTo(() => TipoCartas, {name: 'tipoCarta'})
  tipoCartasId: number;

  @belongsTo(() => File)
  fileId: number;

  @hasMany(() => Area, {through: {model: () => CartaArea}})
  areas: Area[];

  @hasMany(() => CartaEvento)
  cartaEventos: CartaEvento[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Carta>) {
    super(data);
  }
}

export interface CartaRelations {
  // describe navigational properties here
  tipoCarta?: TipoCartasWithRelations;
  file?: FileWithRelations;
  areas?: AreaWithRelations[];
  cartaEventos?: CartaEventoWithRelations[];
}

export type CartaWithRelations = Carta & CartaRelations;
