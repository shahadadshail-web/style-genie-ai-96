-- Create profiles table for user authentication
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Add user_id column to clothes table
ALTER TABLE public.clothes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to saved_outfits table
ALTER TABLE public.saved_outfits ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create calendar_outfits table for the lookbook
CREATE TABLE public.calendar_outfits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    scheduled_date DATE NOT NULL,
    upper_body_id UUID REFERENCES public.clothes(id) ON DELETE SET NULL,
    lower_body_id UUID REFERENCES public.clothes(id) ON DELETE SET NULL,
    shoes_id UUID REFERENCES public.clothes(id) ON DELETE SET NULL,
    weather_text TEXT,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, scheduled_date)
);

-- Enable RLS on calendar_outfits
ALTER TABLE public.calendar_outfits ENABLE ROW LEVEL SECURITY;

-- Calendar outfits policies - users can only access their own
CREATE POLICY "Users can view their own calendar outfits"
ON public.calendar_outfits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar outfits"
ON public.calendar_outfits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar outfits"
ON public.calendar_outfits FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar outfits"
ON public.calendar_outfits FOR DELETE
USING (auth.uid() = user_id);

-- Drop existing public policies on clothes and add user-specific ones
DROP POLICY IF EXISTS "Allow public read access" ON public.clothes;
DROP POLICY IF EXISTS "Allow public insert access" ON public.clothes;
DROP POLICY IF EXISTS "Allow public update access" ON public.clothes;
DROP POLICY IF EXISTS "Allow public delete access" ON public.clothes;

CREATE POLICY "Users can view their own clothes"
ON public.clothes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clothes"
ON public.clothes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clothes"
ON public.clothes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clothes"
ON public.clothes FOR DELETE
USING (auth.uid() = user_id);

-- Drop existing public policies on saved_outfits and add user-specific ones
DROP POLICY IF EXISTS "Allow public read access on saved_outfits" ON public.saved_outfits;
DROP POLICY IF EXISTS "Allow public insert access on saved_outfits" ON public.saved_outfits;
DROP POLICY IF EXISTS "Allow public update access on saved_outfits" ON public.saved_outfits;
DROP POLICY IF EXISTS "Allow public delete access on saved_outfits" ON public.saved_outfits;

CREATE POLICY "Users can view their own saved outfits"
ON public.saved_outfits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved outfits"
ON public.saved_outfits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved outfits"
ON public.saved_outfits FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved outfits"
ON public.saved_outfits FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_outfits_updated_at
BEFORE UPDATE ON public.calendar_outfits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();