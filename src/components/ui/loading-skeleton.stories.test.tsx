
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './loading-skeleton.stories';

// Get all stories using composeStories
const { Default, Circle, Rectangle, Multiple, Card } = composeStories(stories);

describe('LoadingSkeleton Stories', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Default skeleton', () => {
    const { container } = render(<Default />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders Circle skeleton', () => {
    const { container } = render(<Circle />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('renders Rectangle skeleton', () => {
    const { container } = render(<Rectangle />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders Multiple skeletons', () => {
    const { container } = render(<Multiple />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('renders Card skeleton layout', () => {
    const { container } = render(<Card />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
