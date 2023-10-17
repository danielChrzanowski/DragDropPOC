import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  rows: Row[] = [{index: 0, columns: [{id: 'column-0', data: []}]}];
  componentsListId: string = 'components-list';
  components: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep', 'Go home2', 'Fall asleep2'];
  rowWidth: number = 600;
  columnsIdsPrefix = 'column-';

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  getConnections(): string[] {
    const allColumnsIds: string[] = [];
    this.rows.forEach(row =>
      row.columns.forEach(column => allColumnsIds.push(column.id))
    );
    return [this.componentsListId, ...allColumnsIds];
  }

  addRow(rowIndex: string): void {
    this.rows.push({index: Number(rowIndex), columns: [{id: this.columnsIdsPrefix + '0', data: []}]});
  }

  addColumn(rowIndexString: string, columnIndexString: string): void {
    const rowIndex: number = Number(rowIndexString);
    const columnIndex: number = Number(columnIndexString);

    if (this.rows[rowIndex]) {
      this.rows[rowIndex].columns.splice(columnIndex, 0, {
        id: this.columnsIdsPrefix + this.rows[rowIndex].columns.length,
        data: []
      });
    }
  }

  columnWidth(columnsCount: number): string {
    return `width: ${this.rowWidth / columnsCount}px`;
  }
}

interface Row {
  index: number;
  columns: Column[];
}

interface Column {
  id: string;
  data: string[];
}
