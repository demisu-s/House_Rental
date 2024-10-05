import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AddPropertyForm } from './AddPropertyForm';
import { expect, test } from 'vitest';

// Custom render function to include Router context
const renderWithRouter = (ui: React.ReactElement) => render(ui, { wrapper: Router });

test('render add property form', () => {
    renderWithRouter(<AddPropertyForm />);

    // Check that the form header is present
    expect(screen.getByText(/Add New Home/i)).toBeInTheDocument();

    // Check that input fields are rendered
    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Country/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/State/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/City/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Street/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Number of Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Number of Bathrooms/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Area in square meters/i)).toBeInTheDocument();

    // Check that select elements are rendered
    expect(screen.getByText(/Select Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Status/i)).toBeInTheDocument();

    // Check that checkbox labels are rendered
    expect(screen.getByText(/Is Furnished/i)).toBeInTheDocument();
    expect(screen.getByText(/Has Parking/i)).toBeInTheDocument();

    // Check that textarea is rendered
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();

    // Check that the image upload section is rendered
    expect(screen.getByText(/Drag & drop images here, or click to select files/i)).toBeInTheDocument();

    // Check that the map section is rendered
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();

    // Check that the submit button is rendered
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
});
