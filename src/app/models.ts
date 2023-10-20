export type Box = {
  width: number;
  height: number;
  backgroundImage: string | undefined;
  rows: Row[];
}

export type Row = {
  height: number | undefined;
  columns: Column[];
}

export type Column = {
  width: number | undefined;
  columnRows: ColumnRow[];
}

export type ColumnRow = {
  height: number | undefined;
  id: string;
  /*
   TODO:
    Te komórki (components) to są listy, tylko je ograniczyłem, że można max 1 element dodać, bo będzie w jednej komórce max 1 komponent,
    ale jeśli jest jakaś libka, która to zrobi bez list, to można zmienić nazwę i typ na samo 'component: BoxComponent',
    bo '@angular/cdk' pozwala tylko z listy na listę przerzucać. Nie da się z listy na jakiś placeholder czy coś.
  */
  components: BoxComponent[];
}

export type BoxComponent = {
  componentSelector: string;
  inputsData: { [keys: string]: any };
}
