import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'oic-root',
  template: `
    <header class="app-header">
      <h1>Optimus Image Cropper</h1>
    </header>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      padding: 1.5rem 2rem 0.5rem;
    }
    .app-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--p-text-color, #212121);
    }
    .app-main {
      padding: 0 0 2rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
