import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BJCPStyleGuide } from '../BJCPStyleGuide'

describe('BJCPStyleGuide', () => {
  it('renders nothing when style is empty', () => {
    const { container } = render(<BJCPStyleGuide style="" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing for an unrecognised style', () => {
    const { container } = render(<BJCPStyleGuide style="99Z. Imaginary Beer" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing for a category header with no vitals', () => {
    const { container } = render(<BJCPStyleGuide style="21. IPA" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing for "27. Historical Beer" which has no fixed ranges', () => {
    const { container } = render(<BJCPStyleGuide style="27. Historical Beer" />)
    expect(container.firstChild).toBeNull()
  })

  describe('when a known style is selected', () => {
    function setup(style = '21A. American IPA') {
      return render(<BJCPStyleGuide style={style} />)
    }

    it('shows the "BJCP Style Ranges" heading', () => {
      setup()
      expect(screen.getByText('BJCP Style Ranges')).toBeInTheDocument()
    })

    it('renders all five stat labels', () => {
      setup()
      expect(screen.getByText('IBU')).toBeInTheDocument()
      expect(screen.getByText('SRM')).toBeInTheDocument()
      expect(screen.getByText('OG')).toBeInTheDocument()
      expect(screen.getByText('FG')).toBeInTheDocument()
      expect(screen.getByText('ABV')).toBeInTheDocument()
    })

    it('renders five range bar elements', () => {
      setup()
      expect(screen.getAllByTestId('range-bar')).toHaveLength(5)
    })

    it('displays the correct min–max values for 21A. American IPA', () => {
      setup('21A. American IPA')
      // IBU 40–70
      expect(screen.getByText('40–70')).toBeInTheDocument()
      // SRM 6–14
      expect(screen.getByText('6–14')).toBeInTheDocument()
      // OG 1.056–1.070
      expect(screen.getByText('1.056–1.070')).toBeInTheDocument()
      // FG 1.008–1.014
      expect(screen.getByText('1.008–1.014')).toBeInTheDocument()
      // ABV 5.5%–7.5%
      expect(screen.getByText('5.5%–7.5%')).toBeInTheDocument()
    })

    it('displays the correct values for a light lager', () => {
      setup('1A. American Light Lager')
      expect(screen.getByText('8–12')).toBeInTheDocument()
      expect(screen.getByText('2–3')).toBeInTheDocument()
      expect(screen.getByText('1.028–1.040')).toBeInTheDocument()
      expect(screen.getByText('0.998–1.008')).toBeInTheDocument()
      expect(screen.getByText('2.8%–4.2%')).toBeInTheDocument()
    })

    it('each range bar has an accessible aria-label', () => {
      setup()
      const bars = screen.getAllByRole('img')
      expect(bars).toHaveLength(5)
      expect(bars[0]).toHaveAttribute('aria-label', expect.stringContaining('IBU'))
    })
  })
})
