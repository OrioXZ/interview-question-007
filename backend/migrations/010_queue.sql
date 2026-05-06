CREATE TABLE IF NOT EXISTS queue_state (
  id             INTEGER PRIMARY KEY CHECK (id = 1),
  current_number TEXT NOT NULL DEFAULT '00',
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO queue_state (id, current_number) VALUES (1, '00');

CREATE TRIGGER IF NOT EXISTS trg_queue_state_updated_at
AFTER UPDATE ON queue_state
FOR EACH ROW
BEGIN
  UPDATE queue_state
  SET updated_at = datetime('now')
  WHERE id = NEW.id;
END;
