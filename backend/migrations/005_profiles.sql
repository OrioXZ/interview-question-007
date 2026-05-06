CREATE TABLE IF NOT EXISTS profiles (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name            TEXT NOT NULL,
  email                TEXT NOT NULL,
  phone                TEXT NOT NULL,
  birth_day            TEXT NOT NULL,
  occupation           TEXT NOT NULL,
  profile_image_base64 TEXT NOT NULL,
  created_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
