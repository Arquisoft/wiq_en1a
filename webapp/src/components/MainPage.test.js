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
    expect(getByText('Start Playing')).toBeInTheDocument();
    expect(getByText('Squads')).toBeInTheDocument();
    expect(getByText('My stats')).toBeInTheDocument();
  });

  it('renders welcome message for unauthenticated user', () => {
    useIsAuthenticated.mockReturnValue(() => false);
    const { getByText } = render(<MainPage />);
    expect(getByText('Welcome to WIQ, Please log in to play!')).toBeInTheDocument();
  });
  it('navigates to /play when Start Playing button is clicked', () => {
    useIsAuthenticated.mockReturnValue(() => true);
    useAuthUser.mockReturnValue({ username: 'testUser' });
    const { getByText } = render(<MainPage />);
    fireEvent.click(getByText('Start Playing'));
    expect(mock).toHaveBeenCalledWith('/play');
  });
  it('navigates to /squads when Squads button is clicked', () => {
    useIsAuthenticated.mockReturnValue(() => true);
    useAuthUser.mockReturnValue({ username: 'testUser' });
    const { getByText } = render(<MainPage />);
    fireEvent.click(getByText('Squads'));
    expect(mock).toHaveBeenCalledWith('/squads');
  });
  it('navigates to /userProfile when My stats button is clicked', () => {
    useIsAuthenticated.mockReturnValue(() => true);
    useAuthUser.mockReturnValue({ username: 'testUser' });
    const { getByText } = render(<MainPage />);
    fireEvent.click(getByText('My stats'));
    expect(mock).toHaveBeenCalledWith('/userProfile');
  });
  it('navigates to /register when Create account button is clicked', () => {
    useIsAuthenticated.mockReturnValue(() => false);
    const { getByText } = render(<MainPage />);
    fireEvent.click(getByText('Create account'));
    expect(mock).toHaveBeenCalledWith('/register');
  });
});