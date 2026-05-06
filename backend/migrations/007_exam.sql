CREATE TABLE IF NOT EXISTS exam_questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question_no INTEGER NOT NULL UNIQUE,
  text        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exam_options (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  label       TEXT NOT NULL,
  text        TEXT NOT NULL,
  is_correct  INTEGER NOT NULL DEFAULT 0 CHECK (is_correct IN (0, 1)),
  FOREIGN KEY (question_id) REFERENCES exam_questions(id)
);

CREATE TABLE IF NOT EXISTS exam_results (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tester_name TEXT NOT NULL,
  score       INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO exam_questions (id, question_no, text) VALUES
(1, 1, 'Which status means a request is waiting for approval?'),
(2, 2, 'Which HTTP method is used to create a new record?'),
(3, 3, 'Which database is used by this project?');

INSERT OR IGNORE INTO exam_options (id, question_id, label, text, is_correct) VALUES
(1, 1, 'A', 'PENDING', 1),
(2, 1, 'B', 'APPROVED', 0),
(3, 1, 'C', 'REJECTED', 0),
(4, 2, 'A', 'GET', 0),
(5, 2, 'B', 'POST', 1),
(6, 2, 'C', 'PATCH', 0),
(7, 3, 'A', 'SQLite', 1),
(8, 3, 'B', 'PostgreSQL', 0),
(9, 3, 'C', 'MongoDB', 0);
