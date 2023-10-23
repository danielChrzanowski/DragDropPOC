import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextComponent } from './components/text/text.component';
import { ComponentSelectorComponent } from './utils/component-selector/component-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    TextComponent,
    ComponentSelectorComponent
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
