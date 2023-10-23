import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-component',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent {
  @Input()
  text: string;

  @Input()
  fontSize?: number;
}
