import { RolesEnum } from '../enum/roles.enum';

export interface ColumnsModel {
  matColumnDef: string;
  name: string;
  roles: RolesEnum[];
  dataType: DataTypeEnum;
}

export enum DataTypeEnum {
  TEXT = 'texto',
  DATE = 'date',
  CURRENCY = 'currency',
}
