import { Component } from '@angular/core';
import { CdkDragDrop, copyArrayItem, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  componentsListId: string = 'components-list';
  components: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  boxWidth: number = 600;
  boxHeight: number = 200;

  rows: Row[] = [{
    columns: [{
      columnRows: [{
        id: this.generateId(0, 0, 0),
        data: []
      }]
    }]
  }];

  protected readonly Number: NumberConstructor = Number;

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
    this.rows.forEach((row: Row) =>
      row.columns.forEach((column: Column) =>
        column.columnRows.forEach((columnRow: ColumnRow) => allColumnsIds.push(columnRow.id)))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  addRow(rowIndex: number): void {
    this.rows.splice(rowIndex, 0, {
      columns: [{
        columnRows: [{id: this.generateId(0, 0, 0), data: []}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, rowInColumnIndex: number): void {
    this.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      columnRows: [{
        id: this.generateId(rowIndex, columnIndex, rowInColumnIndex),
        data: []
      }]
    });
    this.regenerateAllIds();
  }

  addRowInColumn(rowIndex: number, columnIndex: number, rowInColumnIndex: number): void {
    this.rows[rowIndex]?.columns[columnIndex].columnRows.splice(rowInColumnIndex, 0, {
      id: this.generateId(rowIndex, columnIndex, rowInColumnIndex),
      data: []
    });
    this.regenerateAllIds();
  }

  getRowHeight(rowsCount: number): string {
    return `height: ${this.boxHeight / rowsCount}px;`;
  }

  getColumnWidth(columnsInRowCount: number): string {
    return `width: ${this.boxWidth / columnsInRowCount}px;`;
  }

  getRowInColumnHeight(rowsInColumnCount: number, columnId: string): string {
    const columnHeight: number | undefined = document.getElementById(columnId)?.offsetHeight;
    return columnHeight ? `height: ${columnHeight / rowsInColumnCount}px;` : '';
  }

  generateId(row: number, column: number, columnRow: number): string {
    return `row-${row}-column-${column}-columnRow-${columnRow}`;
  }

  private regenerateAllIds(): void {
    for (let i: number = 0; i < this.rows.length; i += 1) {
      for (let j: number = 0; j < this.rows[i].columns.length; j += 1) {
        for (let k: number = 0; k < this.rows[i].columns[j].columnRows.length; k += 1) {
          this.rows[i].columns[j].columnRows[k].id = this.generateId(i, j, k);
        }
      }
    }
    console.log(this.rows);
  }


}

interface Row {
  columns: Column[];
}

interface Column {
  columnRows: ColumnRow[];
}

interface ColumnRow {
  id: string;
  data: string[];
}
