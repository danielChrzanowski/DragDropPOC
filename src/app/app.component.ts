import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Box, BoxComponent, Channel, Column, ColumnRow, ResolutionThreshold, Row, Type } from "./models";

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
  exampleComponents: BoxComponent[] = [
    {
      textComponentInputs: {
        text: 'test test tekst'
      }
    },
    {
      imageComponentInputs: {
        imgSrc: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
        imgAlt: 'Clearing with high grass'
      }
    }
  ];

  boxCoordinatesSeparator: string = '_';
  boxCoordinateConnector: string = '-';

  box: Box = {
    width: 600,
    height: 300,
    type: Type.Banner,
    channel: Channel.WWW,
    resolutionThreshold: ResolutionThreshold.Desktop,
    rows: [{
      columns: [{
        columnRows: [{
          id: this.generateId(0, 0, 0),
        }]
      }]
    }]
  }

  protected readonly Number: NumberConstructor = Number;

  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.setBoxSize(this.box.width, this.box.height);
  }

  onBoxCellItemDrop(event: CdkDragDrop<BoxComponent | undefined, any>): void {
    console.log(event);
    const targetCoordinatesInBox: CoordinatesInBox = this.decodeCoordinatesInBoxFromColumnRowId(event.container.id);
    if (event.previousContainer.id === this.componentsListId) {
      this.box.rows[targetCoordinatesInBox.row].columns[targetCoordinatesInBox.column].columnRows[targetCoordinatesInBox.columnRow].component =
        event.previousContainer.data[event.previousIndex];
    } else {
      const sourceCoordinatesInBox: CoordinatesInBox = this.decodeCoordinatesInBoxFromColumnRowId(event.previousContainer.id);
      this.box.rows[targetCoordinatesInBox.row].columns[targetCoordinatesInBox.column].columnRows[targetCoordinatesInBox.columnRow].component =
        event.previousContainer.data;
      delete this.box.rows[sourceCoordinatesInBox.row].columns[sourceCoordinatesInBox.column].columnRows[sourceCoordinatesInBox.columnRow].component;
    }
  }

  getAllListsConnections(): string[] {
    const allColumnsIds: string[] = [];
    this.box.rows.forEach((row: Row) =>
      row.columns.forEach((column: Column) =>
        column.columnRows.forEach((columnRow: ColumnRow) =>
          allColumnsIds.push(columnRow.id)))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  setBoxSize(boxWidth: number, boxHeight: number): void {
    this.box.width = boxWidth;
    this.box.height = boxHeight;
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      this.createSCSSVariablesString(this.box.width, this.box.height, this.box.backgroundImage)
    );
  }

  addRow(rowIndex: number): void {
    this.box.rows.splice(rowIndex, 0, {
      columns: [{
        columnRows: [{id: this.generateId(0, 0, 0)}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.box.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      columnRows: [{
        id: this.generateId(rowIndex, columnIndex, columnRowIndex)
      }]
    });
    this.regenerateAllIds();
  }

  addColumnRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.box.rows[rowIndex]?.columns[columnIndex].columnRows.splice(columnRowIndex, 0, {
      id: this.generateId(rowIndex, columnIndex, columnRowIndex)
    });
    this.regenerateAllIds();
  }

  setRowHeight(rowIndex: number, height: number): void {
    let rowUndefinedHeightsCount: number = 0;
    this.box.rows.forEach((row: Row) => {
      if (rowUndefinedHeightsCount >= 1 || this.box.rows[rowIndex].height) {
        this.box.rows[rowIndex].height = height;
        return;
      }
      if (!row.height) rowUndefinedHeightsCount += 1;
    });
  }

  setRowColumnWidth(rowIndex: number, columnIndex: number, width: number): void {
    let rowUndefinedColumnWidthsCount: number = 0;
    this.box.rows[rowIndex].columns.forEach((column: Column) => {
      if (rowUndefinedColumnWidthsCount >= 1 || this.box.rows[rowIndex].columns[columnIndex].width) {
        this.box.rows[rowIndex].columns[columnIndex].width = width;
        return;
      }
      if (!column.width) rowUndefinedColumnWidthsCount += 1;
    });
  }

  setColumnRowHeight(rowIndex: number, columnIndex: number, columnRowIndex: number, height: number): void {
    let columnUndefinedRowHeightCount: number = 0;
    this.box.rows[rowIndex].columns[columnIndex].columnRows.forEach((columnRow: ColumnRow) => {
      if (columnUndefinedRowHeightCount >= 1 || this.box.rows[rowIndex].columns[columnIndex].columnRows[columnRowIndex].height) {
        this.box.rows[rowIndex].columns[columnIndex].columnRows[columnRowIndex].height = height;
        return;
      }
      if (!columnRow.height) columnUndefinedRowHeightCount += 1;
    });
  }

  getRowHeightAsStyle(rowIndex: number): string {
    return this.box.rows[rowIndex].height ? `flex: 0 0 ${this.box.rows[rowIndex].height}px;` : '';
  }

  getColumnWidthAsStyle(rowIndex: number, columnIndex: number): string {
    return this.box.rows[rowIndex].columns[columnIndex].width ?
      `flex: 0 0 ${this.box.rows[rowIndex].columns[columnIndex].width}px;` : '';
  }

  getColumnRowHeightAsStyle(rowIndex: number, columnIndex: number, columnRowIndex: number): string {
    return this.box.rows[rowIndex].columns[columnIndex].columnRows[columnRowIndex].height ?
      `flex: 0 0 ${this.box.rows[rowIndex].columns[columnIndex].columnRows[columnRowIndex].height}px;` : '';
  }

  resetRowsHeights(): void {
    this.box.rows =
      this.box.rows.map((row: Row) => {
        let updatedRow: Row = row;
        updatedRow.height = undefined;
        return updatedRow;
      })
  }

  resetRowColumnsWidths(rowIndex: number): void {
    this.box.rows[rowIndex].columns = this.box.rows[rowIndex].columns.map((column: Column) => {
      let updatedColumn: Column = column;
      updatedColumn.width = undefined;
      return updatedColumn;
    })
  }

  resetColumnRowsHeights(rowIndex: number, columnIndex: number): void {
    this.box.rows[rowIndex].columns[columnIndex].columnRows =
      this.box.rows[rowIndex].columns[columnIndex].columnRows.map((columnRow: ColumnRow) => {
        let updatedColumnRow: ColumnRow = columnRow;
        updatedColumnRow.height = undefined;
        return updatedColumnRow;
      })
  }

  printBoxObjectToConsole(): void {
    console.log("BOX:", this.box);
  }

  applyBackgroundImage(backgroundImageURL: string): void {
    this.box.backgroundImage = backgroundImageURL;
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      this.createSCSSVariablesString(this.box.width, this.box.height, backgroundImageURL)
    );
  }

  generateId(row: number, column: number, columnRow: number): string {
    return `row${this.boxCoordinateConnector}${row}${this.boxCoordinatesSeparator}` +
      `column${this.boxCoordinateConnector}${column}${this.boxCoordinatesSeparator}` +
      `columnRow${this.boxCoordinateConnector}${columnRow}`;
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
    for (let i: number = 0; i < this.box.rows.length; i += 1) {
      for (let j: number = 0; j < this.box.rows[i].columns.length; j += 1) {
        for (let k: number = 0; k < this.box.rows[i].columns[j].columnRows.length; k += 1) {
          this.box.rows[i].columns[j].columnRows[k].id = this.generateId(i, j, k);
        }
      }
    }
  }
}
