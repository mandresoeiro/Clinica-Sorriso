-- Somente dados operacionais. Não contém prontuário nem notas clínicas.
CREATE TABLE IF NOT EXISTS reception_appointments (
 request_id TEXT PRIMARY KEY REFERENCES contact_requests(request_id),
 professional TEXT NOT NULL,
 starts_at TEXT NOT NULL,
 ends_at TEXT NOT NULL,
 duration INTEGER NOT NULL CHECK(duration BETWEEN 5 AND 480),
 status TEXT NOT NULL CHECK(status IN ('confirmed','cancelled')),
 version INTEGER NOT NULL DEFAULT 1,
 updated_by TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS reception_appointments_schedule ON reception_appointments(professional,status,starts_at,ends_at);
CREATE TABLE IF NOT EXISTS reception_appointment_events (
 event_id TEXT PRIMARY KEY,
 request_id TEXT NOT NULL REFERENCES contact_requests(request_id),
 professional TEXT NOT NULL, starts_at TEXT NOT NULL, ends_at TEXT NOT NULL,
 status TEXT NOT NULL, version INTEGER NOT NULL, actor TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER IF NOT EXISTS reception_appointments_insert_conflict BEFORE INSERT ON reception_appointments
WHEN NEW.status='confirmed' AND EXISTS (
 SELECT 1 FROM reception_appointments a WHERE a.request_id!=NEW.request_id AND a.status='confirmed'
 AND (a.professional=NEW.professional OR a.request_id=NEW.request_id)
 AND a.starts_at<NEW.ends_at AND a.ends_at>NEW.starts_at
)
BEGIN SELECT RAISE(ABORT,'appointment_conflict'); END;
CREATE TRIGGER IF NOT EXISTS reception_appointments_update_conflict BEFORE UPDATE ON reception_appointments
WHEN NEW.status='confirmed' AND EXISTS (
 SELECT 1 FROM reception_appointments a WHERE a.request_id!=NEW.request_id AND a.status='confirmed'
 AND a.professional=NEW.professional AND a.starts_at<NEW.ends_at AND a.ends_at>NEW.starts_at
)
BEGIN SELECT RAISE(ABORT,'appointment_conflict'); END;
