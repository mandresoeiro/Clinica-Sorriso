CREATE TABLE IF NOT EXISTS contact_workflow_snapshots (
 event_id TEXT PRIMARY KEY NOT NULL,
 request_id TEXT NOT NULL REFERENCES contact_requests(request_id),
 assignee TEXT NOT NULL,
 callback_at TEXT NOT NULL,
 appointment_at TEXT NOT NULL,
 professional TEXT NOT NULL,
 actor TEXT NOT NULL,
 version INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS contact_workflow_snapshots_request ON contact_workflow_snapshots(request_id,created_at);
CREATE TABLE IF NOT EXISTS reception_staff_photo_visibility (
 staff_id TEXT PRIMARY KEY NOT NULL REFERENCES reception_staff_photos(staff_id),
 hidden INTEGER NOT NULL DEFAULT 0 CHECK(hidden IN (0,1)),
 updated_by TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
