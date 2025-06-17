
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ThemeToggle from '@/components/ThemeToggle';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
