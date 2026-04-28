import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CatalogCombobox, type CatalogGroup } from '../CatalogCombobox'

const groups: CatalogGroup[] = [
  {
    label: 'UK Hops',
    items: [
      { value: 'uk-goldings', label: 'East Kent Goldings' },
      { value: 'uk-fuggles', label: 'Fuggles' },
    ],
  },
  {
    label: 'US Hops',
    items: [{ value: 'us-cascade', label: 'Cascade' }],
  },
]

const customOption = { value: 'custom', label: 'Custom hop' }

function setup({
  value = '',
  onValueChange = vi.fn(),
  customOption: custom,
}: {
  value?: string
  onValueChange?: ReturnType<typeof vi.fn>
  customOption?: { value: string; label: string }
} = {}) {
  const result = render(
    <CatalogCombobox
      value={value}
      onValueChange={onValueChange}
      groups={groups}
      customOption={custom}
      placeholder="Select hop..."
    />
  )
  return { ...result, onValueChange }
}

describe('CatalogCombobox', () => {
  it('renders with the placeholder when no value is selected', () => {
    setup()
    expect(screen.getByPlaceholderText('Select hop...')).toBeInTheDocument()
  })

  it('shows the selected item label in the input when a value is provided', () => {
    setup({ value: 'uk-goldings' })
    expect(screen.getByDisplayValue('East Kent Goldings')).toBeInTheDocument()
  })

  describe('dropdown', () => {
    it('shows all groups and items when opened with no query', async () => {
      const user = userEvent.setup()
      setup()
      await user.click(screen.getByRole('combobox'))

      expect(screen.getByText('UK Hops')).toBeInTheDocument()
      expect(screen.getByText('East Kent Goldings')).toBeInTheDocument()
      expect(screen.getByText('Fuggles')).toBeInTheDocument()
      expect(screen.getByText('US Hops')).toBeInTheDocument()
      expect(screen.getByText('Cascade')).toBeInTheDocument()
    })

    it('filters items to those matching the query', async () => {
      const user = userEvent.setup()
      setup()
      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'cascade')

      expect(screen.getByText('Cascade')).toBeInTheDocument()
      expect(screen.queryByText('East Kent Goldings')).not.toBeInTheDocument()
      expect(screen.queryByText('Fuggles')).not.toBeInTheDocument()
    })

    it('hides a group label when all its items are filtered out', async () => {
      const user = userEvent.setup()
      setup()
      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'cascade')

      expect(screen.queryByText('UK Hops')).not.toBeInTheDocument()
      expect(screen.getByText('US Hops')).toBeInTheDocument()
    })

    it('shows no results message when nothing matches', async () => {
      const user = userEvent.setup()
      setup()
      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'zzz')

      expect(screen.getByText('No results found.')).toBeInTheDocument()
    })

    it('calls onValueChange with the item ID string when an item is selected', async () => {
      const user = userEvent.setup()
      const { onValueChange } = setup()
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Cascade'))

      expect(onValueChange).toHaveBeenCalledWith('us-cascade')
    })

    it('shows all items again after the dropdown is closed and reopened', async () => {
      const user = userEvent.setup()
      setup()
      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'cascade')
      await user.keyboard('{Escape}')
      await user.click(input)

      expect(screen.getByText('East Kent Goldings')).toBeInTheDocument()
      expect(screen.getByText('Fuggles')).toBeInTheDocument()
      expect(screen.getByText('Cascade')).toBeInTheDocument()
    })
  })

  describe('custom option', () => {
    it('shows the custom option when no query is entered', async () => {
      const user = userEvent.setup()
      setup({ customOption })
      await user.click(screen.getByRole('combobox'))

      expect(screen.getByText('Custom hop')).toBeInTheDocument()
    })

    it('stays visible regardless of the query', async () => {
      const user = userEvent.setup()
      setup({ customOption })
      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.type(input, 'cascade')

      expect(screen.getByText('Custom hop')).toBeInTheDocument()
    })

    it('calls onValueChange with the custom option ID when selected', async () => {
      const user = userEvent.setup()
      const { onValueChange } = setup({ customOption })
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Custom hop'))

      expect(onValueChange).toHaveBeenCalledWith('custom')
    })
  })
})
