import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { expect, test } from 'vitest';

test('renders Hero component', () => {
    render(<Hero />);

    const heading = screen.getByText('Find Your Perfect Home with Us');
    expect(heading).toBeInTheDocument();

    const paragraph = screen.getByText('Discover Your Dream Home with Us - Where Perfect Meets Possible in Every Home');
    expect(paragraph).toBeInTheDocument();

    const rentButton = screen.getByRole('button', { name: /rent/i });
    expect(rentButton).toBeInTheDocument();

    const buyButton = screen.getByRole('button', { name: /buy/i });
    expect(buyButton).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Type keyword...');
    expect(searchInput).toBeInTheDocument();

    const typeSelect = screen.getAllByRole('combobox')[0];
    expect(typeSelect).toBeInTheDocument();

    const locationSelect = screen.getAllByRole('combobox')[1];
    expect(locationSelect).toBeInTheDocument();

    const searchButton = screen.getByRole('button', { name: /search now/i });
    expect(searchButton).toBeInTheDocument();
});
