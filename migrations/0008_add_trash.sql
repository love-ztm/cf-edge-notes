-- Add deleted_at column for soft delete (trash/recycle bin)
ALTER TABLE notes ADD COLUMN deleted_at INTEGER DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_trash ON notes(vault_id, deleted_at);
