CREATE TABLE IF NOT EXISTS reception_staff_photos (
 staff_id TEXT PRIMARY KEY NOT NULL CHECK(staff_id IN ('atendente-1','atendente-2','atendente-3')),
 photo TEXT NOT NULL,
 version INTEGER NOT NULL DEFAULT 1,
 updated_by TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
