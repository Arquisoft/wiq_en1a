import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import UserProfile from './UserProfile';
import axios from 'axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

jest.mock('axios');
jest.mock('react-auth-kit/hooks/useAuthUser', () => jest.fn());

describe('UserProfile', () => {
    beforeEach(() => {
      useAuthUser.mockReturnValue({
        username: 'testUser',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      });
    });

    it('renders user details', async () => {
        axios.get.mockResolvedValueOnce({
          data: {
            questions: 10,
            correct: 7,
            wrong: 3,
          },
        });
    
        const { getByText } = render(<UserProfile />);
    
        await waitFor(() => {
          expect(getByText('Username: testUser')).toBeInTheDocument();
          expect(getByText('Email: test@example.com')).toBeInTheDocument();
          expect(getByText('Joined: 1/1/2024')).toBeInTheDocument();
          expect(getByText('Total Answered Questions: 10')).toBeInTheDocument();
          expect(getByText('Right Answers: 7')).toBeInTheDocument();
          expect(getByText('Wrong Answers: 3')).toBeInTheDocument();
        });
      });

      it('changes category when category button is clicked', async () => {
        axios.get.mockResolvedValueOnce({
          data: {
            questions: 5,
            correct: 3,
            wrong: 2,
          },
        });
    
        const { getByText } = render(<UserProfile />);
    
        fireEvent.click(getByText('Flags'));
    
        await waitFor(() => {
          expect(getByText('Total Answered Questions: 5')).toBeInTheDocument();
          expect(getByText('Right Answers: 3')).toBeInTheDocument();
          expect(getByText('Wrong Answers: 2')).toBeInTheDocument();
        });
      });
    });