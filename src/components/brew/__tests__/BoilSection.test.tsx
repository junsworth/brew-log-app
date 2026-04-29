import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BoilSection } from '../BoilFermentationPackaging'
import type { BoilInfo } from '@/types/brew'

function makeBoil(overrides: Partial<BoilInfo> = {}): BoilInfo {
  return {
    preBoilVolume: '',
    preBoilGravity: '',
    postBoilVolume: '',
    postBoilGravity: '',
    boilOffRate: '',
    ...overrides,
  }
}

function setup(data: BoilInfo, onChange = vi.fn()) {
  const utils = render(<BoilSection data={data} onChange={onChange} />)
  return { ...utils, onChange }
}

describe('BoilSection', () => {
  describe('render', () => {
    it('shows boil values as static text on the card', () => {
      setup(makeBoil({
        preBoilVolume: 25,
        preBoilGravity: '1.048',
        postBoilVolume: 20,
        postBoilGravity: '1.060',
        boilOffRate: 5,
      }))
      expect(screen.getByText('25 L')).toBeInTheDocument()
      expect(screen.getByText('1.048')).toBeInTheDocument()
      expect(screen.getByText('20 L')).toBeInTheDocument()
      expect(screen.getByText('1.060')).toBeInTheDocument()
      expect(screen.getByText('5 L/hr')).toBeInTheDocument()
    })

    it('shows "—" for empty boil values', () => {
      setup(makeBoil())
      const dashes = screen.getAllByText('—')
      expect(dashes.length).toBeGreaterThanOrEqual(5)
    })

    it('does not call onChange on initial render', () => {
      const { onChange } = setup(makeBoil())
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('edit dialog', () => {
    it('pencil button opens the edit boil dialog', async () => {
      const user = userEvent.setup()
      setup(makeBoil())
      await user.click(screen.getByRole('button', { name: /edit boil/i }))
      expect(screen.getByRole('heading', { name: /edit boil/i })).toBeInTheDocument()
    })

    it('cancelling the dialog does not call onChange', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeBoil())
      await user.click(screen.getByRole('button', { name: /edit boil/i }))
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('dialog pre-fills existing values', async () => {
      const user = userEvent.setup()
      setup(makeBoil({ preBoilGravity: '1.048' }))
      await user.click(screen.getByRole('button', { name: /edit boil/i }))
      const input = screen.getByLabelText(/pre-boil gravity/i) as HTMLInputElement
      expect(input.value).toBe('1.048')
    })

    it('saving the dialog calls onChange with updated pre-boil volume', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeBoil())

      await user.click(screen.getByRole('button', { name: /edit boil/i }))

      fireEvent.change(screen.getByLabelText(/pre-boil volume/i), { target: { value: '25' } })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: BoilInfo = onChange.mock.calls[0][0]
      expect(saved.preBoilVolume).toBe(25)
    })

    it('saving the dialog calls onChange with updated post-boil gravity', async () => {
      const user = userEvent.setup()
      const { onChange } = setup(makeBoil())

      await user.click(screen.getByRole('button', { name: /edit boil/i }))

      fireEvent.change(screen.getByLabelText(/post-boil gravity/i), {
        target: { value: '1.060' },
      })

      await user.click(screen.getByRole('button', { name: /^save$/i }))

      expect(onChange).toHaveBeenCalledOnce()
      const saved: BoilInfo = onChange.mock.calls[0][0]
      expect(saved.postBoilGravity).toBe('1.060')
    })
  })
})
