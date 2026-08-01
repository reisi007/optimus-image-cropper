import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'oic-impressum',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<div class="impressum">
  <h1 class="impressum__title">Impressum</h1>
  <p class="impressum__meta">
    Angaben gemäß § 5 ECG und Offenlegung gemäß § 25 MedienG
  </p>

  <section class="impressum__section">
    <h2 class="impressum__heading">Medieninhaber und Diensteanbieter</h2>
    <dl class="impressum__list">
      <div class="impressum__row">
        <dt>Name</dt>
        <dd>Florian Reisinger</dd>
      </div>
      <div class="impressum__row">
        <dt>Anschrift</dt>
        <dd>Robert-Stolz-Straße 8, 4020 Linz, Österreich</dd>
      </div>
      <div class="impressum__row">
        <dt>Rechtsform</dt>
        <dd>Privatperson</dd>
      </div>
      <div class="impressum__row">
        <dt>E-Mail</dt>
        <dd><a href="mailto:hello@all-the.rest">hello@all-the.rest</a></dd>
      </div>
    </dl>
  </section>

  <section class="impressum__section">
    <h2 class="impressum__heading">Datenschutz</h2>
    <p class="impressum__text">
      Informationen zur Verarbeitung personenbezogener Daten finden Sie in der
      <a href="https://all-the.rest/datenschutz" target="_blank" rel="noopener">Datenschutzerklärung</a>.
    </p>
  </section>

  <section class="impressum__section">
    <h2 class="impressum__heading">Haftung</h2>
    <p class="impressum__text">
      Trotz sorgfältiger inhaltlicher Kontrolle wird keine Haftung für die Inhalte
      externer Links übernommen. Für den Inhalt der verlinkten Seiten sind
      ausschließlich deren Betreiber verantwortlich.
    </p>
  </section>
</div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .impressum {
      max-width: 720px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      color: var(--p-text-color, #212121);
    }
    .impressum__title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
    }
    .impressum__meta {
      font-size: 0.875rem;
      margin: 0 0 2rem;
      color: var(--p-text-muted-color, #616161);
    }
    .impressum__section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .impressum__heading {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
    .impressum__text {
      margin: 0;
      line-height: 1.6;
    }
    .impressum__list {
      margin: 0;
    }
    .impressum__row {
      display: flex;
      gap: 1rem;
      padding: 0.375rem 0;
    }
    .impressum__row dt {
      flex: 0 0 140px;
      font-weight: 600;
      color: var(--p-text-muted-color, #616161);
    }
    .impressum__row dd {
      margin: 0;
    }
    a {
      color: var(--p-primary-color, #3b82f6);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `],
})
export class Impressum {}
