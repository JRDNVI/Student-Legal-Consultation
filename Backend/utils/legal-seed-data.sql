-- -- Sample data for solicitors 

-- INSERT INTO solicitors (cognito_id, name, email, password, specialty, availability, experience_years) VALUES
-- ('s1-abc', 'Alice Lawman', 'alice@example.com', 'hashedpassword1', 'Family Law', 'Weekdays 9-5', 5),
-- ('s2-def', 'Bob Counsel', 'bob@example.com', 'hashedpassword2', 'Criminal Law', 'Weekends 10-4', 8);


-- INSERT INTO clients (cognito_id, name, email, password, legal_needs, budget) VALUES
-- ('c1-xyz', 'Charlie Client', 'charlie@example.com', 'hashedpassword3', 'Divorce', 3000.00),
-- ('c2-uvw', 'Dana Client', 'dana@example.com', 'hashedpassword4', 'Business Contract', 5000.00);


-- INSERT INTO cases (client_id, solicitor_id, status, total_billing) VALUES
-- (1, 1, 'Open', 0.00),
-- (2, 2, 'Pending', 1200.00);

-- INSERT INTO tasks (case_id, title, due_date, completed) VALUES
-- (1, 'Initial Consultation', '2025-04-20', FALSE),
-- (2, 'Prepare Documents', '2025-04-25', FALSE);


-- INSERT INTO documents (case_id, filename, url) VALUES
-- (1, 'contract.pdf', 'https://example.com/files/contract.pdf'),
-- (2, 'evidence.zip', 'https://example.com/files/evidence.zip');

-- INSERT INTO messages (case_id, sender_id, recipient_id, content) VALUES
-- (1, 1, 1, 'Hello, please review the case details.'),
-- (2, 2, 2, 'Documents are ready for submission.');


-- INSERT INTO calendar (name, solicitor_id) VALUES
-- ('Alice Schedule', 1),
-- ('Bob Schedule', 2);


-- INSERT INTO event (title, description, type, creation_date, due_date, calendar_id) VALUES
-- ('Court Date', 'Preliminary hearing', 'court', NOW(), '2025-04-28 10:00:00', 1),
-- ('Meeting', 'Client check-in', 'meeting', NOW(), '2025-04-30 14:00:00', 2);


-- INSERT INTO solicitor_cases (solicitor_id, case_id) VALUES
-- (1, 1),
-- (2, 2);


-- INSERT INTO billing (case_id, amount_due, amount_paid, billing_status, billing_date) VALUES
-- (1, 500.00, 0.00, 'unpaid', '2025-04-16'),
-- (2, 1200.00, 1200.00, 'paid', '2025-04-10');


-- INSERT INTO notes (case_id, note_name, note_type, creation_date, content) VALUES
-- (1, 'Client Overview', 'summary', '2025-04-15', 'Client needs urgent legal help.'),
-- (2, 'Case Strategy', 'strategy', '2025-04-16', 'Plan to settle before trial.');

-- -- Create a dummy client to associate with the case
-- INSERT INTO clients (cognito_id, name, email, password, legal_needs, budget)
-- VALUES ('client-xyz-3', 'Test Client', 'test.client3@example.com', 'hashedpass', 'Property Dispute', 2000.00);

-- -- Insert a case involving solicitor_id = 3 and the new client (assume client_id = LAST_INSERT_ID())
-- SET @clientId := LAST_INSERT_ID();

-- INSERT INTO cases (client_id, solicitor_id, status, total_billing)
-- VALUES (@clientId, 3, 'Open', 500.00);

-- SET @caseId := LAST_INSERT_ID();

-- -- Insert a calendar for solicitor 3
-- INSERT INTO calendar (name, solicitor_id)
-- VALUES ('Solicitor 3 Calendar', 3);

-- SET @calendarId := LAST_INSERT_ID();

-- -- Insert events for the calendar
-- INSERT INTO event (title, description, type, creation_date, due_date, calendar_id)
-- VALUES 
-- ('Client Meeting', 'Meeting with client about property case', 'meeting', NOW(), '2025-05-05 10:00:00', @calendarId),
-- ('Court Hearing', 'First court appearance', 'court', NOW(), '2025-05-12 09:00:00', @calendarId);

-- -- Insert tasks
-- INSERT INTO tasks (case_id, title, due_date, completed)
-- VALUES 
-- (@caseId, 'Review Case Documents', '2025-04-28', FALSE),
-- (@caseId, 'Draft Legal Argument', '2025-05-01', FALSE);

-- -- Insert documents
-- INSERT INTO documents (case_id, filename, url)
-- VALUES 
-- (@caseId, 'property-dispute-evidence.pdf', 'https://example.com/documents/evidence.pdf'),
-- (@caseId, 'client-statement.docx', 'https://example.com/documents/statement.docx');

-- -- Insert billing entries
-- INSERT INTO billing (case_id, amount_due, amount_paid, billing_status, billing_date)
-- VALUES 
-- (@caseId, 300.00, 150.00, 'partial', '2025-04-26'),
-- (@caseId, 200.00, 0.00, 'unpaid', '2025-05-01');

-- -- Insert notes
-- INSERT INTO notes (case_id, note_name, note_type, creation_date, content)
-- VALUES 
-- (@caseId, 'Initial Interview', 'summary', '2025-04-20', 'Client described issue and expectations.'),
-- (@caseId, 'Court Prep', 'strategy', '2025-04-30', 'Outline legal strategy for court.');

-- -- Insert messages
-- INSERT INTO messages (case_id, sender_id, recipient_id, content)
-- VALUES 
-- (@caseId, 3, @clientId, 'Please review the attached case documents.'),
-- (@caseId, @clientId, 3, 'I’ve reviewed the files and added comments.');