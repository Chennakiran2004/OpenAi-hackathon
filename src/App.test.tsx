import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /AI-Powered Job Matching That Actually Works/i })).toBeInTheDocument();
});
