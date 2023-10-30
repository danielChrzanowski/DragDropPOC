import { Component, Input } from '@angular/core';
import { ContentLayoutPresenter, ContentLayoutPresenterType } from '../../models';

@Component({
  selector: 'app-presenter-selector',
  templateUrl: './presenter-selector.component.html'
})
export class PresenterSelectorComponent {
  @Input()
  presenter?: ContentLayoutPresenter;

  protected readonly ContentLayoutPresenterTypes = ContentLayoutPresenterType;
}
