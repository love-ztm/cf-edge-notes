-- Create note_images table for image upload tracking
CREATE TABLE IF NOT EXISTS note_images (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL DEFAULT '',
  vault_id TEXT NOT NULL DEFAULT 'default',
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_note_images_vault ON note_images(vault_id);
CREATE INDEX IF NOT EXISTS idx_note_images_note ON note_images(note_id);
