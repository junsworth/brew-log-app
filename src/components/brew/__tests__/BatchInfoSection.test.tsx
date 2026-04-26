import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BatchInfoSection } from '../BatchInfoSection'
import { createDefaultBatchInfo } from '@/lib/defaults'

// The shadcn Label component does not emit htmlFor/id, so getByLabelText is
// unavailable. We scope each query to the nearest wrapping div via closest().
function inputFor(labelText: string | RegExp) {
  const label = screen.getByText(labelText)
  const group = label.closest('div')!
  return within(group).getByRole('textbox') as HTMLInputElement
}

function spinFor(labelText: string | RegExp) {
  const label = screen.getByText(labelText)
  const group = label.closest('div')!
  return within(group).getByRole('spinbutton') as HTMLInputElement
}

function setup(overrides = {}) {
  const data = { ...createDefaultBatchInfo(), ...overrides }
  const onChange = vi.fn()
  const utils = render(<BatchInfoSection data={data} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('BatchInfoSection', () => {
  it('renders all expected labels', () => {
    setup()
    expect(screen.getByText(/recipe \/ beer name/i)).toBeInTheDocument()
    expect(screen.getByText(/brewer/i)).toBeInTheDocument()
    expect(screen.getByText(/batch size/i)).toBeInTheDocument()
    expect(screen.getByText(/boil time/i)).toBeInTheDocument()
    expect(screen.getByText(/ibu/i)).toBeInTheDocument()
    expect(screen.getByText(/srm/i)).toBeInTheDocument()
  })

  it('displays the current recipeName value', () => {
    setup({ recipeName: 'West Coast IPA' })
    expect(inputFor(/recipe \/ beer name/i)).toHaveValue('West Coast IPA')
  })

  it('calls onChange with the updated recipeName when the user types', () => {
    // Controlled input: use fireEvent.change to supply the full value in one event,
    // since onChange is mocked and the value prop won't accumulate across keystrokes.
    const { onChange } = setup({ recipeName: '' })

    fireEvent.change(inputFor(/recipe \/ beer name/i), { target: { value: 'Mosaic Pale' } })

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ recipeName: 'Mosaic Pale' }))
  })

  it('calls onChange with the updated brewer name', () => {
    const { onChange } = setup({ brewer: '' })

    fireEvent.change(inputFor(/^brewer$/i), { target: { value: 'Jon' } })

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ brewer: 'Jon' }))
  })

  it('calls onChange with a numeric batchSize when a number is entered', () => {
    const { onChange } = setup({ batchSize: '' })

    fireEvent.change(spinFor(/batch size/i), { target: { value: '20' } })

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ batchSize: 20 }))
  })

  it('calls onChange with empty string for batchSize when the field is cleared', () => {
    const { onChange } = setup({ batchSize: 20 })

    fireEvent.change(spinFor(/batch size/i), { target: { value: '' } })

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ batchSize: '' }))
  })

  it('does not call onChange on initial render', () => {
    const { onChange } = setup()
    expect(onChange).not.toHaveBeenCalled()
  })
})
