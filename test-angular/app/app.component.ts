import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  template: `
    <div class="app">
      <h1>{{ title }}</h1>
      Hello World!
    </div>
  `
})
export class AppComponent {
  title: string = 'Tour of Heroes';
}
