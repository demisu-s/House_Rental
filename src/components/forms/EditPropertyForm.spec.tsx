import { screen, fireEvent, waitFor } from '@testing-library/react';
import { EditPropertyForm } from './EditPropertyForm';
import {expect, test, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { usePropertyStore } from '@/store/property';

// Mocking usePropertyStore
vi.mock('@/store/property', () => ({
    usePropertyStore: vi.fn(() => ({
        isLoading: false,
        updateProperty: vi.fn(),
        properties: [
            {
                id: 1,
                title: 'Test Property',
                country: 'Country',
                state: 'State',
                city: 'City',
                street: 'Street',
                description: 'Description',
                numberOfBedRooms: 3,
                numberOfBathRooms: 2,
                area: 120,
                type: 'House',
                isFurnished: true,
                haveParking: true,
                status: 'Sale',
                latitude: 51.505,
                longitude: -0.09,
                propertyImages: []
            }
        ]
    })),
}));



// Utility function for rendering components with Router context
function renderWithRouter(ui: React.ReactElement) {
    return render(<Router>{ui}</Router>);
}
test('renders form fields and handles form submission', async () => {
  renderWithRouter(<EditPropertyForm />);

  // Fill out the form
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Updated Property' } });
  fireEvent.change(screen.getByPlaceholderText(/Country/i), { target: { value: 'Updated Country' } });
  fireEvent.change(screen.getByPlaceholderText(/State/i), { target: { value: 'Updated State' } });
  fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Updated City' } });
  fireEvent.change(screen.getByPlaceholderText(/Street/i), { target: { value: 'Updated Street' } });
  fireEvent.change(screen.getByPlaceholderText(/Number of Bedrooms/i), { target: { value: '4' } });
  fireEvent.change(screen.getByPlaceholderText(/Number of Bathrooms/i), { target: { value: '3' } });
  fireEvent.change(screen.getByPlaceholderText(/Area in square meters/i), { target: { value: '150' } });
  fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'Updated Description' } });

  
  
  fireEvent.click(screen.getByText('Update Property'));

  await waitFor(() => {
      
      expect(usePropertyStore().updateProperty).toHaveBeenCalledTimes(1);

  });
});
