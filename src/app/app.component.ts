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

  rows: Row[] = [{
    columns: [{
      id: this.generateId(0, 0),
      columnRows: [{
        id: this.generateId(0, 0, "0"),
        data: []
      }]
    }]
  }];

  boxWidth: number = 600;
  boxHeight: number = 200;

  onListDropped(event: CdkDragDrop<string[]>): void {
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
      row.columns.forEach((column: Column) => allColumnsIds.push(column.id))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  addRow(rowIndexString: string): void {
    const rowIndex: number = Number(rowIndexString);

    this.rows.splice(rowIndex, 0, {
      columns: [{
        id: this.generateId(rowIndex, 0),
        columnRows: [{id: this.generateId(0, 0, '0'), data: []}]
      }]
    });

    this.regenerateAllIds();
  }

  addColumnInRow(rowIndexString: string, columnIndexString: string, rowInColumnString: string): void {
    const rowIndex: number = Number(rowIndexString);
    const columnIndex: number = Number(columnIndexString);
    const rowInColumnIndex: number = Number(rowInColumnString);

    this.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      id: this.generateId(rowIndex, columnIndex),
      columnRows: [{
        id: this.generateId(rowIndex, columnIndex, rowInColumnIndex.toString()),
        data: []
      }]
    });

    this.regenerateAllIds();
  }

  addRowInColumn(rowIndexString: string, columnIndexString: string, rowInColumnString: string): void {
    const rowIndex: number = Number(rowIndexString);
    const columnIndex: number = Number(columnIndexString);
    const rowInColumnIndex: number = Number(rowInColumnString);

    this.rows[rowIndex]?.columns[columnIndex].columnRows.splice(rowInColumnIndex, 0, {
      id: this.generateId(rowIndex, columnIndex, rowInColumnIndex.toString()),
      data: []
    });

    this.regenerateAllIds();
  }

  getRowHeight(rowsCount: number): string {
    return `height: ${this.boxHeight / rowsCount}px`;
  }

  getRowInColumnHeight(rowsCount: number): string {
    return `height: ${this.boxHeight / rowsCount}px`;
  }

  getColumnWidth(columnsCount: number): string {
    return `width: ${this.boxWidth / columnsCount}px`;
  }

  generateId(row: number, column: number, columnRow?: string): string {
    let id = `row-${row}-column-${column}`;
    return columnRow ? `${id}-columnRow-${columnRow}` : id;
  }

  private regenerateAllIds(): void {
    for (let i: number = 0; i < this.rows.length; i += 1) {
      for (let j: number = 0; j < this.rows[i].columns.length; j += 1) {
        for (let k: number = 0; k < this.rows[i].columns[j].columnRows.length; k += 1) {
          this.rows[i].columns[j].id = this.generateId(i, j);
          this.rows[i].columns[j].columnRows[k].id = this.generateId(i, j, k.toString());
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
  id: string;
  columnRows: ColumnRow[];
}

interface ColumnRow {
  id: string;
  data: string[];
}
