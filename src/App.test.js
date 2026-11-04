import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./Database/Config', () => ({ __esModule: true, default: {} }));

test('renders the start page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Event' })).toBeInTheDocument();
  expect(screen.getByText('Erstelle dein Event')).toBeInTheDocument();
});
