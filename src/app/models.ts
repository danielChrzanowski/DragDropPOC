export interface Box {
  width: number | undefined;
  height: number | undefined;
  rows: Row[];
}

export interface Row {
  height: number | undefined;
  columns: Column[];
}

export interface Column {
  width: number | undefined;
  columnRows: ColumnRow[];
}

export interface ColumnRow {
  height: number | undefined;
  id: string;
  data: string[];
}
