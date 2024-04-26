import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

jest.mock('react-auth-kit/hooks/useIsAuthenticated');
jest.mock('react-auth-kit/hooks/useSignOut');

describe('Navbar', () => {

    beforeEach(() => {        
        // Reset mock function calls before each test
        jest.clearAllMocks();
    });

  it('renders authenticated user links and logout button', () => {
    useIsAuthenticated.mockReturnValue(() => true);
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText('WIQ')).toBeInTheDocument();
    expect(getByText('Play')).toBeInTheDocument();
    expect(getByText('Rankings')).toBeInTheDocument();
    expect(getByText('My Profile')).toBeInTheDocument();
    expect(getByText('Log out')).toBeInTheDocument();
  });

  it('renders unauthenticated user links and sign-in link', () => {
    useIsAuthenticated.mockReturnValue(() => false);
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText('WIQ')).toBeInTheDocument();
    expect(getByText('Play')).toBeInTheDocument();
    expect(getByText('Rankings')).toBeInTheDocument();
    expect(getByText('Log In')).toBeInTheDocument();
  });
  it('calls signOut when Log out button is clicked', () => {
    useIsAuthenticated.mockReturnValue(() => true);
    useSignOut.mockReturnValue(() => {});
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Log out'));
    expect(useSignOut).toHaveBeenCalled();
  });
  
});
