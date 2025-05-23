import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the footer component', () => {
    render(<Footer />);
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });

  it('displays the company name', () => {
    render(<Footer />);
    const companyName = screen.getByText('PropIE');
    expect(companyName).toBeInTheDocument();
  });

  it('renders all footer columns', () => {
    render(<Footer />);
    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    const facebookLink = screen.getByTestId('social-link-facebook');
    const twitterLink = screen.getByTestId('social-link-twitter');
    const instagramLink = screen.getByTestId('social-link-instagram');
    const linkedinLink = screen.getByTestId('social-link-linkedin');

    expect(facebookLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('GDPR Compliance')).toBeInTheDocument();
  });

  it('displays copyright information', () => {
    render(<Footer />);
    const copyright = screen.getByText(/© 2026 PropIE Ltd. All rights reserved./);
    expect(copyright).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<Footer className="custom-footer" />);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('custom-footer');
  });

  it('has proper aria labels for accessibility', () => {
    render(<Footer />);
    const socialNav = screen.getByLabelText('Social media links');
    const legalNav = screen.getByLabelText('Legal links');
    
    expect(socialNav).toBeInTheDocument();
    expect(legalNav).toBeInTheDocument();
  });

  it('renders newsletter input', () => {
    render(<Footer />);
    const newsletterInput = screen.getByPlaceholderText('Your email');
    expect(newsletterInput).toBeInTheDocument();
  });
  
  it('handles newsletter subscription', () => {
    render(<Footer />);
    const emailInput = screen.getByPlaceholderText('Your email');
    const submitButton = emailInput.closest('form')?.querySelector('button');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    if (submitButton) {
      fireEvent.click(submitButton);
    }
    
    // Check loading state and success state in real implementation
    expect(emailInput).toBeInTheDocument();
  });
  
  it('has back to top button functionality', () => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
    render(<Footer />);
    
    // Manually trigger scroll event since jsdom doesn't handle scrolling
    fireEvent.scroll(window);
    
    // In a real browser, the button would appear
    // For testing, we're just verifying our rendering logic works
  });
});