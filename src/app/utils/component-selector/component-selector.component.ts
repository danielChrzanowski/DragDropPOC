import { Component, Input } from '@angular/core';
import { BoxComponent, ComponentType } from '../../models';

@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {
  @Input()
  boxComponent?: BoxComponent;

  protected readonly ComponentTypes = ComponentType;
}
