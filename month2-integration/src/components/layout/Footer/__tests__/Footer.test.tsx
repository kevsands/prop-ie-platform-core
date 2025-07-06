import React from 'react';
import { render, screen } from '@testing-library/react';
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

  it('renders newsletter input on mobile', () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    
    render(<Footer />);
    const newsletterInput = screen.getByPlaceholderText('Your email');
    expect(newsletterInput).toBeInTheDocument();
  });
});