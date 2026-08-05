-- Create tags table for note categorization
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  vault_id TEXT NOT NULL DEFAULT 'default',
  name TEXT NOT NULL,
  color TEXT DEFAULT '#07c160',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tags_vault ON tags(vault_id);

-- Create note_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS note_tags (
  note_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (note_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag ON note_tags(tag_id);
