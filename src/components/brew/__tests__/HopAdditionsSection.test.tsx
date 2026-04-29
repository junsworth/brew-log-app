import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HopAdditionsSection } from '../HopAdditionsSection'
import type { HopAddition } from '@/types/brew'

function makeHop(overrides: Partial<HopAddition> = {}): HopAddition {
  return {
    id: 'hop-1',
    catalogProductId: '',
    variety: 'Cascade',
    form: 'Pellet',
    alphaPercent: 5.75,
    amount: 30,
    use: 'Boil',
    time: 60,
    ibu: 25,
    ...overrides,
  }
}

function setup(rows: HopAddition[], onChange = vi.fn()) {
  const utils = render(<HopAdditionsSection rows={rows} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('HopAdditionsSection', () => {
  describe('render', () => {
    it('renders a card for each hop row', () => {
      setup([
        makeHop({ id: 'hop-1', variety: 'Cascade' }),
        makeHop({ id: 'hop-2', variety: 'Fuggles' }),
      ])
      expect(screen.getByText('Cascade')).toBeInTheDocument()
      expect(screen.getByText('Fuggles')).toBeInTheDocument()
    })

    it('shows empty state message when all rows have no variety', () => {
      setup([makeHop({ variety: '' })])
      expect(screen.getByText('No hops added yet.')).toBeInTheDocument()
    })

    it('shows variety name and subtitle when form and alpha are set', () => {
      setup([makeHop({ variety: 'Cascade', form: 'Pellet', alphaPercent: 5.75 })])
      expect(screen.getByText('Cascade')).toBeInTheDocument()
      expect(screen.getByText('Pellet · 5.75%α')).toBeInTheDocument()
    })

    it('shows the amount, use, and time stats on the card', () => {
      setup([makeHop({ amount: 30, use: 'Boil', time: 60 })])
      expect(screen.getByText('30')).toBeInTheDocument()
      expect(screen.getByText('Boil')).toBeInTheDocument()
      expect(screen.getByText('60')).toBeInTheDocument()
    })

    it('shows "—" for empty numeric stats', () => {
      setup([makeHop({ amount: '', time: '', use: '' })])
      // Three "—" dashes for g / use / min
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(3)
    })

    it('does not call onChange on initial render', () => {
      const { onChange } = setup([makeHop()])
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('add hop flow', () => {
    it('"Add Hop" button opens the add dialog with title "Add Hop"', async () => {
      const user = userEvent.setup()
      setup([makeHop()])
      await user.click(screen.getByRole('button', { name: /add hop/i }))
      expect(screen.getByRole('heading', { name: /add hop/i })).toBeInTheDocument()
    })

    it('cancelling the add dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeHop()])
      await user.click(screen.getByRole('button', { name: /add hop/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the add dialog appends a new row via onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeHop({ id: 'hop-1' })])

      await user.click(screen.getByRole('button', { name: /add hop/i }))

      // Fill amount field
      const amountInput = screen.getByLabelText(/amount \(g\)/i)
      fireEvent.change(amountInput, { target: { value: '15' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: HopAddition[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(2)
      expect(saved[1].amount).toBe(15)
    })
  })

  describe('edit hop flow', () => {
    it('pencil button opens the edit dialog with title "Edit Hop"', async () => {
      const user = userEvent.setup()
      setup([makeHop()])
      await user.click(screen.getByRole('button', { name: /edit hop/i }))
      expect(screen.getByText('Edit Hop')).toBeInTheDocument()
    })

    it('edit dialog pre-fills the existing amount value', async () => {
      const user = userEvent.setup()
      setup([makeHop({ amount: 30 })])
      await user.click(screen.getByRole('button', { name: /edit hop/i }))
      const amountInput = screen.getByLabelText(/amount \(g\)/i) as HTMLInputElement
      expect(amountInput.value).toBe('30')
    })

    it('cancelling the edit dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeHop()])
      await user.click(screen.getByRole('button', { name: /edit hop/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the edit dialog calls onChange with the updated row', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeHop({ id: 'hop-1', amount: 30 })])

      await user.click(screen.getByRole('button', { name: /edit hop/i }))

      const amountInput = screen.getByLabelText(/amount \(g\)/i)
      fireEvent.change(amountInput, { target: { value: '50' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: HopAddition[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(1)
      expect(saved[0].amount).toBe(50)
    })
  })

  describe('delete', () => {
    it('delete button calls onChange without the deleted row', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([
        makeHop({ id: 'hop-1', variety: 'Cascade' }),
        makeHop({ id: 'hop-2', variety: 'Fuggles' }),
      ])

      const deleteButtons = screen.getAllByRole('button', { name: /delete hop/i })
      await user.click(deleteButtons[0])

      expect(onChange).toHaveBeenCalledOnce()
      const saved: HopAddition[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(1)
      expect(saved[0].id).toBe('hop-2')
    })

    it('delete button is disabled when only one row remains', () => {
      setup([makeHop()])
      const deleteButton = screen.getByRole('button', { name: /delete hop/i })
      expect(deleteButton).toBeDisabled()
    })
  })

  describe('catalog integration', () => {
    it('selecting a catalog hop in the add dialog auto-fills the variety name', async () => {
      const user = userEvent.setup()
      setup([makeHop()])

      await user.click(screen.getByRole('button', { name: /add hop/i }))

      const combobox = screen.getByPlaceholderText(/select hop/i)
      await user.click(combobox)
      await user.click(screen.getByText('East Kent Goldings'))

      expect(screen.getByDisplayValue('East Kent Goldings')).toBeInTheDocument()
    })

    it('alpha % field becomes read-only when a catalog hop is selected', async () => {
      const user = userEvent.setup()
      setup([makeHop()])

      await user.click(screen.getByRole('button', { name: /add hop/i }))

      const combobox = screen.getByPlaceholderText(/select hop/i)
      await user.click(combobox)
      await user.click(screen.getByText('East Kent Goldings'))

      const alphaInput = screen.getByLabelText(/alpha %/i) as HTMLInputElement
      expect(alphaInput).toHaveAttribute('readonly')
    })

    it('variety input is shown and editable when custom is selected', async () => {
      const user = userEvent.setup()
      setup([makeHop()])

      await user.click(screen.getByRole('button', { name: /add hop/i }))

      const combobox = screen.getByPlaceholderText(/select hop/i)
      await user.click(combobox)
      await user.click(screen.getByText('Custom'))

      expect(screen.getByLabelText(/^variety$/i)).toBeInTheDocument()
    })
  })
})
