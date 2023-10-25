import { Component, Input } from '@angular/core';
import { Presenter, PresenterType } from '../../models';

@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {
  @Input()
  boxComponent?: Presenter;

  protected readonly ComponentTypes = PresenterType;
}
