import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import MainPage from './MainPage';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';


jest.mock('react-auth-kit/hooks/useIsAuthenticated');
jest.mock('react-auth-kit/hooks/useAuthUser');
const mock = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mock,
}));
describe('MainPage', () => {
  it('renders welcome message for authenticated user', () => {
    useIsAuthenticated.mockReturnValue(() => true);
    useAuthUser.mockReturnValue({ username: 'testUser' });
    const { getByText } = render(<MainPage />);
    expect(getByText('Welcome back, testUser!')).toBeInTheDocument();
  });

  it('renders welcome message for unauthenticated user', () => {
    useIsAuthenticated.mockReturnValue(() => false);
    const { getByText } = render(<MainPage />);
    expect(getByText('Welcome to WIQ, Please log in to play!')).toBeInTheDocument();
  });

  
});