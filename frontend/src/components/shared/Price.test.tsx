import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Price } from './Price';

describe('Price', () => {
  it('renders the selling price', () => {
    render(<Price price={999} />);
    expect(screen.getByText('₹999')).toBeInTheDocument();
  });

  it('shows MRP strike-through and discount when MRP is higher', () => {
    render(<Price price={750} mrp={1000} />);
    expect(screen.getByText('₹750')).toBeInTheDocument();
    expect(screen.getByText('₹1,000')).toBeInTheDocument();
    expect(screen.getByText('25% off')).toBeInTheDocument();
  });

  it('hides discount when MRP equals price', () => {
    render(<Price price={500} mrp={500} />);
    expect(screen.queryByText(/off/)).not.toBeInTheDocument();
  });
});
