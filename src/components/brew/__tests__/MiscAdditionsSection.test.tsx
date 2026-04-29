import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MiscAdditionsSection } from '../MiscAdditionsSection'
import type { MiscAddition } from '@/types/brew'

function makeMisc(overrides: Partial<MiscAddition> = {}): MiscAddition {
  return {
    id: 'misc-1',
    ingredient: 'Irish Moss',
    use: 'Fining',
    amount: '1 tsp',
    timeStage: '15 min',
    notes: '',
    ...overrides,
  }
}

function setup(rows: MiscAddition[], onChange = vi.fn()) {
  const utils = render(<MiscAdditionsSection rows={rows} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('MiscAdditionsSection', () => {
  describe('render', () => {
    it('renders a card for each configured row', () => {
      setup([
        makeMisc({ id: 'm-1', ingredient: 'Irish Moss' }),
        makeMisc({ id: 'm-2', ingredient: 'Whirlfloc' }),
      ])
      expect(screen.getByText('Irish Moss')).toBeInTheDocument()
      expect(screen.getByText('Whirlfloc')).toBeInTheDocument()
    })

    it('shows empty state message when all rows have no ingredient', () => {
      setup([makeMisc({ ingredient: '' })])
      expect(screen.getByText('No additions added yet.')).toBeInTheDocument()
    })

    it('shows ingredient name and use as subtitle', () => {
      setup([makeMisc({ ingredient: 'Irish Moss', use: 'Fining' })])
      expect(screen.getByText('Irish Moss')).toBeInTheDocument()
      expect(screen.getByText('Fining')).toBeInTheDocument()
    })

    it('shows amount and timeStage stats on the card', () => {
      setup([makeMisc({ amount: '1 tsp', timeStage: '15 min' })])
      expect(screen.getByText('1 tsp')).toBeInTheDocument()
      expect(screen.getByText('15 min')).toBeInTheDocument()
    })

    it('shows "—" for empty amount and timeStage', () => {
      setup([makeMisc({ amount: '', timeStage: '' })])
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(2)
    })

    it('shows notes below the card when present', () => {
      setup([makeMisc({ notes: 'Rehydrate first' })])
      expect(screen.getByText('Rehydrate first')).toBeInTheDocument()
    })

    it('does not call onChange on initial render', () => {
      const { onChange } = setup([makeMisc()])
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('add addition flow', () => {
    it('"Add Addition" button opens the dialog with title "Add Addition"', async () => {
      const user = userEvent.setup()
      setup([makeMisc()])
      await user.click(screen.getByRole('button', { name: /add addition/i }))
      expect(screen.getByRole('heading', { name: /add addition/i })).toBeInTheDocument()
    })

    it('cancelling the add dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeMisc()])
      await user.click(screen.getByRole('button', { name: /add addition/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the add dialog appends a new row via onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeMisc({ id: 'm-1' })])

      await user.click(screen.getByRole('button', { name: /add addition/i }))

      fireEvent.change(screen.getByLabelText(/^ingredient$/i), {
        target: { value: 'Whirlfloc' },
      })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: MiscAddition[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(2)
      expect(saved[1].ingredient).toBe('Whirlfloc')
    })
  })

  describe('edit addition flow', () => {
    it('pencil button opens the edit dialog with title "Edit Addition"', async () => {
      const user = userEvent.setup()
      setup([makeMisc()])
      await user.click(screen.getByRole('button', { name: /edit addition/i }))
      expect(screen.getByRole('heading', { name: /edit addition/i })).toBeInTheDocument()
    })

    it('edit dialog pre-fills the existing ingredient value', async () => {
      const user = userEvent.setup()
      setup([makeMisc({ ingredient: 'Irish Moss' })])
      await user.click(screen.getByRole('button', { name: /edit addition/i }))
      const input = screen.getByLabelText(/^ingredient$/i) as HTMLInputElement
      expect(input.value).toBe('Irish Moss')
    })

    it('cancelling the edit dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeMisc()])
      await user.click(screen.getByRole('button', { name: /edit addition/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the edit dialog calls onChange with the updated row', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeMisc({ id: 'm-1', amount: '1 tsp' })])

      await user.click(screen.getByRole('button', { name: /edit addition/i }))

      fireEvent.change(screen.getByLabelText(/^amount$/i), {
        target: { value: '2 tsp' },
      })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: MiscAddition[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(1)
      expect(saved[0].amount).toBe('2 tsp')
    })
  })

  describe('delete', () => {
    it('delete button calls onChange without the deleted row', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([
        makeMisc({ id: 'm-1', ingredient: 'Irish Moss' }),
        makeMisc({ id: 'm-2', ingredient: 'Whirlfloc' }),
      ])

      const deleteButtons = screen.getAllByRole('button', { name: /delete addition/i })
      await user.click(deleteButtons[0])

      expect(onChange).toHaveBeenCalledOnce()
      const saved: MiscAddition[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(1)
      expect(saved[0].id).toBe('m-2')
    })

    it('delete button is disabled when only one row remains', () => {
      setup([makeMisc()])
      expect(screen.getByRole('button', { name: /delete addition/i })).toBeDisabled()
    })
  })
})
