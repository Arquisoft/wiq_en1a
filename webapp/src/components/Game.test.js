import React from 'react';
import { render, screen } from '@testing-library/react';
import Game from './Game';
import { jest } from '@jest/globals';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const mock = jest.fn();

jest.mock('react-auth-kit/hooks/useIsAuthenticated');
jest.mock('react-auth-kit/hooks/useAuthUser');
jest.mock('react-router-dom', () => ({
  useNavigate: () => mock,
}));

describe('Game page', () => {
  it('should render play message for authenticated user', async () => {
    useIsAuthenticated.mockReturnValue(() => true);
    useAuthUser.mockReturnValue({ username: 'testUser' });

    render(<Game />);

    const playmsg = screen.getByText(/Let's Play! Guess the.../i);
    expect(playmsg).toBeInTheDocument();
  });

  it('shouldnt render play message for unauthenticated user', async () => {
    useIsAuthenticated.mockReturnValue(() => false);
    try {
        const playmsg = screen.getByText(/Let's Play! Guess the.../i);
        throw new Error('Unauthenticated user was able to see Game page');
    } catch (err) {}
  });
  
});