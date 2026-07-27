import 'vitest-canvas-mock';
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';

import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { getTestBed } from '@angular/core/testing';

class ResizeObserverMock {
  observe() { return; }
  unobserve() { return; }
  disconnect() { return; }
}
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof globalThis.ResizeObserver;

class IntersectionObserverMock {
  readonly root: Document | Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() { return; }
  unobserve() { return; }
  disconnect() { return; }
  takeRecords(): IntersectionObserverEntry[] { return []; }
}
globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof globalThis.IntersectionObserver;

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);
