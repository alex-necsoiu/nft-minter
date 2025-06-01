import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MintForm from '@/features/mint/MintForm';

describe('MintForm', () => {
  it('renders the mint form', () => {
    render(<MintForm />);
    expect(screen.getByText(/mint a new nft/i)).toBeInTheDocument();
  });

  beforeEach(() => {
    render(<MintForm />);
  });

  it('renders the form elements', () => {
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mint nft/i })).toBeInTheDocument();
  });

  it('disables the mint button when inputs are empty', () => {
    const mintButton = screen.getByRole('button', { name: /mint nft/i });
    expect(mintButton).toBeDisabled();
  });

  it('enables the mint button when inputs are filled', () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test NFT' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a test NFT' } });
    fireEvent.change(screen.getByLabelText(/upload image/i), { target: { files: [new File(['dummy content'], 'image.png', { type: 'image/png' })] } });

    const mintButton = screen.getByRole('button', { name: /mint nft/i });
    expect(mintButton).toBeEnabled();
  });

  it('shows an error message when the minting fails', async () => {
    // Mock the minting function to simulate an error
    // This would typically involve mocking the service or hook that handles the minting
    // For example, using jest.mock or similar approach

    fireEvent.click(screen.getByRole('button', { name: /mint nft/i }));
    
    // Check for error message in the UI
    expect(await screen.findByText(/minting failed/i)).toBeInTheDocument();
  });
});