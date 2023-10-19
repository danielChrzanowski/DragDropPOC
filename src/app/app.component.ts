import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop, copyArrayItem, transferArrayItem } from '@angular/cdk/drag-drop';
import { Box, BoxComponent, Column, ColumnRow, Row } from "./models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  componentsListId: string = 'components-list';
  exampleComponents: BoxComponent[] = [
    {componentName: 'component-1', inputsData: []},
    {componentName: 'component-2', inputsData: []},
    {componentName: 'component-3', inputsData: []},
    {componentName: 'component-4', inputsData: []}
  ];

  box: Box = {
    width: 600,
    height: 300,
    rows: [{
      height: undefined,
      columns: [{
        width: undefined,
        columnRows: [{
          height: undefined,
          id: this.generateId(0, 0, 0),
          components: []
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
        column.columnRows.forEach((columnRow: ColumnRow) => allColumnsIds.push(columnRow.id)))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  addRow(rowIndex: number): void {
    this.box.rows.splice(rowIndex, 0, {
      height: undefined,
      columns: [{
        width: undefined,
        columnRows: [{height: undefined, id: this.generateId(0, 0, 0), components: []}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.box.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      width: undefined,
      columnRows: [{
        height: undefined,
        id: this.generateId(rowIndex, columnIndex, columnRowIndex),
        components: []
      }]
    });
    this.regenerateAllIds();
  }

  addColumnRow(rowIndex: number, columnIndex: number, columnRowIndex: number): void {
    this.box.rows[rowIndex]?.columns[columnIndex].columnRows.splice(columnRowIndex, 0, {
      height: undefined,
      id: this.generateId(rowIndex, columnIndex, columnRowIndex),
      components: []
    });
    this.regenerateAllIds();
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

  getColumnWidthAsStyle(rowIndex: number, columnIndex: number): string {
    return this.box.rows[rowIndex].columns[columnIndex].width ?
      `flex: 0 0 ${this.box.rows[rowIndex].columns[columnIndex].width}px;` : '';
  }

  getRowHeightAsStyle(rowIndex: number, columnIndex: number, columnRowIndex: number): string {
    return this.box.rows[rowIndex].columns[columnIndex].columnRows[columnRowIndex].height ?
      `flex: 0 0 ${this.box.rows[rowIndex].columns[columnIndex].columnRows[columnRowIndex].height}px;` : '';
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

  setBoxSize(boxWidth: number | undefined, boxHeight: number | undefined): void {
    this.box.width = boxWidth;
    this.box.height = boxHeight;
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      `--box-width: ${boxWidth}px; --box-height: ${boxHeight}px;`
    );
  }

  generateId(row: number, column: number, columnRow: number): string {
    return `row-${row}-column-${column}-columnRow-${columnRow}`;
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
