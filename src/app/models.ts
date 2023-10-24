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

export enum ComponentTypes {
  TextComponent,
  ImageComponent
}

// ----------------------------------------------

export type Box = {
  rows: Row[];
  width: number;
  height: number;
  type: Type;
  channel: Channel;
  resolutionThreshold: ResolutionThreshold;
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
  component?: BoxComponent;
  height?: number;
}

export type BoxComponent = {
  componentName: ComponentTypes;
  textComponentInputs?: TextComponentInputs;
  imageComponentInputs?: ImageComponentInputs;
}

// Inputy BoxComponentu
export type TextComponentInputs = {
  text: string;
}

export type ImageComponentInputs = {
  imgSrc: string;
  imgAlt: string;
}
// ------------------
