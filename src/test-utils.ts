// src/test-utils.ts

import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// This function wraps the component with a router context
export function renderWithRouter(ui: JSX.Element, options?: RenderOptions) {
    return render(ui, { wrapper: MemoryRouter, ...options });
}
