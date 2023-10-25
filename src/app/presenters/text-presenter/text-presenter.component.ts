import { Component, Input } from '@angular/core';
import { ContentLayoutTextPresenterConfig } from '../../models';

@Component({
  selector: 'app-text-presenter-component',
  templateUrl: './text-presenter.component.html',
  styleUrls: ['./text-presenter.component.scss']
})
export class TextPresenterComponent {
  @Input()
  textPresenterConfig?: ContentLayoutTextPresenterConfig;
}
