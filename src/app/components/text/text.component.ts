import { Component, Input } from '@angular/core';
import { TextPresenterConfig } from '../../models';

@Component({
  selector: 'app-text-component',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent {
  @Input()
  textComponentInputs?: TextPresenterConfig;
}
