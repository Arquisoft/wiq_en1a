import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import Question from './Question';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
const mockAxios = new MockAdapter(axios);

const mock = jest.fn();

jest.mock('react-auth-kit/hooks/useAuthUser');
jest.mock('react-router-dom', () => ({
  useNavigate: () => mock,
}));

describe('Question page', () => {
    beforeEach(() => {
        mockAxios.reset();
      });

  it('should render a flags question if category is flags', async () => {
    useAuthUser.mockReturnValue({ username: 'testUser' });

    mockAxios.onGet('http://localhost:8000/imgs/flags/question').reply(200, 
    {
        question: "Which of the following flags belongs to Spain?", 
        images:["SpainImage","EnglandImage","PolandImage","GermanyImage"]
    });

    render(<Question type="imgs" category="flags"/>);

    await waitFor(() => {
        expect(screen.getByText(/Which of the following flags belongs to/i)).toBeInTheDocument();
        expect(screen.getByText(/Score/i)).toBeInTheDocument();
    });

    let imgs = []
    imgs = screen.getAllByRole("button")
    expect(imgs.length).toBe(4)
  });


  it('should render a flags question if category is foods', async () => {
    useAuthUser.mockReturnValue({ username: 'testUser' });

    mockAxios.onGet('http://localhost:8000/imgs/foods/question').reply(200, 
    {
        question: "Which of the following images corresponds to Tortilla?", 
        images:["TortillaImage","PaellaImage","CachopoImage","ChocoImage"]
    });

    render(<Question type="imgs" category="foods"/>);

    await waitFor(() => {
        expect(screen.getByText(/Which of the following images corresponds to/i)).toBeInTheDocument();
        expect(screen.getByText(/Score/i)).toBeInTheDocument();
    });

    let imgs = []
    imgs = screen.getAllByRole("button")
    expect(imgs.length).toBe(4)
  });
});



