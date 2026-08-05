-- Add is_pinned column to notes for pin/favorite functionality
ALTER TABLE notes ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(vault_id, is_pinned DESC, updated_at DESC);
