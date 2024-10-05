import { render, screen, } from '@testing-library/react';
import { expect, test, } from 'vitest';
import { EditRentForm } from './EditRentForm';
import { BrowserRouter as Router } from 'react-router-dom';



test('displays loading state correctly', () => {

    render(
        <Router>
          <EditRentForm />
        </Router>
      );
    
      // Check if loading indicator is present
      expect(screen.getByText('Loading...')).toBeInTheDocument();


  // Check if form fields are populated with mock data
  expect(screen.getByPlaceholderText('Title')).toHaveValue('Rent 1');
  expect(screen.getByPlaceholderText('Price')).toHaveValue('1000');
  expect(screen.getByLabelText('Write Your Requirement in detail to Renting the home')).toHaveValue('Description 1');
  expect(screen.getByDisplayValue('Per Month')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Fully Furnished')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Immediate')).toBeInTheDocument();

  expect(screen.getByText('Select a Property')).toBeInTheDocument();
  expect(screen.getByText('Per Month')).toBeInTheDocument();
  expect(screen.getByText('Fully Furnished')).toBeInTheDocument();
  expect(screen.getByText('Immediate')).toBeInTheDocument();
});
