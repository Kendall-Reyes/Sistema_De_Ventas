import { renderWithProviders } from '@/test/render';

import { DashboardScreen } from './DashboardScreen';

describe('DashboardScreen', () => {
  it('renders the application name', async () => {
    const { getByText } = await renderWithProviders(<DashboardScreen />);

    expect(getByText('Sistema de Ventas')).toBeTruthy();
  });

  it('renders the app icon', async () => {
    const { getByLabelText } = await renderWithProviders(<DashboardScreen />);

    expect(getByLabelText('Icono de la aplicaciÃ³n Sistema de Ventas')).toBeTruthy();
  });
});
