CREATE TABLE IF NOT EXISTS contact_request_events (
 event_id TEXT PRIMARY KEY NOT NULL,
 request_id TEXT NOT NULL REFERENCES contact_requests(request_id),
 actor TEXT NOT NULL,
 old_status TEXT NOT NULL,
 new_status TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS contact_request_events_request ON contact_request_events(request_id,created_at);
