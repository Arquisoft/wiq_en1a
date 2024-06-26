import React from 'react';
import { render, fireEvent, screen, waitFor, act, getByRole, getAllByRole } from '@testing-library/react';
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

async function loadImages(){
  await act(async () => {
    fireEvent.load(screen.getAllByRole("img")[0])
    fireEvent.load(screen.getAllByRole("img")[1])
    fireEvent.load(screen.getAllByRole("img")[2])
    fireEvent.load(screen.getAllByRole("img")[3])
  });
}

async function waitForTimeBarStart(){
  await waitFor(() => {
    const time_bar = screen.getByTestId('time-bar');
    expect(time_bar).toBeInTheDocument();
    const widthStyle = time_bar.style.width;
    const widthValue = parseFloat(widthStyle);
    expect(widthValue).toBeGreaterThan(0);
  });
}

describe('Question page', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render a question of flag images if type is image and category is flags', async () => {
    useAuthUser.mockReturnValue({ username: 'testUser' });

    mockAxios.onGet('http://localhost:8000/imgs/flags/question').reply(200, 
    {
        question: "Which of the following flags belongs to Spain?", 
        images:["https://commons.wikimedia.org/wiki/File:Flag_of_Spain.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_England.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Poland.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Germany.svg"]
    });

    render(<Question type="imgs" category="flags"/>);

    await waitFor(() => {
      expect(screen.getByText(/Which of the following flags belongs to/i)).toBeInTheDocument();
      expect(screen.getByText(/Score/i)).toBeInTheDocument(); 
      expect(screen.getByText(/Score/i).textContent).toBe("Score: 0")
      let imgs = []
      imgs = screen.getAllByRole("button")
      expect(imgs.length).toBe(4)
    });
  });

  it('should render a question of food images if type is image and category is foods', async () => {
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
      expect(screen.getByText(/Score/i).textContent).toBe("Score: 0")
      let imgs = []
      imgs = screen.getAllByRole("button")
      expect(imgs.length).toBe(4)
    });
  });

  it('should handle a fetching question error', async () => {
    useAuthUser.mockReturnValue({ username: 'testUser' });

    mockAxios.onGet('http://localhost:8000/imgs/foods/question').networkError();

    render(<Question type="imgs" category="foods"/>);
  });

  it('should update the score if the answer is correct', async () => {
    useAuthUser.mockReturnValue({ username: 'testUser' });

    mockAxios.onGet('http://localhost:8000/imgs/flags/question').reply(200, 
    {
        question: "Which of the following flags belongs to Spain?", 
        images:["https://commons.wikimedia.org/wiki/File:Flag_of_Spain.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_England.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Poland.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Germany.svg"]
    });

    mockAxios.onPost('http://localhost:8000/imgs/answer').reply(200, 
    {
        correct: "true"
    });

    render(<Question type="imgs" category="flags"/>);

    await waitFor(() => {
      expect(screen.getByText(/Score/i).textContent).toBe("Score: 0")
      expect(screen.getByText(/Which of the following/i)).toBeInTheDocument();
    });

    await loadImages()
    await waitForTimeBarStart()

    await act(async () => {
      fireEvent.click(screen.getAllByRole("img")[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/Score/i).textContent).toBe("Score: 1")
    })
  });

  it('should not update the score if the answer is incorrect', async () => {
    useAuthUser.mockReturnValue({ username: 'testUser' });

    mockAxios.onGet('http://localhost:8000/imgs/flags/question').reply(200, 
    {
        question: "Which of the following flags belongs to Spain?", 
        images:["https://commons.wikimedia.org/wiki/File:Flag_of_Spain.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_England.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Poland.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Germany.svg"]
    });

    mockAxios.onPost('http://localhost:8000/imgs/answer').reply(200, 
    {
      correct: "false",
      correctImg: "https://commons.wikimedia.org/wiki/File:Flag_of_Spain.svg"
    });

    render(<Question type="imgs" category="flags"/>);

    await waitFor(() => {
      expect(screen.getByText(/Score/i).textContent).toBe("Score: 0")
      expect(screen.getByText(/Which of the following/i)).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getAllByRole("img")[2]);
    });

    await waitFor(() => {
      expect(screen.getByText(/Score/i).textContent).toBe("Score: 0")
    })
  });

  it('should finish the game and render the report, from which game can be restarted', async () => {
    useAuthUser.mockReturnValue({ username: 'testUser' });

    mockAxios.onGet('http://localhost:8000/imgs/flags/question').reply(200, 
    {
        question: "Which of the following flags belongs to Spain?", 
        images:["https://commons.wikimedia.org/wiki/File:Flag_of_Spain.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_England.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Poland.svg"
        ,"https://commons.wikimedia.org/wiki/File:Flag_of_Germany.svg"]
    });

    mockAxios.onPost('http://localhost:8000/imgs/answer').reply(200, 
    {
      correct: "false",
      correctImg: "https://commons.wikimedia.org/wiki/File:Flag_of_Spain.svg"
    });

    render(<Question type="imgs" category="flags"/>);

    await waitFor(() => {
      expect(screen.getByText(/Which of the following/i)).toBeInTheDocument();
    });

    const questionsPerGame = 10;
    for(let i=0;i<questionsPerGame;i++){
      await loadImages()
      await waitForTimeBarStart()
      await act(async () => {
        fireEvent.click(screen.getAllByRole("img")[2]);
      });
    }

    await waitFor(() => {
      expect(screen.queryByText("Game Over!")).toBeInTheDocument()
    })

    await act(async ()=>{
      fireEvent.click(screen.getByText("Restart Game"))
    })

    await waitFor(() => {
      expect(screen.queryByText(/Which of the following/i)).toBeInTheDocument()
    })
  });
});



