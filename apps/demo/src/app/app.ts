import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'oic-root',
  template: `
    <h1>Optimus Image Cropper</h1>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
