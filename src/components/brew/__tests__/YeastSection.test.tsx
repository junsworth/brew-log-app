import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { YeastSection } from '../YeastSection'
import type { Yeast } from '@/types/brew'

function makeYeast(overrides: Partial<Yeast> = {}): Yeast {
  return {
    id: 'yeast-1',
    catalogProductId: '',
    strainName: 'Fermentis SafAle US-05',
    labBrand: 'Fermentis',
    form: 'Dry',
    amount: '11.5g',
    pitchTemp: 20,
    attenuation: 81,
    lotNumber: '',
    ...overrides,
  }
}

function setup(rows: Yeast[], onChange = vi.fn()) {
  const utils = render(<YeastSection rows={rows} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('YeastSection', () => {
  describe('render', () => {
    it('renders a card for each configured yeast row', () => {
      setup([
        makeYeast({ id: 'y-1', strainName: 'Fermentis SafAle US-05' }),
        makeYeast({ id: 'y-2', strainName: 'LalBrew Verdant IPA' }),
      ])
      expect(screen.getByText('Fermentis SafAle US-05')).toBeInTheDocument()
      expect(screen.getByText('LalBrew Verdant IPA')).toBeInTheDocument()
    })

    it('shows empty state message when all rows have no strain name', () => {
      setup([makeYeast({ strainName: '' })])
      expect(screen.getByText('No yeast added yet.')).toBeInTheDocument()
    })

    it('shows strain name and brand · form subtitle', () => {
      setup([makeYeast({ strainName: 'SafAle US-05', labBrand: 'Fermentis', form: 'Dry' })])
      expect(screen.getByText('SafAle US-05')).toBeInTheDocument()
      expect(screen.getByText('Fermentis · Dry')).toBeInTheDocument()
    })

    it('shows amount, pitch temp, and attenuation stats on the card', () => {
      setup([makeYeast({ amount: '11.5g', pitchTemp: 20, attenuation: 81 })])
      expect(screen.getByText('11.5g')).toBeInTheDocument()
      expect(screen.getByText('20°C')).toBeInTheDocument()
      expect(screen.getByText('81%')).toBeInTheDocument()
    })

    it('shows "—" for empty numeric stats', () => {
      setup([makeYeast({ amount: '', pitchTemp: '', attenuation: '' })])
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(2)
    })

    it('does not call onChange on initial render', () => {
      const { onChange } = setup([makeYeast()])
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('add yeast flow', () => {
    it('"Add Yeast" button opens the add dialog with title "Add Yeast"', async () => {
      const user = userEvent.setup()
      setup([makeYeast()])
      await user.click(screen.getByRole('button', { name: /add yeast/i }))
      expect(screen.getByRole('heading', { name: /add yeast/i })).toBeInTheDocument()
    })

    it('cancelling the add dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeYeast()])
      await user.click(screen.getByRole('button', { name: /add yeast/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the add dialog appends a new row via onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeYeast({ id: 'y-1' })])

      await user.click(screen.getByRole('button', { name: /add yeast/i }))

      const pitchInput = screen.getByLabelText(/pitch temp/i)
      fireEvent.change(pitchInput, { target: { value: '18' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: Yeast[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(2)
      expect(saved[1].pitchTemp).toBe(18)
    })
  })

  describe('edit yeast flow', () => {
    it('pencil button opens the edit dialog with title "Edit Yeast"', async () => {
      const user = userEvent.setup()
      setup([makeYeast()])
      await user.click(screen.getByRole('button', { name: /edit yeast/i }))
      expect(screen.getByRole('heading', { name: /edit yeast/i })).toBeInTheDocument()
    })

    it('edit dialog pre-fills the existing pitch temp value', async () => {
      const user = userEvent.setup()
      setup([makeYeast({ pitchTemp: 20 })])
      await user.click(screen.getByRole('button', { name: /edit yeast/i }))
      const pitchInput = screen.getByLabelText(/pitch temp/i) as HTMLInputElement
      expect(pitchInput.value).toBe('20')
    })

    it('cancelling the edit dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeYeast()])
      await user.click(screen.getByRole('button', { name: /edit yeast/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the edit dialog calls onChange with the updated row', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([makeYeast({ id: 'y-1', pitchTemp: 20 })])

      await user.click(screen.getByRole('button', { name: /edit yeast/i }))

      const pitchInput = screen.getByLabelText(/pitch temp/i)
      fireEvent.change(pitchInput, { target: { value: '18' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: Yeast[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(1)
      expect(saved[0].pitchTemp).toBe(18)
    })
  })

  describe('delete', () => {
    it('delete button calls onChange without the deleted row', async () => {
      const user = userEvent.setup()
      const { onChange } = setup([
        makeYeast({ id: 'y-1', strainName: 'SafAle US-05' }),
        makeYeast({ id: 'y-2', strainName: 'SafAle S-04' }),
      ])

      const deleteButtons = screen.getAllByRole('button', { name: /delete yeast/i })
      await user.click(deleteButtons[0])

      expect(onChange).toHaveBeenCalledOnce()
      const saved: Yeast[] = onChange.mock.calls[0][0]
      expect(saved).toHaveLength(1)
      expect(saved[0].id).toBe('y-2')
    })

    it('delete button is disabled when only one row remains', () => {
      setup([makeYeast()])
      expect(screen.getByRole('button', { name: /delete yeast/i })).toBeDisabled()
    })
  })

  describe('catalog integration', () => {
    it('selecting a catalog yeast auto-fills the strain name', async () => {
      const user = userEvent.setup()
      setup([makeYeast()])

      await user.click(screen.getByRole('button', { name: /add yeast/i }))

      const combobox = screen.getByPlaceholderText(/select yeast/i)
      await user.click(combobox)
      await user.click(screen.getByText('Fermentis SafAle S-04'))

      expect(screen.getByDisplayValue('Fermentis SafAle S-04')).toBeInTheDocument()
    })

    it('brand and amount fields are read-only when a catalog yeast is selected', async () => {
      const user = userEvent.setup()
      setup([makeYeast()])

      await user.click(screen.getByRole('button', { name: /add yeast/i }))

      const combobox = screen.getByPlaceholderText(/select yeast/i)
      await user.click(combobox)
      await user.click(screen.getByText('Fermentis SafAle S-04'))

      expect(screen.getByLabelText(/brand \/ lab/i)).toHaveAttribute('readonly')
      expect(screen.getByLabelText(/amount \/ pack size/i)).toHaveAttribute('readonly')
    })

    it('strain name input is shown and editable when custom is selected', async () => {
      const user = userEvent.setup()
      setup([makeYeast()])

      await user.click(screen.getByRole('button', { name: /add yeast/i }))

      const combobox = screen.getByPlaceholderText(/select yeast/i)
      await user.click(combobox)
      await user.click(screen.getByText('Custom'))

      expect(screen.getByLabelText(/strain name/i)).toBeInTheDocument()
    })
  })
})
