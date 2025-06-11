import  '@testing-library/jest-dom'
import {render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

test('renders a simple component', () => {
    render(<div>Hello, World!</div>)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
}
)
