import { render, screen } from '@testing-library/react';
import { HomeList } from './HomeList';
import { expect, test } from 'vitest';

test('renders HomeList component correctly', () => {
    render(<HomeList />);

    // Check for the main heading
    expect(screen.getByText(/Based on your location/i)).toBeInTheDocument();

    // Check for the subheading
    expect(screen.getByText(/Some of our picked properties near your location./i)).toBeInTheDocument();

    // Check for the search input box
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();

    
    const homeTitles = [
        "Beverly Springfield",
        "Home 2",
        "Home 3",
        "Home 4",
        "Home 5",
        "Home 6"
    ];

    homeTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Check for the "POPULAR" badge
    const popularBadges = screen.getAllByText(/POPULAR/i);
    expect(popularBadges.length).toBe(homeTitles.length);

    // Check that the "Browse more homes" button is rendered
    expect(screen.getByText(/Browse more homes/i)).toBeInTheDocument();
});
