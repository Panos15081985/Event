import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Raummanagment from './pages/options/Raummanagment';
import Saal from './components/Saal';

jest.mock('./Database/Config', () => ({ __esModule: true, default: {} }));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(), doc: jest.fn(), getDoc: jest.fn(), updateDoc: jest.fn(),
}));

const eventDaten = { NameEvent: 'Hochzeit', EventId: 'abc' };

function renderRaum() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/Raummanagment', state: { Daten: eventDaten } }]}>
      <Routes>
        <Route path="/Raummanagment" element={<Raummanagment />} />
        <Route path="/Saal" element={<Saal />} />
      </Routes>
    </MemoryRouter>
  );
}

test('room grid uses the entered size and marks tables', () => {
  const { container } = renderRaum();
  expect(container.querySelectorAll('.raum_plan tr')).toHaveLength(5);

  fireEvent.change(screen.getByPlaceholderText('Reihen'), { target: { value: '3' } });
  fireEvent.change(screen.getByPlaceholderText('Spalten'), { target: { value: '4' } });
  const rows = container.querySelectorAll('.raum_plan tr');
  expect(rows).toHaveLength(3);
  expect(rows[0].querySelectorAll('td')).toHaveLength(4);

  // draw a table
  fireEvent.click(screen.getByText('Tische zeichnen').previousSibling);
  fireEvent.click(rows[2].querySelectorAll('td')[3]);
  expect(rows[2].querySelectorAll('td')[3]).toHaveTextContent('Tisch');
});

test('size is limited to 10', () => {
  const { container } = renderRaum();
  fireEvent.change(screen.getByPlaceholderText('Reihen'), { target: { value: '25' } });
  expect(container.querySelectorAll('.raum_plan tr')).toHaveLength(10);
});

test('continuing without a table shows a message', () => {
  window.alert = jest.fn();
  renderRaum();
  fireEvent.click(screen.getByText('Weiter mit Sitzplätze'));
  expect(window.alert).toHaveBeenCalledWith('Bitte zeichnen Sie mindestens einen Tisch');
});

test('Saal shows all rows of the room, also when tables are only in the first row', () => {
  const { container } = renderRaum();
  fireEvent.change(screen.getByPlaceholderText('Reihen'), { target: { value: '4' } });
  fireEvent.click(screen.getByText('Tische zeichnen').previousSibling);
  fireEvent.click(container.querySelectorAll('.raum_plan tr')[0].querySelectorAll('td')[3]);
  fireEvent.click(screen.getByText('Weiter mit Sitzplätze'));

  expect(container.querySelectorAll('.chairs_plan tr')).toHaveLength(4);
  fireEvent.change(screen.getByPlaceholderText('Stühle'), { target: { value: '6' } });
  expect(screen.getByText(/Stühle:6/)).toBeInTheDocument();
});
