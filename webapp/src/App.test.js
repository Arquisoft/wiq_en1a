import { render, screen } from '@testing-library/react';
import App from './App';
import AuthProvider from 'react-auth-kit/AuthProvider';
import createStore from 'react-auth-kit/createStore';


test('renders /', () => {
  const store = createStore({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
  });

  render(
    <AuthProvider
      store={store}
    >

        <App />

    </AuthProvider>);
  const linkElement = screen.getByText(/Welcome to WIQ, Please log in to play!/i);
  expect(linkElement).toBeInTheDocument();
  const button = screen.getByRole('button', { name: /Create account/i });
  expect(button).toBeInTheDocument();
});
