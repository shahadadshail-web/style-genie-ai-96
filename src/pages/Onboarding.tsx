import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight, User, Ruler, UserCircle } from 'lucide-react';

const bodyShapes = [
  { id: 'hourglass', label: 'Hourglass', description: 'Balanced shoulders and hips with a defined waist' },
  { id: 'pear', label: 'Pear', description: 'Hips wider than shoulders' },
  { id: 'apple', label: 'Apple', description: 'Broader midsection with slimmer legs' },
  { id: 'rectangle', label: 'Rectangle', description: 'Similar shoulder, waist, and hip measurements' },
  { id: 'inverted-triangle', label: 'Inverted Triangle', description: 'Broader shoulders than hips' },
  { id: 'athletic', label: 'Athletic', description: 'Toned and muscular build' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [bodyShape, setBodyShape] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile, updateProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    // If profile exists and onboarding is completed, redirect to composer
    if (profile?.onboarding_completed) {
      navigate('/composer');
    }
  }, [user, profile, authLoading, navigate]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile({
        age: age ? parseInt(age) : null,
        height_cm: height ? parseInt(height) : null,
        body_shape: bodyShape || null,
        onboarding_completed: true,
      });
      navigate('/composer');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return age && parseInt(age) >= 13 && parseInt(age) <= 120;
      case 2:
        return height && parseInt(height) >= 100 && parseInt(height) <= 250;
      case 3:
        return bodyShape !== '';
      default:
        return false;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-auth-background via-[hsl(270,25%,10%)] to-[hsl(280,30%,8%)]">
        <div className="w-10 h-10 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-auth-background via-[hsl(270,25%,10%)] to-[hsl(280,30%,8%)]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-blue/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-purple-glow mb-4 shadow-[0_0_30px_rgba(138,43,226,0.5)]">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-serif">
            Let's Personalize Your Style
          </h1>
          <p className="text-sky-blue text-sm">
            Help us understand you better for perfect outfit recommendations
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-gradient-to-r from-neon-purple to-neon-purple-glow'
                  : s < step
                  ? 'w-4 bg-neon-purple/50'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Onboarding Card */}
        <div className="bg-auth-card/80 backdrop-blur-xl rounded-2xl p-8 border border-neon-purple/20 shadow-[0_0_40px_rgba(138,43,226,0.15)]">
          {/* Step 1: Age */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neon-purple/20 mb-4">
                  <User className="w-6 h-6 text-neon-purple" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 font-serif">
                  How old are you?
                </h2>
                <p className="text-white/60 text-sm">
                  This helps us recommend age-appropriate styles
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-white/80 text-sm">
                  Your Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="120"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-14 text-center text-2xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-neon-purple focus:ring-neon-purple/50"
                />
              </div>
            </div>
          )}

          {/* Step 2: Height */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neon-purple/20 mb-4">
                  <Ruler className="w-6 h-6 text-neon-purple" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 font-serif">
                  What's your height?
                </h2>
                <p className="text-white/60 text-sm">
                  This helps us suggest proportionally flattering outfits
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-white/80 text-sm">
                  Height in centimeters
                </Label>
                <Input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  placeholder="e.g., 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-14 text-center text-2xl bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-neon-purple focus:ring-neon-purple/50"
                />
                <p className="text-white/40 text-xs text-center">
                  {height && `That's approximately ${Math.round(parseInt(height) / 2.54)}" or ${Math.floor(parseInt(height) / 30.48)}'${Math.round((parseInt(height) % 30.48) / 2.54)}"`}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Body Shape */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neon-purple/20 mb-4">
                  <UserCircle className="w-6 h-6 text-neon-purple" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 font-serif">
                  What's your body shape?
                </h2>
                <p className="text-white/60 text-sm">
                  This helps us recommend the most flattering silhouettes
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {bodyShapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setBodyShape(shape.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 border ${
                      bodyShape === shape.id
                        ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_20px_rgba(138,43,226,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="block font-medium mb-1">{shape.label}</span>
                    <span className="block text-xs text-white/50">{shape.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12 bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 h-12 bg-gradient-to-r from-neon-purple to-neon-purple-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(138,43,226,0.6)] transition-all duration-300 disabled:opacity-50"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={!canProceed() || loading}
                className="flex-1 h-12 bg-gradient-to-r from-neon-purple to-neon-purple-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(138,43,226,0.6)] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Skip Option */}
          <button
            onClick={handleComplete}
            className="w-full mt-4 text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
