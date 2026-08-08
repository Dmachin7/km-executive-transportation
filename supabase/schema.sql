-- =============================================================================
-- KM Executive Transportation — full schema
-- Run in Supabase Dashboard → SQL Editor → New query.
-- Re-runnable: CREATE TABLE IF NOT EXISTS; DROP POLICY IF EXISTS.
-- =============================================================================

-- =============================================================================
-- 1. profiles
-- =============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id                uuid REFERENCES auth.users(id) PRIMARY KEY,
  email             text NOT NULL,
  full_name         text,
  phone             text,
  account_type      text NOT NULL DEFAULT 'personal'
                      CHECK (account_type IN ('personal', 'business', 'admin')),
  company_name      text,
  company_verified  boolean NOT NULL DEFAULT false,
  date_of_birth     date,
  stripe_customer_id text,

  -- Business account verification (manual admin approval before the
  -- business discount activates)
  business_verified boolean NOT NULL DEFAULT false,
  -- NOTE: stored as plain text for now — encrypt at rest via Supabase
  -- Vault before production launch.
  business_ein      text,
  verification_submitted_at timestamptz,
  verification_approved_at  timestamptz,
  verification_notes        text,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. saved_addresses
-- =============================================================================
CREATE TABLE IF NOT EXISTS saved_addresses (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  label       text,
  address     text NOT NULL,
  place_id    text,
  lat         numeric(10,7),
  lng         numeric(10,7),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 3. bookings
-- =============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number  text UNIQUE NOT NULL,
  profile_id      uuid REFERENCES profiles(id),

  -- Customer info
  customer_name   text NOT NULL,
  customer_email  text NOT NULL,
  customer_phone  text NOT NULL,

  -- Trip details
  service_type    text NOT NULL
                    CHECK (service_type IN ('everyday', 'airport', 'long_distance', 'chauffeur', 'event')),
  pickup_address  text NOT NULL,
  pickup_lat      numeric(10,7),
  pickup_lng      numeric(10,7),
  dropoff_address text,
  dropoff_lat     numeric(10,7),
  dropoff_lng     numeric(10,7),
  pickup_datetime timestamptz NOT NULL,
  distance_miles  numeric(8,2),
  hours_requested numeric(4,1),
  is_round_trip   boolean NOT NULL DEFAULT false,
  is_cash_payment boolean NOT NULL DEFAULT false,
  special_requests text,
  passenger_count integer NOT NULL DEFAULT 1,

  -- Add-ons
  addon_meet_greet boolean NOT NULL DEFAULT false,
  addon_late_night boolean NOT NULL DEFAULT false,
  addon_extra_stop boolean NOT NULL DEFAULT false,
  gratuity_pct     numeric(4,1) NOT NULL DEFAULT 0,

  -- Pricing
  base_price          numeric(10,2) NOT NULL,
  addon_total          numeric(10,2) NOT NULL DEFAULT 0,
  round_trip_discount  numeric(10,2) NOT NULL DEFAULT 0,
  loyalty_discount     numeric(10,2) NOT NULL DEFAULT 0,
  gratuity_amount      numeric(10,2) NOT NULL DEFAULT 0,
  total_price          numeric(10,2) NOT NULL,

  -- Payment
  payment_type    text NOT NULL DEFAULT 'full'
                    CHECK (payment_type IN ('full', 'deposit')),
  deposit_amount  numeric(10,2),
  amount_paid     numeric(10,2) NOT NULL DEFAULT 0,
  balance_due     numeric(10,2),

  -- Stripe
  -- All PaymentIntents use automatic capture (no manual capture step).
  -- deposit_payment_intent_id holds the initial charge — whether the
  -- booking is paid in full or as a deposit. balance_payment_intent_id is
  -- only set for deposit bookings, once the remaining balance is charged.
  stripe_customer_id        text,
  saved_payment_method_id   text,
  deposit_payment_intent_id text,
  balance_payment_intent_id text,
  deposit_paid_at           timestamptz,
  balance_charged_at        timestamptz,

  -- Status
  status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status  text NOT NULL DEFAULT 'unpaid'
                    CHECK (payment_status IN ('unpaid', 'deposit_paid', 'paid_in_full', 'refunded', 'failed')),

  admin_notes     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Auto booking number trigger
-- NOTE: COUNT(*)-based numbering is what was specified, but it is not
-- collision-safe under concurrent inserts (two simultaneous bookings
-- can compute the same count). Flagging here — swap for a sequence
-- (e.g. `bookings_number_seq`) if concurrent bookings become a real risk.
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_number := 'KM-' ||
    TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD(CAST(
      (SELECT COUNT(*) + 1 FROM bookings)
    AS TEXT), 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_number ON bookings;
CREATE TRIGGER set_booking_number
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_number();

-- =============================================================================
-- 4. distance_cache
-- =============================================================================
CREATE TABLE IF NOT EXISTS distance_cache (
  id                      uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  origin_normalized       text NOT NULL,
  destination_normalized  text NOT NULL,
  distance_miles          numeric(8,2),
  duration_minutes        integer,
  cached_at               timestamptz NOT NULL DEFAULT now(),
  UNIQUE(origin_normalized, destination_normalized)
);

ALTER TABLE distance_cache ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. Admin check helper
-- =============================================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT account_type = 'admin'
  FROM profiles
  WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================================================
-- 6. RLS policies
-- =============================================================================

-- profiles: own record only, admin sees all
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON profiles;
CREATE POLICY "profiles_update_own_or_admin" ON profiles
  FOR UPDATE USING (id = auth.uid() OR is_admin());

-- saved_addresses: own records only
DROP POLICY IF EXISTS "saved_addresses_own" ON saved_addresses;
CREATE POLICY "saved_addresses_own" ON saved_addresses
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- bookings: own bookings only (by profile_id OR customer_email matching
-- auth user), admin sees all
DROP POLICY IF EXISTS "bookings_select_own_or_admin" ON bookings;
CREATE POLICY "bookings_select_own_or_admin" ON bookings
  FOR SELECT USING (
    profile_id = auth.uid()
    OR customer_email = auth.jwt() ->> 'email'
    OR is_admin()
  );

-- Public/guest booking creation happens via the service-role key from the
-- /api/bookings route (never the anon key directly), so no anon INSERT
-- policy is defined here — authenticated users may still self-insert.
DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
CREATE POLICY "bookings_insert_own" ON bookings
  FOR INSERT WITH CHECK (
    profile_id = auth.uid()
    OR customer_email = auth.jwt() ->> 'email'
    OR is_admin()
  );

DROP POLICY IF EXISTS "bookings_update_admin_only" ON bookings;
CREATE POLICY "bookings_update_admin_only" ON bookings
  FOR UPDATE USING (is_admin());

-- distance_cache: read-only for authenticated users, writes via service role
DROP POLICY IF EXISTS "distance_cache_read_authenticated" ON distance_cache;
CREATE POLICY "distance_cache_read_authenticated" ON distance_cache
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================================
-- 7. Grants
-- =============================================================================
-- Some Supabase projects don't pre-grant table privileges to anon/
-- authenticated/service_role by default — without this, every query fails
-- with "permission denied for table X" before RLS is even evaluated.
-- service_role has BYPASSRLS at the role level, but still needs the base
-- table grant to read/write at all.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
