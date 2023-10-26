export type ContentLayout = {
  rows: ContentLayoutRow[];
  width: number;
  height: number;
  backgroundImage?: string;
}

export type ContentLayoutRow = {
  columns: ContentLayoutColumn[];
  height?: number;
}

export type ContentLayoutColumn = {
  cells: ContentLayoutCell[];
  width?: number;
}

export type ContentLayoutCell = {
  id: string;
  presenter?: ContentLayoutPresenter;
  height?: number;
}

export type ContentLayoutPresenter = {
  presenterType: ContentLayoutPresenterType;
  textPresenterConfig?: ContentLayoutTextPresenterConfig;
  imagePresenterConfig?: ContentLayoutImagePresenterConfig;
}

// Presentery
export enum ContentLayoutPresenterType {
  TEXT_PRESENTER = 'TEXT_PRESENTER',
  IMAGE_PRESENTER = 'IMAGE_PRESENTER'
}

export type ContentLayoutTextPresenterConfig = {
  text: string;
}

export type ContentLayoutImagePresenterConfig = {
  imgName: string;
}

// Template model
export type ContentTemplate = {
  imgName: string;
  layout: ContentLayout;
}
