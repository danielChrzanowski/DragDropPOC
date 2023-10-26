import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ContentLayout,
  ContentLayoutCell,
  ContentLayoutColumn,
  ContentLayoutPresenter,
  ContentLayoutPresenterType,
  ContentLayoutRow,
  ContentTemplate
} from "./models";

type CoordinatesInContentLayout = {
  row: number,
  column: number,
  cell: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  presentersListId: string = 'presenters-list';
  examplePresenters: ContentLayoutPresenter[] = [
    {
      presenterType: ContentLayoutPresenterType.TEXT_PRESENTER,
      textPresenterConfig: {
        text: 'test test tekst'
      }

    },
    {
      presenterType: ContentLayoutPresenterType.IMAGE_PRESENTER,
      imagePresenterConfig: {
        imgName: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'
      }
    }
  ];

  contentLayoutCoordinatesSeparator: string = '_';
  contentLayoutCoordinateConnector: string = '-';

  contentLayout: ContentLayout = {
    width: 600,
    height: 300,
    rows: [{
      columns: [{
        cells: [{
          id: this.generateId(0, 0, 0),
        }]
      }]
    }]
  }

  protected readonly Number: NumberConstructor = Number;

  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.setContentLayoutSize(this.contentLayout.width, this.contentLayout.height);
  }

  onContentLayoutCellItemDrop(event: CdkDragDrop<ContentLayoutPresenter | undefined, any>): void {
    const targetCoordinatesInContentLayout: CoordinatesInContentLayout = this.decodeCoordinatesInContentLayoutFromCellId(event.container.id);
    if (event.previousContainer.id === this.presentersListId) {
      this.contentLayout.rows[targetCoordinatesInContentLayout.row].columns[targetCoordinatesInContentLayout.column].cells[targetCoordinatesInContentLayout.cell].presenter =
        event.previousContainer.data[event.previousIndex];
    } else {
      const sourceCoordinatesInContentLayout: CoordinatesInContentLayout = this.decodeCoordinatesInContentLayoutFromCellId(event.previousContainer.id);
      this.contentLayout.rows[sourceCoordinatesInContentLayout.row].columns[sourceCoordinatesInContentLayout.column].cells[sourceCoordinatesInContentLayout.cell].presenter =
        this.contentLayout.rows[targetCoordinatesInContentLayout.row].columns[targetCoordinatesInContentLayout.column].cells[targetCoordinatesInContentLayout.cell].presenter;
      this.contentLayout.rows[targetCoordinatesInContentLayout.row].columns[targetCoordinatesInContentLayout.column].cells[targetCoordinatesInContentLayout.cell].presenter =
        event.previousContainer.data;
    }
  }

  getAllListsConnections(): string[] {
    const allCellsIds: string[] = [];
    this.contentLayout.rows.forEach((row: ContentLayoutRow) =>
      row.columns.forEach((column: ContentLayoutColumn) =>
        column.cells.forEach((cell: ContentLayoutCell) =>
          allCellsIds.push(cell.id)))
    );
    return [this.presentersListId, ...allCellsIds];
  }

  setContentLayoutSize(boxWidth: number, boxHeight: number): void {
    this.contentLayout.width = boxWidth;
    this.contentLayout.height = boxHeight;
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      this.createSCSSVariablesString(this.contentLayout.width, this.contentLayout.height, this.contentLayout.backgroundImage)
    );
  }

  addRow(rowIndex: number): void {
    this.contentLayout.rows.splice(rowIndex, 0, {
      columns: [{
        cells: [{id: this.generateId(0, 0, 0)}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, cellIndex: number): void {
    this.contentLayout.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      cells: [{
        id: this.generateId(rowIndex, columnIndex, cellIndex)
      }]
    });
    this.regenerateAllIds();
  }

  addCellInColumn(rowIndex: number, columnIndex: number, cellIndex: number): void {
    this.contentLayout.rows[rowIndex]?.columns[columnIndex].cells.splice(cellIndex, 0, {
      id: this.generateId(rowIndex, columnIndex, cellIndex)
    });
    this.regenerateAllIds();
  }

  setRowHeight(rowIndex: number, height: number): void {
    let rowUndefinedHeightsCount: number = 0;
    this.contentLayout.rows.forEach((row: ContentLayoutRow) => {
      if (rowUndefinedHeightsCount >= 1 || this.contentLayout.rows[rowIndex].height) {
        this.contentLayout.rows[rowIndex].height = height;
        return;
      }
      if (!row.height) rowUndefinedHeightsCount += 1;
    });
  }

  setRowColumnWidth(rowIndex: number, columnIndex: number, width: number): void {
    let rowUndefinedColumnWidthsCount: number = 0;
    this.contentLayout.rows[rowIndex].columns.forEach((column: ContentLayoutColumn) => {
      if (rowUndefinedColumnWidthsCount >= 1 || this.contentLayout.rows[rowIndex].columns[columnIndex].width) {
        this.contentLayout.rows[rowIndex].columns[columnIndex].width = width;
        return;
      }
      if (!column.width) rowUndefinedColumnWidthsCount += 1;
    });
  }

  setColumnCellHeight(rowIndex: number, columnIndex: number, cellIndex: number, height: number): void {
    let columnUndefinedRowHeightCount: number = 0;
    this.contentLayout.rows[rowIndex].columns[columnIndex].cells.forEach((cell: ContentLayoutCell) => {
      if (columnUndefinedRowHeightCount >= 1 || this.contentLayout.rows[rowIndex].columns[columnIndex].cells[cellIndex].height) {
        this.contentLayout.rows[rowIndex].columns[columnIndex].cells[cellIndex].height = height;
        return;
      }
      if (!cell.height) columnUndefinedRowHeightCount += 1;
    });
  }

  getRowHeightAsStyle(rowIndex: number): string {
    return this.contentLayout.rows[rowIndex].height ? `flex: 0 0 ${this.contentLayout.rows[rowIndex].height}px;` : '';
  }

  getColumnWidthAsStyle(rowIndex: number, columnIndex: number): string {
    return this.contentLayout.rows[rowIndex].columns[columnIndex].width ?
      `flex: 0 0 ${this.contentLayout.rows[rowIndex].columns[columnIndex].width}px;` : '';
  }

  getCellHeightAsStyle(rowIndex: number, columnIndex: number, cellIndex: number): string {
    return this.contentLayout.rows[rowIndex].columns[columnIndex].cells[cellIndex].height ?
      `flex: 0 0 ${this.contentLayout.rows[rowIndex].columns[columnIndex].cells[cellIndex].height}px;` : '';
  }

  resetRowsHeights(): void {
    this.contentLayout.rows =
      this.contentLayout.rows.map((row: ContentLayoutRow) => {
        let updatedRow: ContentLayoutRow = row;
        delete updatedRow.height;
        return updatedRow;
      })
  }

  resetRowColumnsWidths(rowIndex: number): void {
    this.contentLayout.rows[rowIndex].columns = this.contentLayout.rows[rowIndex].columns.map((column: ContentLayoutColumn) => {
      let updatedColumn: ContentLayoutColumn = column;
      delete updatedColumn.width;
      return updatedColumn;
    })
  }

  resetColumnCellsHeights(rowIndex: number, columnIndex: number): void {
    this.contentLayout.rows[rowIndex].columns[columnIndex].cells =
      this.contentLayout.rows[rowIndex].columns[columnIndex].cells.map((cell: ContentLayoutCell) => {
        let updatedCell: ContentLayoutCell = cell;
        delete updatedCell.height;
        return updatedCell;
      })
  }

  printContentLayoutObjectToConsole(): void {
    console.log("CONTENT_LAYOUT:", this.contentLayout);
  }

  printContentTemplateObjectToConsole(): void {
    const contentTemplate: ContentTemplate = {
      imgName: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
      layout: this.contentLayout
    }
    console.log("CONTENT_TEMPLATE:", contentTemplate);
  }

  applyBackgroundImage(backgroundImageURL: string): void {
    this.contentLayout.backgroundImage = backgroundImageURL;
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      this.createSCSSVariablesString(this.contentLayout.width, this.contentLayout.height, backgroundImageURL)
    );
  }

  generateId(row: number, column: number, cell: number): string {
    return `row${this.contentLayoutCoordinateConnector}${row}${this.contentLayoutCoordinatesSeparator}` +
      `column${this.contentLayoutCoordinateConnector}${column}${this.contentLayoutCoordinatesSeparator}` +
      `cell${this.contentLayoutCoordinateConnector}${cell}`;
  }

  decodeCoordinatesInContentLayoutFromCellId(cellId: string): CoordinatesInContentLayout {
    const cellSplittedCoordinates: string[] = cellId.split(this.contentLayoutCoordinatesSeparator);
    const coordinatesAsString: string[] = cellSplittedCoordinates.map((element: string) => element.split(this.contentLayoutCoordinateConnector)[1]);
    const resultCoordinates: number[] = coordinatesAsString.map((element: string) => Number(element));

    return {row: resultCoordinates[0], column: resultCoordinates[1], cell: resultCoordinates[2]};
  }

  private createSCSSVariablesString(boxWidth: number, boxHeight: number, backgroundImageURL: string | undefined): string {
    let resultString: string = `--box-width: ${boxWidth}px; --box-height: ${boxHeight}px;`;
    return backgroundImageURL ? resultString + `--background-image: url(${backgroundImageURL});` : resultString;
  }

  private regenerateAllIds(): void {
    for (let i: number = 0; i < this.contentLayout.rows.length; i += 1) {
      for (let j: number = 0; j < this.contentLayout.rows[i].columns.length; j += 1) {
        for (let k: number = 0; k < this.contentLayout.rows[i].columns[j].cells.length; k += 1) {
          this.contentLayout.rows[i].columns[j].cells[k].id = this.generateId(i, j, k);
        }
      }
    }
  }
}
