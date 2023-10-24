import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-component',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input()
  imgSrc: string;

  @Input()
  imgAlt: string;
}
