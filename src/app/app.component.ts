import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop, copyArrayItem, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  componentsListId: string = 'components-list';
  components: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  box: Box = {
    width: 600,
    height: 300,
    rows: [{
      height: undefined,
      columns: [{
        width: undefined,
        rowsInColumn: [{
          height: undefined,
          id: this.generateId(0, 0, 0),
          data: []
        }]
      }]
    }]
  }

  protected readonly Number: NumberConstructor = Number;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer2.setProperty(this.elementRef.nativeElement,
      'style',
      `--box-width: ${this.box.width}px; --box-height: ${this.box.height}px;`
    );
  }

  onBoxCellItemDrop(event: CdkDragDrop<string[]>): void {
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
        column.rowsInColumn.forEach((columnRow: ColumnRow) => allColumnsIds.push(columnRow.id)))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  addRow(rowIndex: number): void {
    this.box.rows.splice(rowIndex, 0, {
      height: undefined,
      columns: [{
        width: undefined,
        rowsInColumn: [{height: undefined, id: this.generateId(0, 0, 0), data: []}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, rowInColumnIndex: number): void {
    this.box.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      width: undefined,
      rowsInColumn: [{
        height: undefined,
        id: this.generateId(rowIndex, columnIndex, rowInColumnIndex),
        data: []
      }]
    });
    this.regenerateAllIds();
  }

  addRowInColumn(rowIndex: number, columnIndex: number, rowInColumnIndex: number): void {
    this.box.rows[rowIndex]?.columns[columnIndex].rowsInColumn.splice(rowInColumnIndex, 0, {
      height: undefined,
      id: this.generateId(rowIndex, columnIndex, rowInColumnIndex),
      data: []
    });
    this.regenerateAllIds();
  }

  setColumnWidth(rowIndex: number, columnIndex: number, width: number): void {
    let rowUndefinedColumnWidthsCount: number = 0;
    this.box.rows[rowIndex].columns.forEach((column: Column) => {
      if (rowUndefinedColumnWidthsCount >= 1 || this.box.rows[rowIndex].columns[columnIndex].width) {
        this.box.rows[rowIndex].columns[columnIndex].width = width;
        return;
      }
      if (!column.width) rowUndefinedColumnWidthsCount += 1;
    });
  }

  resetColumnWidths(rowIndex: number): void {
    this.box.rows[rowIndex].columns = this.box.rows[rowIndex].columns.map((column: Column) => {
      let updatedColumn: Column = column;
      updatedColumn.width = undefined;
      return updatedColumn;
    })
  }

  getColumnWidthAsStyle(rowIndex: number, columnIndex: number): string {
    return this.box.rows[rowIndex].columns[columnIndex].width ? `flex: 0 0 ${this.box.rows[rowIndex].columns[columnIndex].width}px;` : '';
  }

  printObjectToConsole(): void {
    console.log("BOX:", this.box);
  }

  generateId(row: number, column: number, columnRow: number): string {
    return `row-${row}-column-${column}-columnRow-${columnRow}`;
  }

  private regenerateAllIds(): void {
    for (let i: number = 0; i < this.box.rows.length; i += 1) {
      for (let j: number = 0; j < this.box.rows[i].columns.length; j += 1) {
        for (let k: number = 0; k < this.box.rows[i].columns[j].rowsInColumn.length; k += 1) {
          this.box.rows[i].columns[j].rowsInColumn[k].id = this.generateId(i, j, k);
        }
      }
    }
  }
}

interface Box {
  width: number | undefined;
  height: number | undefined;
  rows: Row[];
}

interface Row {
  height: number | undefined;
  columns: Column[];
}

interface Column {
  width: number | undefined;
  rowsInColumn: ColumnRow[];
}

interface ColumnRow {
  height: number | undefined;
  id: string;
  data: string[];
}
