CREATE TABLE fighters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wikidata_qid TEXT UNIQUE NOT NULL,
  wikipedia_title TEXT,
  name TEXT NOT NULL,
  nationality TEXT,
  flag TEXT,
  weight_class TEXT,
  wins INTEGER,
  losses INTEGER,
  draws INTEGER,
  kos INTEGER,
  active INTEGER,
  stance TEXT,
  dob TEXT,
  wba_rank INTEGER,
  wba_weight_class TEXT,
  source_updated_at TEXT NOT NULL,
  parse_status TEXT NOT NULL DEFAULT 'ok'
);

CREATE INDEX idx_fighters_weight_class ON fighters(weight_class);
CREATE INDEX idx_fighters_nationality ON fighters(nationality);
CREATE INDEX idx_fighters_active ON fighters(active);

CREATE VIRTUAL TABLE fighters_fts USING fts5(
  name, nationality, weight_class,
  content='fighters', content_rowid='id'
);

CREATE TRIGGER fighters_ai AFTER INSERT ON fighters BEGIN
  INSERT INTO fighters_fts(rowid, name, nationality, weight_class)
  VALUES (new.id, new.name, new.nationality, new.weight_class);
END;

CREATE TRIGGER fighters_ad AFTER DELETE ON fighters BEGIN
  INSERT INTO fighters_fts(fighters_fts, rowid, name, nationality, weight_class)
  VALUES('delete', old.id, old.name, old.nationality, old.weight_class);
END;

CREATE TRIGGER fighters_au AFTER UPDATE ON fighters BEGIN
  INSERT INTO fighters_fts(fighters_fts, rowid, name, nationality, weight_class)
  VALUES('delete', old.id, old.name, old.nationality, old.weight_class);
  INSERT INTO fighters_fts(rowid, name, nationality, weight_class)
  VALUES (new.id, new.name, new.nationality, new.weight_class);
END;
