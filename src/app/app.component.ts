import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ContentLayout,
  ContentLayoutCell,
  ContentLayoutColumn,
  ContentLayoutPresenter,
  ContentLayoutPresenterType,
  ContentLayoutRow
} from "./models";

type CoordinatesInBox = {
  row: number,
  column: number,
  columnRow: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  componentsListId: string = 'components-list';
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

  boxCoordinatesSeparator: string = '_';
  boxCoordinateConnector: string = '-';

  layout: ContentLayout = {
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
    this.setBoxSize(this.layout.width, this.layout.height);
  }

  onBoxCellItemDrop(event: CdkDragDrop<ContentLayoutPresenter | undefined, any>): void {
    const targetCoordinatesInBox: CoordinatesInBox = this.decodeCoordinatesInBoxFromColumnRowId(event.container.id);
    if (event.previousContainer.id === this.componentsListId) {
      this.layout.rows[targetCoordinatesInBox.row].columns[targetCoordinatesInBox.column].cells[targetCoordinatesInBox.columnRow].presenter =
        event.previousContainer.data[event.previousIndex];
    } else {
      const sourceCoordinatesInBox: CoordinatesInBox = this.decodeCoordinatesInBoxFromColumnRowId(event.previousContainer.id);
      this.layout.rows[sourceCoordinatesInBox.row].columns[sourceCoordinatesInBox.column].cells[sourceCoordinatesInBox.columnRow].presenter =
        this.layout.rows[targetCoordinatesInBox.row].columns[targetCoordinatesInBox.column].cells[targetCoordinatesInBox.columnRow].presenter;
      this.layout.rows[targetCoordinatesInBox.row].columns[targetCoordinatesInBox.column].cells[targetCoordinatesInBox.columnRow].presenter =
        event.previousContainer.data;
    }
  }

  getAllListsConnections(): string[] {
    const allColumnsIds: string[] = [];
    this.layout.rows.forEach((row: ContentLayoutRow) =>
      row.columns.forEach((column: ContentLayoutColumn) =>
        column.cells.forEach((columnRow: ContentLayoutCell) =>
          allColumnsIds.push(columnRow.id)))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  setBoxSize(boxWidth: number, boxHeight: number): void {
    this.layout.width = boxWidth;
    this.layout.height = boxHeight;
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      this.createSCSSVariablesString(this.layout.width, this.layout.height, this.layout.backgroundImage)
    );
  }

  addRow(rowIndex: number): void {
    this.layout.rows.splice(rowIndex, 0, {
      columns: [{
        cells: [{id: this.generateId(0, 0, 0)}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.layout.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      cells: [{
        id: this.generateId(rowIndex, columnIndex, columnRowIndex)
      }]
    });
    this.regenerateAllIds();
  }

  addColumnRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.layout.rows[rowIndex]?.columns[columnIndex].cells.splice(columnRowIndex, 0, {
      id: this.generateId(rowIndex, columnIndex, columnRowIndex)
    });
    this.regenerateAllIds();
  }

  setRowHeight(rowIndex: number, height: number): void {
    let rowUndefinedHeightsCount: number = 0;
    this.layout.rows.forEach((row: ContentLayoutRow) => {
      if (rowUndefinedHeightsCount >= 1 || this.layout.rows[rowIndex].height) {
        this.layout.rows[rowIndex].height = height;
        return;
      }
      if (!row.height) rowUndefinedHeightsCount += 1;
    });
  }

  setRowColumnWidth(rowIndex: number, columnIndex: number, width: number): void {
    let rowUndefinedColumnWidthsCount: number = 0;
    this.layout.rows[rowIndex].columns.forEach((column: ContentLayoutColumn) => {
      if (rowUndefinedColumnWidthsCount >= 1 || this.layout.rows[rowIndex].columns[columnIndex].width) {
        this.layout.rows[rowIndex].columns[columnIndex].width = width;
        return;
      }
      if (!column.width) rowUndefinedColumnWidthsCount += 1;
    });
  }

  setColumnRowHeight(rowIndex: number, columnIndex: number, columnRowIndex: number, height: number): void {
    let columnUndefinedRowHeightCount: number = 0;
    this.layout.rows[rowIndex].columns[columnIndex].cells.forEach((columnRow: ContentLayoutCell) => {
      if (columnUndefinedRowHeightCount >= 1 || this.layout.rows[rowIndex].columns[columnIndex].cells[columnRowIndex].height) {
        this.layout.rows[rowIndex].columns[columnIndex].cells[columnRowIndex].height = height;
        return;
      }
      if (!columnRow.height) columnUndefinedRowHeightCount += 1;
    });
  }

  getRowHeightAsStyle(rowIndex: number): string {
    return this.layout.rows[rowIndex].height ? `flex: 0 0 ${this.layout.rows[rowIndex].height}px;` : '';
  }

  getColumnWidthAsStyle(rowIndex: number, columnIndex: number): string {
    return this.layout.rows[rowIndex].columns[columnIndex].width ?
      `flex: 0 0 ${this.layout.rows[rowIndex].columns[columnIndex].width}px;` : '';
  }

  getColumnRowHeightAsStyle(rowIndex: number, columnIndex: number, columnRowIndex: number): string {
    return this.layout.rows[rowIndex].columns[columnIndex].cells[columnRowIndex].height ?
      `flex: 0 0 ${this.layout.rows[rowIndex].columns[columnIndex].cells[columnRowIndex].height}px;` : '';
  }

  resetRowsHeights(): void {
    this.layout.rows =
      this.layout.rows.map((row: ContentLayoutRow) => {
        let updatedRow: ContentLayoutRow = row;
        updatedRow.height = undefined;
        return updatedRow;
      })
  }

  resetRowColumnsWidths(rowIndex: number): void {
    this.layout.rows[rowIndex].columns = this.layout.rows[rowIndex].columns.map((column: ContentLayoutColumn) => {
      let updatedColumn: ContentLayoutColumn = column;
      updatedColumn.width = undefined;
      return updatedColumn;
    })
  }

  resetColumnRowsHeights(rowIndex: number, columnIndex: number): void {
    this.layout.rows[rowIndex].columns[columnIndex].cells =
      this.layout.rows[rowIndex].columns[columnIndex].cells.map((columnRow: ContentLayoutCell) => {
        let updatedColumnRow: ContentLayoutCell = columnRow;
        updatedColumnRow.height = undefined;
        return updatedColumnRow;
      })
  }

  printBoxObjectToConsole(): void {
    console.log("BOX:", this.layout);
  }

  applyBackgroundImage(backgroundImageURL: string): void {
    this.layout.backgroundImage = backgroundImageURL;
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      this.createSCSSVariablesString(this.layout.width, this.layout.height, backgroundImageURL)
    );
  }

  generateId(row: number, column: number, columnRow: number): string {
    return `row${this.boxCoordinateConnector}${row}${this.boxCoordinatesSeparator}` +
      `column${this.boxCoordinateConnector}${column}${this.boxCoordinatesSeparator}` +
      `cell${this.boxCoordinateConnector}${columnRow}`;
  }

  decodeCoordinatesInBoxFromColumnRowId(columnRowId: string): { row: number, column: number, columnRow: number } {
    const boxElements: string[] = columnRowId.split(this.boxCoordinatesSeparator);
    const coordinatesAsString: string[] = boxElements.map((element: string) => element.split(this.boxCoordinateConnector)[1]);
    const result: number[] = coordinatesAsString.map((element: string) => Number(element));

    return {row: result[0], column: result[1], columnRow: result[2]};
  }

  private createSCSSVariablesString(boxWidth: number, boxHeight: number, backgroundImageURL: string | undefined): string {
    let resultString: string = `--box-width: ${boxWidth}px; --box-height: ${boxHeight}px;`;
    return backgroundImageURL ? resultString + `--background-image: url(${backgroundImageURL});` : resultString;
  }

  private regenerateAllIds(): void {
    for (let i: number = 0; i < this.layout.rows.length; i += 1) {
      for (let j: number = 0; j < this.layout.rows[i].columns.length; j += 1) {
        for (let k: number = 0; k < this.layout.rows[i].columns[j].cells.length; k += 1) {
          this.layout.rows[i].columns[j].cells[k].id = this.generateId(i, j, k);
        }
      }
    }
  }
}
