import { render, screen } from '@testing-library/react';
import { Nav } from './Nav';
import { expect, test, vi } from 'vitest';

// Mock useNavigate to prevent actual navigation during tests
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

test('renders Nav component', () => {
    render(<Nav />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
});
