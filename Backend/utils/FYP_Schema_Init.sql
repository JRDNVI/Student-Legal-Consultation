CREATE TABLE students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  profile_info TEXT
);

CREATE TABLE mentors (
  mentor_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  availability TEXT,
  skills TEXT
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
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
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


INSERT INTO students (student_id, cognito_id, name, email, profile_info) VALUES (1, '9310a452-8919-4d86-8fd6-12035c3c7c30', 'Rhonda Henderson', 'dhunt@yahoo.com', 'Understand assume design my minute get include.
Quality likely contain table.');
INSERT INTO students (student_id, cognito_id, name, email, profile_info) VALUES (2, '1aa3b409-44da-4694-9708-8f9e01395991', 'Melissa Hawkins', 'bmorgan@hotmail.com', 'Best top avoid. Country Congress letter. Probably cell morning bill word.');
INSERT INTO students (student_id, cognito_id, name, email, profile_info) VALUES (3, 'c18f0351-79b7-4b3d-9c34-eddfa5ca66f7', 'Dustin Summers', 'lauratodd@hotmail.com', 'Hotel event hit region. Kid name every never. Guy decade physical.');
INSERT INTO students (student_id, cognito_id, name, email, profile_info) VALUES (4, '30367854-398e-4d39-b749-06677a9f3f07', 'Michelle Smith', 'claire03@gmail.com', 'Offer able support position dinner.');
INSERT INTO students (student_id, cognito_id, name, email, profile_info) VALUES (5, 'd5abbf60-baca-4285-9bad-493bbc4712d5', 'Kevin Anderson', 'chunter@yahoo.com', 'Boy assume physical record before authority. Trouble go somebody.');
INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES (1, '398abfb2-140c-44ec-b449-43da00343e9a', 'Brittney Neal', 'edwardstimothy@adams-adams.com', 'Some issue especially significant.', 'job');
INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES (2, '8b356801-e048-4a52-ba7a-4b079f5d23aa', 'Deanna Roach', 'arichardson@hotmail.com', 'Mean various list carry head. Almost along money.', 'down');
INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES (3, '5d21d2d1-d726-409b-9900-8872ef3c89b6', 'Peter Shaw', 'samuelhensley@hotmail.com', 'Trial region goal we left pass eat.', 'agreement');
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (1, 3, 1, '2025-04-25T10:00:47', 'Completed');
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (2, 1, 3, '2025-05-02T20:33:13', 'Completed');
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (3, 4, 2, '2025-04-21T06:24:39', 'Canceled');
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (4, 4, 2, '2025-05-14T18:23:44', 'Scheduled');
INSERT INTO meetings (meeting_id, student_id, mentor_id, timeslot, status) VALUES (5, 2, 3, '2025-04-27T23:50:44', 'Scheduled');
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (1, 3, 3, 'Risk recently set finish.', 2025-05-02, True);
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (2, 4, 2, 'Push necessary drop grow.', 2025-05-06, False);
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (3, 1, 3, 'Able our.', 2025-04-26, True);
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (4, 4, 3, 'Manager use.', 2025-04-28, True);
INSERT INTO tasks_student (task_id, student_id, mentor_id, title, deadline, completed) VALUES (5, 1, 3, 'Strong long I right.', 2025-05-02, False);
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (1, 'None tonight.', 'Experience science capital step oil husband.', 'Completed', 63.69, 2025-05-14, 3, 1);
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (2, 'Hour memory.', 'Bag yard either ground blue believe lose.', 'Completed', 60.59, 2025-04-18, 2, 5);
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (3, 'Natural today.', 'Himself now clearly listen.', 'Due', 95.47, 2025-05-03, 3, 5);
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (4, 'Until of white.', 'Usually along increase but center listen.', 'Completed', 69.48, 2025-05-15, 3, 2);
INSERT INTO assignments (assignment_id, title, description, status, grade, due_date, mentor_id, student_id) VALUES (5, 'Game summer reflect.', 'Use whose describe late even.', 'Due', 69.39, 2025-04-18, 3, 4);
INSERT INTO student_documents (document_id, assignment_id, filename, url, uploaded_at) VALUES (1, 1, 'file_1.pdf', 'https://example.com/file_1.pdf', '2025-03-26T15:21:16');
INSERT INTO student_documents (document_id, assignment_id, filename, url, uploaded_at) VALUES (2, 2, 'file_2.pdf', 'https://example.com/file_2.pdf', '2025-03-01T12:37:51');
INSERT INTO student_documents (document_id, assignment_id, filename, url, uploaded_at) VALUES (3, 3, 'file_3.pdf', 'https://example.com/file_3.pdf', '2025-03-09T14:28:48');
INSERT INTO student_documents (document_id, assignment_id, filename, url, uploaded_at) VALUES (4, 4, 'file_4.pdf', 'https://example.com/file_4.pdf', '2025-02-12T08:32:44');
INSERT INTO student_documents (document_id, assignment_id, filename, url, uploaded_at) VALUES (5, 5, 'file_5.pdf', 'https://example.com/file_5.pdf', '2025-01-02T15:38:54');
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (1, 'apply', '2025-05-01T06:53:17', 'Completed', 1);
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (2, 'race', '2025-04-28T10:31:17', 'Canceled', 1);
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (3, 'too', '2025-04-21T04:24:16', 'Scheduled', 1);
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (4, 'item', '2025-05-08T22:01:43', 'Scheduled', 3);
INSERT INTO appointments (appointment_id, subject, date, status, student_id) VALUES (5, 'tax', '2025-05-11T07:47:14', 'Canceled', 5);
INSERT INTO student_calendar (calendar_id, name, student_id) VALUES (1, 'Calendar 1', 3);
INSERT INTO student_calendar (calendar_id, name, student_id) VALUES (2, 'Calendar 2', 4);
INSERT INTO student_calendar (calendar_id, name, student_id) VALUES (3, 'Calendar 3', 3);
INSERT INTO student_event (event_id, title, description, type, creation_date, due_date, calendar_id) VALUES (1, 'Event 1', 'North include theory.', 'Reminder', '2025-04-16T01:56:50.962420', '2025-04-21T01:56:50.962422', 2);
INSERT INTO student_event (event_id, title, description, type, creation_date, due_date, calendar_id) VALUES (2, 'Event 2', 'Floor take impact front. Thought fight five too.', 'Reminder', '2025-04-16T01:56:50.962447', '2025-04-21T01:56:50.962447', 3);
INSERT INTO student_event (event_id, title, description, type, creation_date, due_date, calendar_id) VALUES (3, 'Event 3', 'Else listen well decision eight today.', 'Reminder', '2025-04-16T01:56:50.962464', '2025-04-21T01:56:50.962465', 2);
INSERT INTO student_event (event_id, title, description, type, creation_date, due_date, calendar_id) VALUES (4, 'Event 4', 'These middle herself study church why.', 'Reminder', '2025-04-16T01:56:50.962480', '2025-04-21T01:56:50.962480', 2);
INSERT INTO student_event (event_id, title, description, type, creation_date, due_date, calendar_id) VALUES (5, 'Event 5', 'Market believe weight option have question ever.', 'Reminder', '2025-04-16T01:56:50.962497', '2025-04-21T01:56:50.962497', 3);

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