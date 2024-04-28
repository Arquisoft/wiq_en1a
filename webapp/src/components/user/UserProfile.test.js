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
            username: 'testUser',
            email: 'test@example.com',
            ranking: {
              global: {
                questions: 10,
                correct: 7,
                wrong: 3,
              },
              cities: {
                questions: 0,
                correct: 0,
                wrong: 0,
              },
              flags: {
                questions: 0,
                correct: 0,
                wrong: 0,
              },
              monuments: {
                questions: 0,
                correct: 0,
                wrong: 0,
              },
              tourist_attractions: {
                questions: 0,
                correct: 0,
                wrong: 0,
              },
              foods: {
                questions: 0,
                correct: 0,
                wrong: 0,
              },
            }
          },
        });
    
        const { getByText } = render(<UserProfile />);
    
        await waitFor(() => {
          expect(getByText('testUser')).toBeInTheDocument();
          expect(getByText('Email: test@example.com')).toBeInTheDocument();
          expect(getByText('Joined: 1/1/2024')).toBeInTheDocument();
          expect(getByText('Global')).toBeInTheDocument();
          expect(getByText('Total questions: 10')).toBeInTheDocument();
          expect(getByText('Correct questions: 7')).toBeInTheDocument();
          expect(getByText('Wrong questions: 3')).toBeInTheDocument();
        });
      });
    });