CREATE TABLE IF NOT EXISTS barcode_products (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  code       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_barcode_products_created_at ON barcode_products(created_at);
