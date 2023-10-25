export type Box = {
  rows: Row[];
  width: number;
  height: number;
  type: Type;
  channel: Channel;
  resolutionMode: ResolutionMode;
  backgroundImage?: string;
}

export type Row = {
  columns: Column[];
  height?: number;
}

export type Column = {
  cells: Cell[];
  width?: number;
}

export type Cell = {
  id: string;
  presenter?: Presenter;
  height?: number;
}

export type Presenter = {
  presenterType: PresenterType;
  textPresenterConfig?: TextPresenterConfig;
  imagePresenterConfig?: ImagePresenterConfig;
}

// Configi Presenterów
export type TextPresenterConfig = {
  text: string;
}

export type ImagePresenterConfig = {
  imgSrc: string;
  imgAlt: string;
}

// ------------------

export enum Type {
  Banner,
}

export enum Channel {
  WWW
}

export enum ResolutionMode {
  Desktop,
  Tablet,
  Mobile
}

export enum PresenterType {
  TextPresenter,
  ImagePresenter
}
