CREATE TABLE IF NOT EXISTS personal_infos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name  TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  age        INTEGER NOT NULL,
  address    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_personal_infos_created_at ON personal_infos(created_at);
