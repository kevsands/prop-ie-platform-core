
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './button.stories';

// Get all stories using composeStories
const { Default, Secondary, Destructive, WithLeftIcon, Loading, Disabled } = composeStories(stories);

describe('Button Stories', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Default button', () => {
    render(<Default />);
    expect(screen.getByRole('button')).toHaveTextContent('Button');
  });

  it('renders Secondary button with correct variant', () => {
    render(<Secondary />);
    expect(screen.getByRole('button')).toHaveTextContent('Secondary');
  });

  it('renders Destructive button with correct variant', () => {
    render(<Destructive />);
    expect(screen.getByRole('button')).toHaveTextContent('Destructive');
  });

  it('renders button with left icon', () => {
    render(<WithLeftIcon />);
    expect(screen.getByRole('button')).toHaveTextContent('Email');
  });

  it('renders loading button', () => {
    render(<Loading />);
    expect(screen.getByRole('button')).toHaveTextContent('Loading');
  });

  it('renders disabled button', () => {
    render(<Disabled />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Disabled');
    expect(button).toBeDisabled();
  });
});
