import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
// import { userEvent } from '@testing-library/user-event'
import { LandingPage } from './LandingPage'

test('Landing page test', async () => {
  render(<LandingPage />)

  const navBar = screen.getByTestId('landingPage')

  expect(navBar).toBeInTheDocument()
})