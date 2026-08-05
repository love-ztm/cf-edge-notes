-- Create note_shares table for public sharing links
CREATE TABLE IF NOT EXISTS note_shares (
  token TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  vault_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER DEFAULT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_note_shares_note ON note_shares(note_id);
CREATE INDEX IF NOT EXISTS idx_note_shares_token ON note_shares(token);
