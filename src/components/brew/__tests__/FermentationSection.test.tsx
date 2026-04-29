import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FermentationSection } from '../BoilFermentationPackaging'
import type { FermentationInfo, FermentationStep } from '@/types/brew'

function makeStep(overrides: Partial<FermentationStep> = {}): FermentationStep {
  return {
    id: 'step-1',
    stepName: 'Primary',
    type: 'Primary',
    temp: 20,
    duration: 14,
    startDate: '',
    endDate: '',
    notes: '',
    ...overrides,
  }
}

function makeData(
  schedule: FermentationStep[],
  overrides: Partial<FermentationInfo> = {},
): FermentationInfo {
  return {
    schedule,
    pitchDateTime: '',
    ogMeasured: '',
    fgMeasured: '',
    abvCalc: '',
    attenuation: '',
    carbonation: '',
    ...overrides,
  }
}

function setup(data: FermentationInfo, onChange = vi.fn()) {
  const utils = render(<FermentationSection data={data} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('FermentationSection', () => {
  describe('render', () => {
    it('renders a card for each step with a stepName', () => {
      setup(makeData([
        makeStep({ id: 's-1', stepName: 'Main Ferment', type: '' }),
        makeStep({ id: 's-2', stepName: 'Cold Crash', type: '' }),
      ]))
      expect(screen.getByText('Main Ferment')).toBeInTheDocument()
      expect(screen.getByText('Cold Crash')).toBeInTheDocument()
    })

    it('shows empty state when no step has a stepName', () => {
      setup(makeData([makeStep({ stepName: '' })]))
      expect(screen.getByText('No steps added yet.')).toBeInTheDocument()
    })

    it('shows stepName, type and date range on the card', () => {
      setup(makeData([makeStep({
        stepName: 'Main Ferment', type: 'Primary',
        startDate: '2024-01-01', endDate: '2024-01-14',
      })]))
      expect(screen.getByText('Main Ferment')).toBeInTheDocument()
      expect(screen.getByText('Primary')).toBeInTheDocument()
      expect(screen.getByText('2024-01-01 → 2024-01-14')).toBeInTheDocument()
    })

    it('shows temp and duration stats on the card', () => {
      setup(makeData([makeStep({ temp: 20, duration: 14 })]))
      expect(screen.getByText('20°C')).toBeInTheDocument()
      expect(screen.getByText('14')).toBeInTheDocument()
    })

    it('shows "—" for empty temp and duration', () => {
      setup(makeData([makeStep({ temp: '', duration: '' })]))
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(2)
    })

    it('does not call onChange on initial render', () => {
      const { onChange } = setup(makeData([makeStep()]))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('add step flow', () => {
    it('"Add Step" button opens the dialog with title "Add Step"', async () => {
      const user = userEvent.setup()
      setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /add step/i }))
      expect(screen.getByRole('heading', { name: /add step/i })).toBeInTheDocument()
    })

    it('cancelling the add dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /add step/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the add dialog appends a new step via onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep({ id: 's-1' })]))

      await user.click(screen.getByRole('button', { name: /add step/i }))

      fireEvent.change(screen.getByLabelText(/step name/i), {
        target: { value: 'Cold Crash' },
      })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: FermentationInfo = onChange.mock.calls[0][0]
      expect(saved.schedule).toHaveLength(2)
      expect(saved.schedule[1].stepName).toBe('Cold Crash')
    })
  })

  describe('edit step flow', () => {
    it('pencil button opens the edit dialog with title "Edit Step"', async () => {
      const user = userEvent.setup()
      setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit fermentation step/i }))
      expect(screen.getByRole('heading', { name: /edit step/i })).toBeInTheDocument()
    })

    it('edit dialog pre-fills the existing step name', async () => {
      const user = userEvent.setup()
      setup(makeData([makeStep({ stepName: 'Primary' })]))
      await user.click(screen.getByRole('button', { name: /edit fermentation step/i }))
      const input = screen.getByLabelText(/step name/i) as HTMLInputElement
      expect(input.value).toBe('Primary')
    })

    it('cancelling the edit dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit fermentation step/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the edit dialog calls onChange with the updated step', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep({ id: 's-1', duration: 14 })]))

      await user.click(screen.getByRole('button', { name: /edit fermentation step/i }))

      fireEvent.change(screen.getByLabelText(/duration/i), { target: { value: '21' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: FermentationInfo = onChange.mock.calls[0][0]
      expect(saved.schedule[0].duration).toBe(21)
    })
  })

  describe('delete', () => {
    it('delete button calls onChange without the deleted step', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([
        makeStep({ id: 's-1', stepName: 'Primary' }),
        makeStep({ id: 's-2', stepName: 'Cold Crash' }),
      ]))

      const deleteButtons = screen.getAllByRole('button', { name: /delete fermentation step/i })
      await user.click(deleteButtons[0])

      expect(onChange).toHaveBeenCalledOnce()
      const saved: FermentationInfo = onChange.mock.calls[0][0]
      expect(saved.schedule).toHaveLength(1)
      expect(saved.schedule[0].id).toBe('s-2')
    })

    it('delete button is disabled when only one step remains', () => {
      setup(makeData([makeStep()]))
      expect(screen.getByRole('button', { name: /delete fermentation step/i })).toBeDisabled()
    })
  })

  describe('fermentation results card', () => {
    it('shows static result values on the card', () => {
      setup(makeData([makeStep()], {
        ogMeasured: '1.052', fgMeasured: '1.010', abvCalc: '5.5%',
      }))
      expect(screen.getByText('1.052')).toBeInTheDocument()
      expect(screen.getByText('1.010')).toBeInTheDocument()
      expect(screen.getByText('5.5%')).toBeInTheDocument()
    })

    it('pencil button opens the edit fermentation results dialog', async () => {
      const user = userEvent.setup()
      setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit fermentation results/i }))
      expect(screen.getByRole('heading', { name: /edit fermentation results/i })).toBeInTheDocument()
    })

    it('cancelling the results dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit fermentation results/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the results dialog calls onChange with updated OG', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep()]))

      await user.click(screen.getByRole('button', { name: /edit fermentation results/i }))

      fireEvent.change(screen.getByLabelText(/og measured/i), { target: { value: '1.052' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: FermentationInfo = onChange.mock.calls[0][0]
      expect(saved.ogMeasured).toBe('1.052')
    })
  })
})
