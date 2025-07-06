// __tests__/context/AuthContext.test.tsx
import React, { ReactNode } from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";

// Define inline AuthContextType for testing to avoid import issues
interface AuthContextType {
  user: {
    id: string;
    username: string;
    [key: string]: any;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | string | null;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  [key: string]: any;
}

// Helper function to safely extract error message
function getErrorMessage(error: Error | string | null): string {
  if (error === null) return '';
  if (typeof error === 'string') return error;
  return error.message || 'Unknown error';
}
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth"; // Import Amplify functions

// Mock the Amplify Auth functions
jest.mock("aws-amplify/auth", () => ({
  getCurrentUser: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock the Amplify core configure (if needed, though context doesn't call it directly)
jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

// Helper component to consume the context
const TestConsumer = () => {
  // Update this line to match your actual AuthContext interface
  const { user, isLoading, error, signIn: login, signOut: logout } = useAuth() as AuthContextType;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Use the helper function to safely get error message
  if (error) {
    return <div>Error: {getErrorMessage(error)}</div>;
  }
  

  return (
    <div>
      {user ? (
        <div>
          <span data-testid="user-id">{user.id}</span>
          <span data-testid="username">{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <span>No user logged in</span>
          <button onClick={() => login("testuser", "password")}>Login</button>
        </div>
      )}
    </div>
  );
};

// Wrapper component for rendering with provider
const renderWithAuthProvider = (ui: ReactNode) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("AuthContext", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state initially and then no user", async () => {
    // Mock getCurrentUser to return no user after a delay
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(null);

    renderWithAuthProvider(<TestConsumer />);

    // Initially shows loading
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Shows no user state
    expect(screen.getByText("No user logged in")).toBeInTheDocument();
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it("should fetch and display user on initial load if authenticated", async () => {
    const mockUser = { userId: "user-123", username: "testuser" };
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);

    renderWithAuthProvider(<TestConsumer />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
    });

    expect(screen.getByTestId("username")).toHaveTextContent("testuser");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it("should handle error during initial user fetch", async () => {
    const errorMessage = "Failed to fetch user";
    (getCurrentUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    renderWithAuthProvider(<TestConsumer />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for error state
    await waitFor(() => {
      const errorElement = screen.getByText(/Error:/);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toContain(errorMessage);
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it("should call signIn and update user state on login button click", async () => {
    const mockSignedInUser = { isSignedIn: true, nextStep: { signInStep: 'DONE' } }; // Simplified mock response
    const mockUserAfterSignIn = { userId: "signed-in-user", username: "testuser" };
    
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(null); // Start as logged out
    (signIn as jest.Mock).mockResolvedValueOnce(mockSignedInUser);
    // Mock getCurrentUser again for the check after successful sign in
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUserAfterSignIn);

    renderWithAuthProvider(<TestConsumer />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("No user logged in")).toBeInTheDocument();
    });

    // Click login button
    const loginButton = screen.getByRole("button", { name: /login/i });
    await act(async () => {
      await userEvent.click(loginButton);
    });

    // Check if signIn was called
    expect(signIn).toHaveBeenCalledWith({ username: "testuser", password: "password" });
    expect(signIn).toHaveBeenCalledTimes(1);

    // Wait for user state to update after sign in
    await waitFor(() => {
        expect(screen.getByTestId("user-id")).toHaveTextContent("signed-in-user");
    });
    expect(screen.getByTestId("username")).toHaveTextContent("testuser");
    // getCurrentUser is called once initially, and once after successful sign-in
    expect(getCurrentUser).toHaveBeenCalledTimes(2); 
  });

  it("should call signOut and update user state on logout button click", async () => {
    const mockUser = { userId: "user-123", username: "testuser" };
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser); // Start as logged in
    (signOut as jest.Mock).mockResolvedValueOnce(undefined); // Mock signOut

    renderWithAuthProvider(<TestConsumer />);

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId("user-id")).toHaveTextContent("user-123");
    });

    // Click logout button
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await act(async () => {
      await userEvent.click(logoutButton);
    });

    // Check if signOut was called
    expect(signOut).toHaveBeenCalledTimes(1);

    // Wait for user state to update (become logged out)
    await waitFor(() => {
      expect(screen.getByText("No user logged in")).toBeInTheDocument();
    });
    // getCurrentUser called once initially
    expect(getCurrentUser).toHaveBeenCalledTimes(1); 
  });

  it("should handle signIn error", async () => {
    const signInErrorMessage = "Incorrect username or password.";
    (getCurrentUser as jest.Mock).mockResolvedValueOnce(null); // Start logged out
    (signIn as jest.Mock).mockRejectedValueOnce(new Error(signInErrorMessage));

    renderWithAuthProvider(<TestConsumer />);

    await waitFor(() => {
      expect(screen.getByText("No user logged in")).toBeInTheDocument();
    });

    const loginButton = screen.getByRole("button", { name: /login/i });
    await act(async () => {
      await userEvent.click(loginButton);
    });

    // Wait for error state to be displayed
    await waitFor(() => {
      const errorElement = screen.getByText(/Error:/);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toContain(signInErrorMessage);
    });

    expect(signIn).toHaveBeenCalledTimes(1);
    // User should still be logged out
    expect(screen.queryByTestId("user-id")).not.toBeInTheDocument();
  });
});