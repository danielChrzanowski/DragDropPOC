/*
  TODO:
   Te enumy będą już w contentach w API chyba, ale chyba trzeba będzie je dać tutaj, bo libka będzie ich używała?
   Albo stworzyć nowe API dla libki?
*/
export enum Type {
  Banner,
}

export enum Channel {
  WWW
}

export enum ResolutionThreshold { // Ten się pewnie inaczej nazywa?
  Desktop,
  Tablet,
  Mobile
}

// ----------------------------------------------

export type Box = {
  rows: Row[];
  width: number;
  height: number;
  type: Type;
  channel: Channel;
  resolutionThreshold: ResolutionThreshold
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
  component: BoxComponent[];
  height?: number;
}

export type BoxComponent = {
  textComponent?: TextComponent;
  imageComponent?: ImageComponent;
}

export type TextComponent = {
  text: string;
  fontSize?: number;
}

export type ImageComponent = {
  imgSrc: string;
  imgAlt: string;
}
