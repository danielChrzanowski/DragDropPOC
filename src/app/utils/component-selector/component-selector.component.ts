import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {
  @Input()
  componentSelector: string;

  @Input()
  inputsData?: { [keys: string]: any };
}
