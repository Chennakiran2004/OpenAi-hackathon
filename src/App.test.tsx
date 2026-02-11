import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Antigravity', () => () => <div data-testid="antigravity" />);
jest.mock('./components/IndiaMapBackground', () => () => <div data-testid="india-map-bg" />);

test('renders landing heading', () => {
  // Polyfill for components using ResizeObserver (three/antigravity)
  // @ts-ignore
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // @ts-ignore
  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  render(<App />);
  expect(screen.getByRole('heading', { name: /National Inter-State Agricultural Intelligence/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Request Demo/i }).length).toBeGreaterThan(0);
});
