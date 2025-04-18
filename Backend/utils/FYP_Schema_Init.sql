CREATE TABLE mentors (
  mentor_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  availability TEXT,
  skills TEXT
);

CREATE TABLE mentor_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id INT,
  skill VARCHAR(100),
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE mentor_expertise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id INT,
  area_of_expertise VARCHAR(100),
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE mentor_communication_styles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id INT,
  style VARCHAR(100),
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE mentor_languages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id INT,
  language VARCHAR(100),
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);


CREATE TABLE mentor_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id INT,
  day VARCHAR(20),
  time_slot VARCHAR(50),
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  profile_info TEXT,
  mentor_id INT, 
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);


CREATE TABLE student_preferences (
  preference_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  area_of_study VARCHAR(255),
  communication_style VARCHAR(100),
  language VARCHAR(100),
  mentor_rating FLOAT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE student_interests (
  interest_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  interest VARCHAR(100),
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE student_availability (
  availability_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  day VARCHAR(20), 
  time_slot VARCHAR(50), 
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE meetings (
  meeting_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  mentor_id INT,
  timeslot DATETIME,
  status VARCHAR(50),
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE tasks_student (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  mentor_id INT,
  title VARCHAR(255),
  deadline DATE,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status ENUM('Due', 'Completed', 'Overdue'),
  grade DECIMAL(5,2),
  due_date DATE,
  mentor_id INT,
  student_id INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE student_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT,
  filename VARCHAR(255),
  url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE
);

CREATE TABLE appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(16),
  date DATETIME,
  status ENUM('Scheduled', 'Completed', 'Canceled'),
  student_id INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE student_calendar (
  calendar_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32),
  student_id INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE student_event (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(32),
  description VARCHAR(255),
  type VARCHAR(16),
  creation_date DATETIME,
  due_date DATETIME,
  calendar_id INT,
  FOREIGN KEY (calendar_id) REFERENCES student_calendar(calendar_id) ON DELETE CASCADE
);

-- Legal Case Management Tables
CREATE TABLE solicitors (
  solicitor_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  specialty VARCHAR(100),
  availability TEXT,
  experience_years INT
);

CREATE TABLE clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  legal_needs TEXT,
  budget DECIMAL(10, 2)
);

CREATE TABLE cases (
  case_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  solicitor_id INT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_billing DECIMAL(10, 2),
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  title VARCHAR(255),
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

CREATE TABLE documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  filename VARCHAR(255),
  url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

CREATE TABLE messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  sender_id INT,
  recipient_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  content TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

CREATE TABLE calendar (
  calendar_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32),
  solicitor_id INT,
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id) ON DELETE CASCADE
);

CREATE TABLE event (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(32),
  description VARCHAR(255),
  type VARCHAR(16),
  creation_date DATETIME,
  due_date DATETIME,
  calendar_id INT,
  FOREIGN KEY (calendar_id) REFERENCES calendar(calendar_id) ON DELETE CASCADE
);

CREATE TABLE solicitor_cases (
  solicitor_id INT,
  case_id INT,
  PRIMARY KEY (solicitor_id, case_id),
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id) ON DELETE CASCADE,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

CREATE TABLE billing (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  amount_due DECIMAL(10,2),
  amount_paid DECIMAL(10,2),
  billing_status VARCHAR(16),
  billing_date DATE,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

CREATE TABLE notes (
  note_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  note_name VARCHAR(16),
  note_type VARCHAR(16),
  creation_date DATE,
  content TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);


-- Sample data for Students

INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES (1, 'c9cfd40d-4052-4a27-973f-f54f9cc3056a', 'Donna Schneider', 'jillfernandez@daniel.com', 'Weekdays', 'Communication, Time Management');
INSERT INTO mentor_skills (mentor_id, skill) VALUES (1, 'Leadership'), (1, 'Critical Thinking');
INSERT INTO mentor_expertise (mentor_id, area_of_expertise) VALUES (1, 'Computer Science'), (1, 'AI');
INSERT INTO mentor_communication_styles (mentor_id, style) VALUES (1, 'Email'), (1, 'Video Call');
INSERT INTO mentor_languages (mentor_id, language) VALUES (1, 'English'), (1, 'Spanish');
INSERT INTO mentor_availability (mentor_id, day, time_slot) VALUES (1, 'Monday', '09:00-11:00'), (1, 'Wednesday', '14:00-16:00');
INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES (2, '1609c862-0834-423e-b531-22c63208df6e', 'Christopher Joyce', 'james19@gmail.com', 'Weekdays', 'Communication, Time Management');
INSERT INTO mentor_skills (mentor_id, skill) VALUES (2, 'Leadership'), (2, 'Critical Thinking');
INSERT INTO mentor_expertise (mentor_id, area_of_expertise) VALUES (2, 'Computer Science'), (2, 'AI');
INSERT INTO mentor_communication_styles (mentor_id, style) VALUES (2, 'Email'), (2, 'Video Call');
INSERT INTO mentor_languages (mentor_id, language) VALUES (2, 'English'), (2, 'Spanish');
INSERT INTO mentor_availability (mentor_id, day, time_slot) VALUES (2, 'Monday', '09:00-11:00'), (2, 'Wednesday', '14:00-16:00');
INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES (3, 'ff772a83-bcb9-4b06-bc7c-2f473ec5d12d', 'Kevin Lane', 'huffmonica@meyer-ross.biz', 'Weekdays', 'Communication, Time Management');
INSERT INTO mentor_skills (mentor_id, skill) VALUES (3, 'Leadership'), (3, 'Critical Thinking');
INSERT INTO mentor_expertise (mentor_id, area_of_expertise) VALUES (3, 'Computer Science'), (3, 'AI');
INSERT INTO mentor_communication_styles (mentor_id, style) VALUES (3, 'Email'), (3, 'Video Call');
INSERT INTO mentor_languages (mentor_id, language) VALUES (3, 'English'), (3, 'Spanish');
INSERT INTO mentor_availability (mentor_id, day, time_slot) VALUES (3, 'Monday', '09:00-11:00'), (3, 'Wednesday', '14:00-16:00');
INSERT INTO students (student_id, cognito_id, name, email, profile_info, mentor_id) VALUES (1, 'ffe1f81a-a2c0-407d-9a96-6d100b5bbe83', 'Ryan Johnson', 'connieroberts@burgess.com', 'Interested in web development and databases.', 3);
INSERT INTO student_preferences (student_id, area_of_study, communication_style, language, mentor_rating) VALUES (1, 'Software Engineering', 'Video Call', 'English', 4.7);
INSERT INTO student_interests (student_id, interest) VALUES (1, 'Backend Development'), (1, 'Machine Learning');
INSERT INTO student_availability (student_id, day, time_slot) VALUES (1, 'Tuesday', '10:00-12:00'), (1, 'Thursday', '13:00-15:00');
INSERT INTO students (student_id, cognito_id, name, email, profile_info, mentor_id) VALUES (2, '162b8a2a-948c-4567-b0b4-3a514dd683f8', 'Phillip Taylor', 'rodriguezeddie@gmail.com', 'Interested in web development and databases.', 2);
INSERT INTO student_preferences (student_id, area_of_study, communication_style, language, mentor_rating) VALUES (2, 'Software Engineering', 'Video Call', 'English', 4.8);
INSERT INTO student_interests (student_id, interest) VALUES (2, 'Backend Development'), (2, 'Machine Learning');
INSERT INTO student_availability (student_id, day, time_slot) VALUES (2, 'Tuesday', '10:00-12:00'), (2, 'Thursday', '13:00-15:00');
INSERT INTO students (student_id, cognito_id, name, email, profile_info, mentor_id) VALUES (3, '2a1396f6-df2b-4dcc-86d8-67eebe3977e3', 'Rebecca Thomas', 'erinhenry@schultz.com', 'Interested in web development and databases.', 1);
INSERT INTO student_preferences (student_id, area_of_study, communication_style, language, mentor_rating) VALUES (3, 'Software Engineering', 'Video Call', 'English', 4.4);
INSERT INTO student_interests (student_id, interest) VALUES (3, 'Backend Development'), (3, 'Machine Learning');
INSERT INTO student_availability (student_id, day, time_slot) VALUES (3, 'Tuesday', '10:00-12:00'), (3, 'Thursday', '13:00-15:00');
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (1, 'Assignment 1', 'Complete this task.', 'Due', 64.36, '2025-05-21', 1, 1);
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (1, 1, 1, 'Task 1', '2025-05-11', FALSE);
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (2, 'Assignment 2', 'Complete this task.', 'Due', 63.21, '2025-05-22', 2, 2);
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (2, 2, 2, 'Task 2', '2025-05-12', FALSE);
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (3, 'Assignment 3', 'Complete this task.', 'Due', 61.89, '2025-05-23', 3, 3);
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (3, 3, 3, 'Task 3', '2025-05-13', FALSE);
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (1, 1, 1, '2025-05-11 10:00:00', 'Scheduled');
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (2, 2, 2, '2025-05-12 10:00:00', 'Scheduled');
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (3, 3, 3, '2025-05-13 10:00:00', 'Scheduled');
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (1, 'Consult', '2025-05-21 15:00:00', 'Scheduled', 1);
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (2, 'Consult', '2025-05-22 15:00:00', 'Scheduled', 2);
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (3, 'Consult', '2025-05-23 15:00:00', 'Scheduled', 3);
INSERT INTO student_documents (assignment_id, filename, url) VALUES (1, 'assignment_1.pdf', 'https://example.com/docs/assignment_1.pdf');
INSERT INTO student_documents (assignment_id, filename, url) VALUES (2, 'assignment_2.pdf', 'https://example.com/docs/assignment_2.pdf');
INSERT INTO student_documents (assignment_id, filename, url) VALUES (3, 'assignment_3.pdf', 'https://example.com/docs/assignment_3.pdf');


-- Sample data for solicitors 

INSERT INTO solicitors (cognito_id, name, email, password, specialty, availability, experience_years) VALUES
('s1-abc', 'Alice Lawman', 'alice@example.com', 'hashedpassword1', 'Family Law', 'Weekdays 9-5', 5),
('s2-def', 'Bob Counsel', 'bob@example.com', 'hashedpassword2', 'Criminal Law', 'Weekends 10-4', 8);


INSERT INTO clients (cognito_id, name, email, password, legal_needs, budget) VALUES
('c1-xyz', 'Charlie Client', 'charlie@example.com', 'hashedpassword3', 'Divorce', 3000.00),
('c2-uvw', 'Dana Client', 'dana@example.com', 'hashedpassword4', 'Business Contract', 5000.00);


INSERT INTO cases (client_id, solicitor_id, status, total_billing) VALUES
(1, 1, 'Open', 0.00),
(2, 2, 'Pending', 1200.00);

INSERT INTO tasks (case_id, title, due_date, completed) VALUES
(1, 'Initial Consultation', '2025-04-20', FALSE),
(2, 'Prepare Documents', '2025-04-25', FALSE);


INSERT INTO documents (case_id, filename, url) VALUES
(1, 'contract.pdf', 'https://example.com/files/contract.pdf'),
(2, 'evidence.zip', 'https://example.com/files/evidence.zip');

INSERT INTO messages (case_id, sender_id, recipient_id, content) VALUES
(1, 1, 1, 'Hello, please review the case details.'),
(2, 2, 2, 'Documents are ready for submission.');


INSERT INTO calendar (name, solicitor_id) VALUES
('Alice Schedule', 1),
('Bob Schedule', 2);


INSERT INTO event (title, description, type, creation_date, due_date, calendar_id) VALUES
('Court Date', 'Preliminary hearing', 'court', NOW(), '2025-04-28 10:00:00', 1),
('Meeting', 'Client check-in', 'meeting', NOW(), '2025-04-30 14:00:00', 2);


INSERT INTO solicitor_cases (solicitor_id, case_id) VALUES
(1, 1),
(2, 2);


INSERT INTO billing (case_id, amount_due, amount_paid, billing_status, billing_date) VALUES
(1, 500.00, 0.00, 'unpaid', '2025-04-16'),
(2, 1200.00, 1200.00, 'paid', '2025-04-10');


INSERT INTO notes (case_id, note_name, note_type, creation_date, content) VALUES
(1, 'Client Overview', 'summary', '2025-04-15', 'Client needs urgent legal help.'),
(2, 'Case Strategy', 'strategy', '2025-04-16', 'Plan to settle before trial.');


-- MY test data Stduent

-- INSERT INTO meetings (student_id, mentor_id, timeslot, status)
-- VALUES
-- (6, 1, '2025-04-18 10:00:00', 'confirmed'),
-- (6, 2, '2025-04-20 14:00:00', 'pending');


-- INSERT INTO tasks_student (student_id, mentor_id, title, deadline, completed)
-- VALUES
-- (6, 1, 'Write project outline', '2025-04-22', FALSE),
-- (6, 1, 'Submit draft', '2025-04-25', FALSE);


-- INSERT INTO assignments (title, description, status, grade, due_date, mentor_id, student_id)
-- VALUES
-- ('Database Assignment', 'Design a relational schema', 'pending', NULL, '2025-04-28', 1, 6),
-- ('Security Report', 'Write report on OWASP top 10', 'submitted', 80, '2025-04-30', 2, 6);


-- INSERT INTO student_documents (assignment_id, filename, url, uploaded_at)
-- VALUES
-- (1, 'db_assignment.pdf', 'https://example.com/files/db_assignment.pdf', NOW()),
-- (2, 'security_report.docx', 'https://example.com/files/security_report.docx', NOW());


-- INSERT INTO student_calendar (name, student_id)
-- VALUES
-- ('Semester Calendar', 6);


-- INSERT INTO student_event (title, description, type, creation_date, due_date, calendar_id)
-- VALUES
-- ('Assignment Deadline', 'Database assignment due', 'deadline', NOW(), '2025-04-28 23:59:59', 1),
-- ('Mentor Check-in', 'Progress meeting with mentor', 'meeting', NOW(), '2025-04-19 15:00:00', 1);



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


-- SET FOREIGN_KEY_CHECKS = 0;

-- DROP TABLE IF EXISTS
--   notes,
--   billing,
--   solicitor_cases,
--   event,
--   calendar,
--   messages,
--   documents,
--   tasks,
--   cases,
--   clients,
--   solicitors,
--   student_event,
--   student_calendar,
--   appointments,
--   student_documents,
--   assignments,
--   tasks_student,
--   meetings,
--   mentors,
--   students;

-- SET FOREIGN_KEY_CHECKS = 1;
