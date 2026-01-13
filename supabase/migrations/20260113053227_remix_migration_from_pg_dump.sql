CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: clothing_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.clothing_category AS ENUM (
    'Upper Body',
    'Lower Body',
    'Shoes',
    'Accessories'
);


SET default_table_access_method = heap;

--
-- Name: clothes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clothes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    category public.clothing_category NOT NULL,
    sub_category text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    colors text[] DEFAULT '{}'::text[],
    materials text[] DEFAULT '{}'::text[],
    styles text[] DEFAULT '{}'::text[]
);


--
-- Name: saved_outfits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_outfits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    upper_body_id uuid NOT NULL,
    lower_body_id uuid NOT NULL,
    shoes_id uuid NOT NULL,
    event text,
    time_of_day text,
    season text,
    ai_reasoning text,
    style_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: clothes clothes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clothes
    ADD CONSTRAINT clothes_pkey PRIMARY KEY (id);


--
-- Name: saved_outfits saved_outfits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_outfits
    ADD CONSTRAINT saved_outfits_pkey PRIMARY KEY (id);


--
-- Name: idx_saved_outfits_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_outfits_created_at ON public.saved_outfits USING btree (created_at DESC);


--
-- Name: saved_outfits saved_outfits_lower_body_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_outfits
    ADD CONSTRAINT saved_outfits_lower_body_id_fkey FOREIGN KEY (lower_body_id) REFERENCES public.clothes(id) ON DELETE CASCADE;


--
-- Name: saved_outfits saved_outfits_shoes_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_outfits
    ADD CONSTRAINT saved_outfits_shoes_id_fkey FOREIGN KEY (shoes_id) REFERENCES public.clothes(id) ON DELETE CASCADE;


--
-- Name: saved_outfits saved_outfits_upper_body_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_outfits
    ADD CONSTRAINT saved_outfits_upper_body_id_fkey FOREIGN KEY (upper_body_id) REFERENCES public.clothes(id) ON DELETE CASCADE;


--
-- Name: clothes Allow public delete access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete access" ON public.clothes FOR DELETE USING (true);


--
-- Name: saved_outfits Allow public delete access on saved_outfits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete access on saved_outfits" ON public.saved_outfits FOR DELETE USING (true);


--
-- Name: clothes Allow public insert access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert access" ON public.clothes FOR INSERT WITH CHECK (true);


--
-- Name: saved_outfits Allow public insert access on saved_outfits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert access on saved_outfits" ON public.saved_outfits FOR INSERT WITH CHECK (true);


--
-- Name: clothes Allow public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access" ON public.clothes FOR SELECT USING (true);


--
-- Name: saved_outfits Allow public read access on saved_outfits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access on saved_outfits" ON public.saved_outfits FOR SELECT USING (true);


--
-- Name: clothes Allow public update access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update access" ON public.clothes FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: saved_outfits Allow public update access on saved_outfits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update access on saved_outfits" ON public.saved_outfits FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: clothes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clothes ENABLE ROW LEVEL SECURITY;

--
-- Name: saved_outfits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.saved_outfits ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;