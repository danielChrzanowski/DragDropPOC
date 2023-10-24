import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop, copyArrayItem, transferArrayItem } from '@angular/cdk/drag-drop';
import { Box, BoxComponent, Channel, Column, ColumnRow, ResolutionThreshold, Row, Type } from "./models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  componentsListId: string = 'components-list';
  exampleComponents: BoxComponent[] = [
    {componentSelector: 'app-text-component', inputsData: {text: 'test test tekst', fontSize: 25}},
    {
      componentSelector: 'app-image-component',
      inputsData: {
        imgSrc: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
        imgAlt: 'Clearing with high grass'
      }
    }
  ];

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
          components: [],
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

  onBoxCellItemDrop(event: CdkDragDrop<BoxComponent[]>): void {
    if (event.container.data.length < 1) {
      if (event.previousContainer.id === this.componentsListId) {
        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
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
        columnRows: [{id: this.generateId(0, 0, 0), components: []}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.box.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      columnRows: [{
        id: this.generateId(rowIndex, columnIndex, columnRowIndex),
        components: []
      }]
    });
    this.regenerateAllIds();
  }

  addColumnRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.box.rows[rowIndex]?.columns[columnIndex].columnRows.splice(columnRowIndex, 0, {
      id: this.generateId(rowIndex, columnIndex, columnRowIndex),
      components: []
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
    return `row-${row}-column-${column}-columnRow-${columnRow}`;
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
