import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WaterProfileSection } from '../MashSection'
import type { WaterProfile } from '@/types/brew'

function makeProfile(overrides: Partial<WaterProfile> = {}): WaterProfile {
  return {
    calcium: '',
    magnesium: '',
    sodium: '',
    chloride: '',
    sulfate: '',
    bicarbonate: '',
    profileName: '',
    ...overrides,
  }
}

function setup(data: WaterProfile, onChange = vi.fn()) {
  const utils = render(<WaterProfileSection data={data} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('WaterProfileSection', () => {
  describe('render', () => {
    it('shows the profile name as the card title when set', () => {
      setup(makeProfile({ profileName: 'London Hard Water' }))
      expect(screen.getByText('London Hard Water')).toBeInTheDocument()
    })

    it('shows fallback italic text when profile name is empty', () => {
      setup(makeProfile())
      expect(screen.getByText('No profile name')).toBeInTheDocument()
    })

    it('shows ion values on the card', () => {
      setup(makeProfile({ calcium: 100, magnesium: 5, sodium: 15, chloride: 57, sulfate: 97, bicarbonate: 145 }))
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('97')).toBeInTheDocument()
    })

    it('shows "—" for empty ion values', () => {
      setup(makeProfile())
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(6)
    })

    it('does not call onChange on initial render', () => {
      const { onChange } = setup(makeProfile())
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('edit dialog', () => {
    it('pencil button opens the edit water profile dialog', async () => {
      const user = userEvent.setup()
      setup(makeProfile())
      await user.click(screen.getByRole('button', { name: /edit water profile/i }))
      expect(screen.getByRole('heading', { name: /edit water profile/i })).toBeInTheDocument()
    })

    it('cancelling the dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeProfile())
      await user.click(screen.getByRole('button', { name: /edit water profile/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('dialog pre-fills existing ion values', async () => {
      const user = userEvent.setup()
      setup(makeProfile({ calcium: 100 }))
      await user.click(screen.getByRole('button', { name: /edit water profile/i }))
      const input = screen.getByLabelText(/ca \(ppm\)/i) as HTMLInputElement
      expect(input.value).toBe('100')
    })

    it('saving the dialog calls onChange with updated calcium', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeProfile())

      await user.click(screen.getByRole('button', { name: /edit water profile/i }))

      fireEvent.change(screen.getByLabelText(/ca \(ppm\)/i), { target: { value: '75' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: WaterProfile = onChange.mock.calls[0][0]
      expect(saved.calcium).toBe(75)
    })

    it('saving the dialog calls onChange with updated profile name', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeProfile())

      await user.click(screen.getByRole('button', { name: /edit water profile/i }))

      fireEvent.change(screen.getByLabelText(/profile name/i), {
        target: { value: 'Dublin' },
      })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: WaterProfile = onChange.mock.calls[0][0]
      expect(saved.profileName).toBe('Dublin')
    })
  })
})
