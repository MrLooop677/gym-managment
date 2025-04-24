import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './i18n.ts';
import App from './App';

const helmetContext = {};

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <HelmetProvider context={helmetContext}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </HelmetProvider>
    );
    expect(document.body).toBeInTheDocument();
  });
});
