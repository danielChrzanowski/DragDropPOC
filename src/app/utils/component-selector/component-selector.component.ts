import { Component, Input } from '@angular/core';
import { ContentLayoutPresenter, ContentLayoutPresenterType } from '../../models';

@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {
  @Input()
  boxComponent?: ContentLayoutPresenter;

  protected readonly ComponentTypes = ContentLayoutPresenterType;
}
