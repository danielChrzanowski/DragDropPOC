export type Box = {
  rows: Row[];
  width: number;
  height: number;
  backgroundImage?: string;
}

export type Row = {
  columns: Column[];
  height?: number;
}

export type Column = {
  columnRows: ColumnRow[];
  width?: number;
}

export type ColumnRow = {
  id: string;
  /*
   TODO:
    Te komórki (components) to są listy, tylko je ograniczyłem, że można max 1 element dodać, bo będzie w jednej komórce max 1 komponent,
    ale jeśli jest jakaś libka, która to zrobi bez list, to można zmienić nazwę i typ na samo 'component: BoxComponent',
    bo '@angular/cdk' pozwala tylko z listy na listę przerzucać. Nie da się z listy na jakiś placeholder czy coś.
  */
  components: BoxComponent[];
  height?: number;
}

export type BoxComponent = {
  componentSelector: string;
  inputsData?: { [keys: string]: any };
}
