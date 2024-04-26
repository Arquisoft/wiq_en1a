import React from 'react';
import { fireEvent, act, render, screen, waitFor } from '@testing-library/react';
import Game from './Game';
import { jest } from '@jest/globals';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const mockAxios = new MockAdapter(axios);

const mock = jest.fn();

jest.mock('react-auth-kit/hooks/useIsAuthenticated');
jest.mock('react-auth-kit/hooks/useAuthUser');
jest.mock('react-router-dom', () => ({
  useNavigate: () => mock,
}));

mockAxios.onGet(/\/imgs\/([^\/]+)\/question/).reply(config => {
  const category = config.url.match(/\/imgs\/([^\/]+)\/question/)[1];
  return [200, {
    question: `${category} question`,
    images: ["img1", "img2", "img3", "img4"]
  }];
});

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

  it('should render the corresponding question depending on the option clicked', async () => {
    useIsAuthenticated.mockReturnValue(() => true);
    useAuthUser.mockReturnValue({ username: 'testUser' });

    let gameOptions = ["Flag","City","Monument","Tourist attraction","Food"]
    let gameCategories = ["flags","cities","monuments","tourist_attractions","foods"]

    for(let i=0;i<gameOptions.length;i++){
      render(<Game />);
      //Click game option
      await act(async ()=>{
        fireEvent.click(screen.getByText(gameOptions[i]))
      })

      //Should have rendered question category
      await waitFor(()=>{
        expect(screen.getByText(gameCategories[i]+" question")).toBeInTheDocument()
      })
    }
  });

  it('should navigate out of the game if the user is not authenticated', async () => {
    useIsAuthenticated.mockReturnValue(() => false);
    useAuthUser.mockReturnValue({ username: 'testUser' });

    render(<Game />);
    await waitFor(()=>{
      expect(screen.queryByText("Let's Play!")).not.toBeInTheDocument();
    })
  });
});