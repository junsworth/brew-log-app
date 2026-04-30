import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PackagingSection } from '../BoilFermentationPackaging'
import type { PackagingInfo } from '@/types/brew'

function makePackaging(overrides: Partial<PackagingInfo> = {}): PackagingInfo {
  return {
    packagingDate: '',
    method: '',
    volumePackaged: '',
    primingSugar: '',
    readyTodrinkDate: '',
    ...overrides,
  }
}

function setup(data: PackagingInfo, onChange = vi.fn()) {
  const utils = render(<PackagingSection data={data} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('PackagingSection', () => {
  describe('render', () => {
    it('shows packaging values as static text on the card', () => {
      setup(makePackaging({
        packagingDate: '2024-03-01',
        method: 'Keg',
        volumePackaged: 19,
        primingSugar: 120,
        readyTodrinkDate: '2024-04-01',
      }))
      expect(screen.getByText('2024-03-01')).toBeInTheDocument()
      expect(screen.getByText('Keg')).toBeInTheDocument()
      expect(screen.getByText('19 L')).toBeInTheDocument()
      expect(screen.getByText('120 g')).toBeInTheDocument()
      expect(screen.getByText('2024-04-01')).toBeInTheDocument()
    })

    it('shows "—" for empty packaging values', () => {
      setup(makePackaging())
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(5)
    })

    it('does not call onChange on initial render', () => {
      const { onChange } = setup(makePackaging())
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('edit dialog', () => {
    it('pencil button opens the edit packaging dialog', async () => {
      const user = userEvent.setup()
      setup(makePackaging())
      await user.click(screen.getByRole('button', { name: /edit packaging/i }))
      expect(screen.getByRole('heading', { name: /edit packaging/i })).toBeInTheDocument()
    })

    it('cancelling the dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makePackaging())
      await user.click(screen.getByRole('button', { name: /edit packaging/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('dialog pre-fills existing packaging date', async () => {
      const user = userEvent.setup()
      setup(makePackaging({ packagingDate: '2024-03-01' }))
      await user.click(screen.getByRole('button', { name: /edit packaging/i }))
      const input = screen.getByLabelText(/packaging date/i) as HTMLInputElement
      expect(input.value).toBe('2024-03-01')
    })

    it('saving the dialog calls onChange with updated volume (number)', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makePackaging())

      await user.click(screen.getByRole('button', { name: /edit packaging/i }))

      fireEvent.change(screen.getByLabelText(/volume packaged/i), { target: { value: '19' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: PackagingInfo = onChange.mock.calls[0][0]
      expect(saved.volumePackaged).toBe(19)
    })

    it('saving the dialog calls onChange with updated priming sugar (number)', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makePackaging())

      await user.click(screen.getByRole('button', { name: /edit packaging/i }))

      fireEvent.change(screen.getByLabelText(/priming sugar/i), { target: { value: '120' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: PackagingInfo = onChange.mock.calls[0][0]
      expect(saved.primingSugar).toBe(120)
    })

    it('saving the dialog calls onChange with updated ready-to-drink date', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makePackaging())

      await user.click(screen.getByRole('button', { name: /edit packaging/i }))

      fireEvent.change(screen.getByLabelText(/ready to drink/i), { target: { value: '2024-04-01' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: PackagingInfo = onChange.mock.calls[0][0]
      expect(saved.readyTodrinkDate).toBe('2024-04-01')
    })
  })
})
