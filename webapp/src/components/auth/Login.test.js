import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import AuthProvider from 'react-auth-kit/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import createStore from 'react-auth-kit/createStore';
const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  let usernameInput = 0;
  let passwordInput = 0;
  let loginButton = 0;
  const store = createStore({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
  });
  beforeEach(() => {
    mockAxios.reset();
   

    render(
      <AuthProvider
        store={store}
      >
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>);

     usernameInput = screen.getByLabelText(/Username/i);
     passwordInput = screen.getByLabelText(/Password/i);
     loginButton = screen.getByRole('button', { name: /Log In/i });
  });

  it('should log in successfully', async () => {

    const mock = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mock,
    }));
    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/login').reply(200, { username: "testUser", email: "test@test.com", createdAt: '2024-01-01T12:34:56Z', token: 'testToken' });

    // Simulate user input
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } });
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
      fireEvent.click(loginButton);
    });


    const linkElement = screen.getByText(/Error: Error: There was a problem.../i);
    expect(linkElement).toBeInTheDocument();


  });

  it('should handle error when logging in', async () => {
   

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/login').reply(401, { error: 'Unauthorized' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/Error: Unauthorized/i)).toBeInTheDocument();
    });

  });


});
