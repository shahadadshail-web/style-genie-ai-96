import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle, needsOnboarding } = useAuth();

  // Get the intended destination or default to home
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      if (needsOnboarding) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, authLoading, needsOnboarding, navigate, from]);

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-auth-background via-[hsl(270,25%,10%)] to-[hsl(280,30%,8%)]">
        <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  // Don't render auth form if already logged in (we're about to redirect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-auth-background via-[hsl(270,25%,10%)] to-[hsl(280,30%,8%)]">
        <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(signInError.message);
          }
        } else {
          navigate('/composer');
        }
      } else {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          navigate('/onboarding');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-auth-background via-[hsl(270,25%,10%)] to-[hsl(280,30%,8%)]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-blue/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-purple-glow mb-4 shadow-[0_0_30px_rgba(138,43,226,0.5)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-serif">
            Style Genie
          </h1>
          <p className="text-sky-blue text-sm">
            Your AI-powered fashion companion
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-auth-card/80 backdrop-blur-xl rounded-2xl p-8 border border-neon-purple/20 shadow-[0_0_40px_rgba(138,43,226,0.15)]">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center font-serif">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 h-12 bg-transparent border-sky-blue/50 text-white hover:bg-sky-blue/10 hover:border-sky-blue transition-all duration-300 group"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="group-hover:text-sky-blue transition-colors">
              Continue with Google
            </span>
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-auth-card text-white/50">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-neon-purple focus:ring-neon-purple/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-neon-purple focus:ring-neon-purple/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sky-blue text-sm text-center bg-sky-blue/10 rounded-lg py-2 px-4 border border-sky-blue/20">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-purple-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(138,43,226,0.6)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <p className="mt-6 text-center text-white/60 text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sky-blue hover:text-sky-blue-glow font-medium transition-colors hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-white/30 text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
