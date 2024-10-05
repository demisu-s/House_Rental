import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { expect, test } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

test('renders Footer component', () => {
    render(
        <BrowserRouter>
            <Footer />
        </BrowserRouter>
    );

    // Test for the presence of specific elements
    expect(screen.getByText(/Newsletter/i)).toBeInTheDocument();
    expect(screen.getByText(/Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Community/i)).toBeInTheDocument();
    expect(screen.getByText(/Follow us on/i)).toBeInTheDocument();

    // Test the presence of input field for the newsletter
    const emailInput = screen.getByPlaceholderText(/Input your email/i);
    expect(emailInput).toBeInTheDocument();

    // Test for links
    expect(screen.getByRole('link', { name: /About us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Careers/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Terms & Conditions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy & Policy/i })).toBeInTheDocument();

    // Test for social media icons
    
    // expect(screen.getByRole('link', { name: /Instagram/i })).toBeInTheDocument();
    // expect(screen.getByRole('link', { name: /YouTube/i })).toBeInTheDocument();
    // expect(screen.getByRole('link', { name: /Facebook/i })).toBeInTheDocument();
});
