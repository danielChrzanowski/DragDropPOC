import { Component, Input } from '@angular/core';
import { ContentLayoutImagePresenterConfig } from '../../models';

@Component({
  selector: 'app-image-presenter-component',
  templateUrl: './image-presenter.component.html',
  styleUrls: ['./image-presenter.component.scss']
})
export class ImagePresenterComponent {
  @Input()
  imagePresenterConfig?: ContentLayoutImagePresenterConfig;
}
