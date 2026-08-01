import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'oic-root',
  template: `
    <header class="app-header">
      <img src="optimus-cropper.svg" alt="" class="app-header__icon" />
      <h1>Optimus Image Cropper</h1>
    </header>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
    <footer class="app-footer">
      <a routerLink="/impressum">Impressum</a>
      <a href="https://all-the.rest/datenschutz" target="_blank" rel="noopener">Datenschutz</a>
    </footer>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 2rem 0.5rem;
    }
    .app-header__icon {
      width: 32px;
      height: 32px;
    }
    .app-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--p-text-color, #212121);
    }
    .app-main {
      padding: 0 0 2rem;
      min-height: calc(100vh - 150px);
    }
    .app-footer {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      padding: 1.5rem;
      font-size: 0.875rem;
      color: var(--p-text-muted-color, #616161);
      border-top: 1px solid var(--p-content-border-color, #e0e0e0);
    }
    .app-footer a {
      color: var(--p-text-muted-color, #616161);
      text-decoration: none;
    }
    .app-footer a:hover {
      color: var(--p-text-color, #212121);
      text-decoration: underline;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
