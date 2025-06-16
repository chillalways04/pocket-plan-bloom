
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Checking for saved user...');
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      console.log('AuthProvider: Found saved user:', savedUser);
      setUser(JSON.parse(savedUser));
    } else {
      console.log('AuthProvider: No saved user found');
    }
    setIsLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthProvider: Starting signup for:', email);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === email);
      
      if (userExists) {
        console.log('AuthProvider: User already exists:', email);
        throw new Error('User already exists');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email
      };

      // Save user to localStorage (simulating database)
      const users = [...existingUsers, { ...newUser, password }];
      localStorage.setItem('users', JSON.stringify(users));
      console.log('AuthProvider: User saved to localStorage:', newUser);
      
      // Set current user
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('AuthProvider: Signup successful for:', email);
      
      return true;
    } catch (error) {
      console.log('AuthProvider: Signup failed:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthProvider: Starting login for:', email);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('AuthProvider: Checking against users:', users.length);
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        console.log('AuthProvider: Invalid credentials for:', email);
        throw new Error('Invalid credentials');
      }

      const user: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('AuthProvider: Login successful for:', email);
      
      return true;
    } catch (error) {
      console.log('AuthProvider: Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  console.log('AuthProvider: Current user state:', user);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
