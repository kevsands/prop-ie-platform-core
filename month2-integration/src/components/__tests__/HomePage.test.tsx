import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/components/HomePage';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock data
jest.mock('@/data/mockDevelopments', () => ({
  mockDevelopments: [
    {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      description: 'Premium homes in Dublin',
      location: 'Dublin 15',
      image: '/images/fitzgerald-gardens/hero.jpg',
      status: 'Selling Fast',
      statusColor: 'green',
    },
    {
      id: 'ballymakenny-view',
      name: 'Ballymakenny View',
      description: 'Coastal living in Drogheda',
      location: 'Drogheda',
      image: '/images/ballymakenny-view/hero.jpg',
      status: 'New Phase',
      statusColor: 'blue',
    },
  ],
}));

describe('HomePage Component', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      prefetch: jest.fn(),
    });
  });

  it('renders without crashing', async () => {
    render(<HomePage />);
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Find Your Dream Home in Drogheda')).toBeInTheDocument();
    });
  });

  it('displays the main headline', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Find Your Dream Home in Drogheda')).toBeInTheDocument();
    });
  });

  it('renders the search section', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Find Your New Home')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByLabelText('Price Range')).toBeInTheDocument();
  });

  it('displays featured developments', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Our Communities')).toBeInTheDocument();
      expect(screen.getByText('Fitzgerald Gardens')).toBeInTheDocument();
      expect(screen.getByText('Ballymakenny View')).toBeInTheDocument();
    });
  });

  it('shows call-to-action buttons', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Explore Developments')).toBeInTheDocument();
      expect(screen.getByText('Register Interest')).toBeInTheDocument();
    });
  });

  it('renders user type tabs', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /For Buyers/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /For Investors/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /For Developers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /For Agents/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /For Solicitors/i })).toBeInTheDocument();
  });

  it('renders about section with company stats', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Building Communities, Not Just Homes')).toBeInTheDocument();
    });
    expect(screen.getByText('750+')).toBeInTheDocument();
    expect(screen.getByText('Homes Built')).toBeInTheDocument();
    expect(screen.getByText('97%')).toBeInTheDocument();
    expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<HomePage />);
    // The component shows a loading spinner initially
    expect(screen.getByRole('presentation')).toHaveClass('animate-spin');
  });

  it('handles CTA button clicks', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Explore Developments')).toBeInTheDocument();
    });
    
    const exploreDevelopmentsBtn = screen.getByText('Explore Developments');
    exploreDevelopmentsBtn.click();
    
    expect(mockPush).toHaveBeenCalledWith('/developments');
  });

  it('renders feature sections correctly', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Energy-Efficient Design')).toBeInTheDocument();
    });
    expect(screen.getByText('Smart Home Integration')).toBeInTheDocument();
    expect(screen.getByText('Premium Finishes')).toBeInTheDocument();
    expect(screen.getByText('Community Planning')).toBeInTheDocument();
  });

  it('renders testimonials section', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('What Our Customers Say')).toBeInTheDocument();
    });
    expect(screen.getByText('Emma & John Murphy')).toBeInTheDocument();
    expect(screen.getByText('First-time Buyers')).toBeInTheDocument();
  });

  it('displays news section', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Latest News & Updates')).toBeInTheDocument();
    });
    expect(screen.getByText('New Phase Launch at Fitzgerald Gardens Development')).toBeInTheDocument();
  });
});