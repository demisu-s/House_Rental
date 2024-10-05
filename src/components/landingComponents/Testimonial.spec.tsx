import { render, screen } from '@testing-library/react';
import { Testimonial } from './Testimonial';
import { expect, test } from 'vitest';

test('renders testimonial component', () => {
    render(<Testimonial />);

    // Check for the heading "CUSTOMER TESTIMONIAL"
    expect(screen.getByText(/CUSTOMER TESTIMONIAL/i)).toBeInTheDocument();

    // Check for the main title "People say about us?"
    expect(screen.getByText(/People say about us\?/i)).toBeInTheDocument();

    // Check for the "Learn More" link
    expect(screen.getByRole('link', { name: /Learn More/i })).toBeInTheDocument();

    expect(screen.getByText(/It proved to be exactly the kind of home we wanted./i)).toBeInTheDocument();
    expect(screen.getByText(/Nobody knows Portland and the peninsula better than David./i)).toBeInTheDocument();
    expect(screen.getByText(/He keeps his client’s best interests in sharp focus/i)).toBeInTheDocument();

    expect(screen.getByText(/Jaydon Aminoff/i)).toBeInTheDocument();
    expect(screen.getByText(/Alfredo Donin/i)).toBeInTheDocument();
    expect(screen.getByText(/Makenna Korsgaard/i)).toBeInTheDocument();

    // Check for customer titles
    expect(screen.getByText(/UX Designer/i)).toBeInTheDocument();
    expect(screen.getByText(/UI Designer/i)).toBeInTheDocument();
    expect(screen.getByText(/UX Researcher/i)).toBeInTheDocument();

    // Check for the quote icon
    const quoteImages = screen.getAllByAltText('quote');
    expect(quoteImages.length).toBe(3); 

    // Check for customer images
    const customerImages = screen.getAllByAltText(/Jaydon Aminoff|Alfredo Donin|Makenna Korsgaard/i);
    expect(customerImages.length).toBe(3); 
});
