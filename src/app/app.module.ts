import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextPresenterComponent } from './presenters/text-presenter/text-presenter.component';
import { PresenterSelectorComponent } from './utils/presenter-selector/presenter-selector.component';
import { ImagePresenterComponent } from './presenters/image-presenter/image-presenter.component';

@NgModule({
  declarations: [
    AppComponent,
    TextPresenterComponent,
    PresenterSelectorComponent,
    ImagePresenterComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
