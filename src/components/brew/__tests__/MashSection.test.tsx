import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MashSection } from '../MashSection'
import type { MashInfo, MashStep } from '@/types/brew'

function makeStep(overrides: Partial<MashStep> = {}): MashStep {
  return {
    id: 'step-1',
    stepName: 'Saccharification',
    stepType: 'Infusion',
    tempTarget: 67,
    tempActual: 66,
    duration: 60,
    notes: '',
    ...overrides,
  }
}

function makeData(steps: MashStep[], overrides: Partial<MashInfo> = {}): MashInfo {
  return {
    steps,
    mashWater: '',
    spargeWater: '',
    phTarget: '',
    phMeasured: '',
    firstWortGravity: '',
    ...overrides,
  }
}

function setup(data: MashInfo, onChange = vi.fn()) {
  const utils = render(<MashSection data={data} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('MashSection', () => {
  describe('render', () => {
    it('renders a card for each step with a stepName', () => {
      setup(makeData([
        makeStep({ id: 's-1', stepName: 'Mash In' }),
        makeStep({ id: 's-2', stepName: 'Saccharification' }),
      ]))
      expect(screen.getByText('Mash In')).toBeInTheDocument()
      expect(screen.getByText('Saccharification')).toBeInTheDocument()
    })

    it('shows empty state when no step has a stepName', () => {
      setup(makeData([makeStep({ stepName: '' })]))
      expect(screen.getByText('No steps added yet.')).toBeInTheDocument()
    })

    it('shows stepName and stepType as subtitle on the card', () => {
      setup(makeData([makeStep({ stepName: 'Saccharification', stepType: 'Infusion' })]))
      expect(screen.getByText('Saccharification')).toBeInTheDocument()
      expect(screen.getByText('Infusion')).toBeInTheDocument()
    })

    it('shows tempTarget, tempActual, and duration stats on the card', () => {
      setup(makeData([makeStep({ tempTarget: 67, tempActual: 66, duration: 60 })]))
      expect(screen.getByText('67°C')).toBeInTheDocument()
      expect(screen.getByText('66°C')).toBeInTheDocument()
      expect(screen.getByText('60')).toBeInTheDocument()
    })

    it('shows "—" for empty numeric stats', () => {
      setup(makeData([makeStep({ tempTarget: '', tempActual: '', duration: '' })]))
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(3)
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
        target: { value: 'Mash Out' },
      })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: MashInfo = onChange.mock.calls[0][0]
      expect(saved.steps).toHaveLength(2)
      expect(saved.steps[1].stepName).toBe('Mash Out')
    })
  })

  describe('edit step flow', () => {
    it('pencil button opens the edit dialog with title "Edit Step"', async () => {
      const user = userEvent.setup()
      setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit step/i }))
      expect(screen.getByRole('heading', { name: /edit step/i })).toBeInTheDocument()
    })

    it('edit dialog pre-fills the existing stepName value', async () => {
      const user = userEvent.setup()
      setup(makeData([makeStep({ stepName: 'Saccharification' })]))
      await user.click(screen.getByRole('button', { name: /edit step/i }))
      const input = screen.getByLabelText(/step name/i) as HTMLInputElement
      expect(input.value).toBe('Saccharification')
    })

    it('cancelling the edit dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit step/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the edit dialog calls onChange with the updated step', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep({ id: 's-1', duration: 60 })]))

      await user.click(screen.getByRole('button', { name: /edit step/i }))

      fireEvent.change(screen.getByLabelText(/duration/i), {
        target: { value: '75' },
      })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: MashInfo = onChange.mock.calls[0][0]
      expect(saved.steps).toHaveLength(1)
      expect(saved.steps[0].duration).toBe(75)
    })
  })

  describe('delete', () => {
    it('delete button calls onChange without the deleted step', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([
        makeStep({ id: 's-1', stepName: 'Mash In' }),
        makeStep({ id: 's-2', stepName: 'Saccharification' }),
      ]))

      const deleteButtons = screen.getAllByRole('button', { name: /delete step/i })
      await user.click(deleteButtons[0])

      expect(onChange).toHaveBeenCalledOnce()
      const saved: MashInfo = onChange.mock.calls[0][0]
      expect(saved.steps).toHaveLength(1)
      expect(saved.steps[0].id).toBe('s-2')
    })

    it('delete button is disabled when only one step remains', () => {
      setup(makeData([makeStep()]))
      expect(screen.getByRole('button', { name: /delete step/i })).toBeDisabled()
    })
  })

  describe('mash parameters card', () => {
    it('shows static mash parameter values on the card', () => {
      setup(makeData([makeStep()], {
        mashWater: 25, spargeWater: 15, phTarget: 5.4, phMeasured: 5.3, firstWortGravity: '1.068',
      }))
      expect(screen.getByText('25 L')).toBeInTheDocument()
      expect(screen.getByText('15 L')).toBeInTheDocument()
      expect(screen.getByText('5.4')).toBeInTheDocument()
      expect(screen.getByText('5.3')).toBeInTheDocument()
      expect(screen.getByText('1.068')).toBeInTheDocument()
    })

    it('shows "—" for empty parameter values', () => {
      setup(makeData([makeStep()]))
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(5)
    })

    it('pencil button opens the edit mash parameters dialog', async () => {
      const user = userEvent.setup()
      setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit mash parameters/i }))
      expect(screen.getByRole('heading', { name: /edit mash parameters/i })).toBeInTheDocument()
    })

    it('cancelling the params dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep()]))
      await user.click(screen.getByRole('button', { name: /edit mash parameters/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('saving the params dialog calls onChange with updated mashWater', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeData([makeStep()]))

      await user.click(screen.getByRole('button', { name: /edit mash parameters/i }))

      fireEvent.change(screen.getByLabelText(/mash water/i), { target: { value: '25' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: MashInfo = onChange.mock.calls[0][0]
      expect(saved.mashWater).toBe(25)
    })
  })
})
