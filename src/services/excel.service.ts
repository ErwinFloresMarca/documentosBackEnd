import {AreaWithRelations} from './../models/area.model';
import {DocumentoWithRelations} from './../models/documento.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import Excel from 'exceljs';
import {DateTime} from 'luxon';
import {Area, Campo, Documento} from '../models';

export interface IColumn {
  header: string;
  key: string;
  width?: number;
}

@injectable({scope: BindingScope.TRANSIENT})
export class ExcelService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  async generateExcel(columns: IColumn[], data: Array<any>, fileName?: string) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');
    worksheet.columns = columns;

    data.forEach(row => {
      worksheet.addRow(row);
    });

    // save under export.xlsx
    const fileResp = await workbook.xlsx.writeFile(
      fileName
        ? fileName
        : `report-${DateTime.now().toFormat('yyy-LL-dd')}.xlsx`,
    );
    console.log('File is written', fileResp);
    return fileResp;
  }

  generateDocColumns(campos: Campo[]): Array<IColumn> {
    const cols: Array<IColumn> = [];
    cols.push({
      header: 'No. Doc',
      key: 'numDoc',
    });
    cols.push({
      header: 'FECHA RECEPCIÓN',
      key: 'fechaRecepcion',
    });
    campos.forEach(col => {
      cols.push({
        header: col.nombre,
        key: col.key,
      });
    });

    cols.push({
      header: 'TÉCNICO DESIGNADO',
      key: 'tecnicoDesignado',
    });

    cols.push({
      header: 'FECHA DESIGNACION',
      key: 'fechaDesignacion',
    });

    return cols;
  }

  generateDocRows(
    docs: Array<Documento & DocumentoWithRelations>,
    area: Area & AreaWithRelations,
  ): Array<any> {
    const data: Array<any> = [];
    docs.forEach((doc: Documento) => {
      data.push({
        numDoc: doc.numDoc,
        fechaRecepcion: doc.fechaRecepcion,
        ...doc.campos,
        tecnicoDesignado: `${area.responsables[0].usuario?.nombres} ${area.responsables[0].usuario?.paterno} ${area.responsables[0].usuario?.materno}`,
        fechaDesignacion: doc.documentoEventos[0].createdAt
          ? DateTime.fromISO(doc.documentoEventos[0].createdAt).toFormat(
              'yyyy/LL/dd',
            )
          : undefined,
      });
    });
    return data;
  }
}
