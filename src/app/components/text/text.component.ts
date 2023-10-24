import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-component',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent {
  @Input()
  textComponentInputs: TextComponent;
}
