import { Component, Input } from '@angular/core';
import { ImageComponentInputs } from '../../models';

@Component({
  selector: 'app-image-component',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input()
  imageComponentInputs: ImageComponentInputs;
}
