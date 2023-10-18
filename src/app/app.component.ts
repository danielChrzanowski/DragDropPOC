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
      columns: [{
        columnRows: [{
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
        column.columnRows.forEach((columnRow: ColumnRow) => allColumnsIds.push(columnRow.id)))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  addRow(rowIndex: number): void {
    this.box.rows.splice(rowIndex, 0, {
      columns: [{
        columnRows: [{id: this.generateId(0, 0, 0), data: []}]
      }]
    });
    this.regenerateAllIds();
  }

  addColumnInRow(rowIndex: number, columnIndex: number, rowInColumnIndex: number): void {
    this.box.rows[rowIndex]?.columns.splice(columnIndex, 0, {
      columnRows: [{
        id: this.generateId(rowIndex, columnIndex, rowInColumnIndex),
        data: []
      }]
    });
    this.regenerateAllIds();
  }

  addRowInColumn(rowIndex: number, columnIndex: number, rowInColumnIndex: number): void {
    this.box.rows[rowIndex]?.columns[columnIndex].columnRows.splice(rowInColumnIndex, 0, {
      id: this.generateId(rowIndex, columnIndex, rowInColumnIndex),
      data: []
    });
    this.regenerateAllIds();
  }

  generateId(row: number, column: number, columnRow: number): string {
    return `row-${row}-column-${column}-columnRow-${columnRow}`;
  }

  printStructureToConsole(): void {
    console.log(this.box)
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

interface Box {
  width: number;
  height: number;
  rows: Row[];
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
