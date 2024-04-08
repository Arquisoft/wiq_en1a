import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import RankingLayout from './RankingLayout';
import { useState } from 'react';
import { jest } from '@jest/globals';

describe('Ranking page', () => {
    it ('should render the global ranking when entering Rankings page', async () => {
        render(<RankingLayout />);
        const category = screen.getAllByText(/global/i);
        expect(category.length).toBe(2);
    });

    it ('should render the <category> ranking when changed the useState', async () => {
        const categoryMock = 'global';
        const setCategoryMock = jest.fn();

        React.useState = jest.fn().mockReturnValue([categoryMock, setCategoryMock])

        render(<RankingLayout />);

        setCategoryMock.mockImplementation(newValue => newValue('cities'));
        const citiesButton = screen.getByRole('button', { name: /Cities/i });
        fireEvent.click(citiesButton);

        const category = screen.getAllByText(/cities/i);
        expect(category.length).toBe(2);
    })
})