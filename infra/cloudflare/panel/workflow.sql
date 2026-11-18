CREATE TABLE IF NOT EXISTS contact_request_workflow (
 request_id TEXT PRIMARY KEY NOT NULL REFERENCES contact_requests(request_id),
 assignee TEXT NOT NULL DEFAULT '',
 callback_at TEXT NOT NULL DEFAULT '',
 appointment_at TEXT NOT NULL DEFAULT '',
 professional TEXT NOT NULL DEFAULT '',
 version INTEGER NOT NULL DEFAULT 1,
 updated_by TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS contact_workflow_events (
 event_id TEXT PRIMARY KEY NOT NULL,
 request_id TEXT NOT NULL REFERENCES contact_requests(request_id),
 actor TEXT NOT NULL,
 version INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
