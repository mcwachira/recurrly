import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate loading auth state
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign-in - accept any email/password with basic validation
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }
    
    if (!email.includes('@')) {
      return { error: { message: 'Invalid email format' } };
    }
    
    if (password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters' } };
    }

    const mockUser: User = {
      id: 'user_' + Date.now(),
      email,
    };

    setUser(mockUser);
    setIsSignedIn(true);
    return {};
  };

  const signUp = async (email: string, password: string) => {
    // Mock sign-up - same logic as sign-in for development
    return signIn(email, password);
  };

  const signOut = async () => {
    setUser(null);
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Mock hooks that mimic Clerk's API
export function useSignIn() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message?: string } | null>(null);

  const password = async ({ emailAddress, password }: { emailAddress: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn(emailAddress, password);
      if (result.error) {
        setError(result.error);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn: { password, status: 'complete' as const, supportedSecondFactors: [], mfa: { sendEmailCode: async () => {}, verifyEmailCode: async () => {} }, reset: async () => {} },
    errors: { fields: {} },
    fetchStatus: isLoading ? 'fetching' : 'idle',
  };
}

export function useSignUp() {
  const { signUp, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message?: string } | null>(null);

  const password = async ({ emailAddress, password }: { emailAddress: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signUp(emailAddress, password);
      if (result.error) {
        setError(result.error);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp: { 
      password, 
      status: isSignedIn ? 'complete' : 'missing_requirements' as const,
      unverifiedFields: [],
      missingFields: [],
      verifications: {
        sendEmailCode: async () => {},
        verifyEmailCode: async () => {},
      },
      finalize: async (options: any) => {
        if (options?.navigate) {
          options.navigate({ session: null, decorateUrl: (url: string) => url });
        }
      },
    },
    errors: { fields: {} },
    fetchStatus: isLoading ? 'fetching' : 'idle',
  };
}

export function useUser() {
  const { user } = useAuth();
  return { user };
}

export function useClerk() {
  const { signOut } = useAuth();
  return { signOut };
}
