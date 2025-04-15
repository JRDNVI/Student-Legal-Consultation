-- Student Consultation Tables
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
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id)
);

CREATE TABLE tasks_student (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  mentor_id INT,
  title VARCHAR(255),
  deadline DATE,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id)
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
  FOREIGN KEY (client_id) REFERENCES clients(client_id),
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id)
);

CREATE TABLE tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  title VARCHAR(255),
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE TABLE documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  filename VARCHAR(255),
  url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE TABLE messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  sender_id INT,
  recipient_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  content TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

-- INSERT INTO students (name, email, profile_info) VALUES
-- ('Alice Johnson', 'alice.johnson@example.com', 'Computer Science freshman interested in web development.'),
-- ('Bob Smith', 'bob.smith@example.com', 'Second-year law student looking for internship guidance.'),
-- ('Charlie Brown', 'charlie.brown@example.com', 'Psychology student seeking academic support.');

-- INSERT INTO mentors (name, email, availability, skills) VALUES
-- ('Dr. Emily Davis', 'emily.davis@example.com', 'Weekdays 10-4pm', 'Web Development, Databases, Cloud Computing'),
-- ('Mr. James Wilson', 'james.wilson@example.com', 'Weekends 12-5pm', 'Law, Corporate Practice, Contract Drafting');

-- INSERT INTO meetings (student_id, mentor_id, timeslot, status) VALUES
-- (1, 1, '2025-04-20 14:00:00', 'Scheduled'),
-- (2, 2, '2025-04-22 16:00:00', 'Confirmed'),
-- (3, 1, '2025-04-23 11:00:00', 'Pending');

-- INSERT INTO tasks_student (student_id, mentor_id, title, deadline, completed) VALUES
-- (1, 1, 'Complete HTML/CSS Tutorial', '2025-04-25', FALSE),
-- (2, 2, 'Draft cover letter for internship', '2025-04-28', FALSE);

-- INSERT INTO solicitors (name, email, password, specialty, availability, experience_years) VALUES
-- ('Laura Edwards', 'laura.edwards@example.com', 'securepassword1', 'Family Law', 'Mon-Fri 9-5pm', 8),
-- ('Michael Scott', 'michael.scott@example.com', 'securepassword2', 'Corporate Law', 'Weekdays 10-6pm', 12);


-- INSERT INTO clients (name, email, password, legal_needs, budget) VALUES
-- ('Anna Parker', 'anna.parker@example.com', 'clientpass1', 'Divorce proceedings', 3000.00),
-- ('Tom Hardy', 'tom.hardy@example.com', 'clientpass2', 'Company formation', 5000.00);


-- INSERT INTO cases (client_id, solicitor_id, status, total_billing) VALUES
-- (1, 1, 'Active', 1500.00),
-- (2, 2, 'Pending', 2000.00);

-- INSERT INTO tasks (case_id, title, due_date, completed) VALUES
-- (1, 'Prepare financial disclosures', '2025-04-30', FALSE),
-- (2, 'Draft initial company formation documents', '2025-05-02', FALSE);

-- INSERT INTO documents (case_id, filename, url) VALUES
-- (1, 'financial_statements.pdf', 'https://example.com/docs/financial_statements.pdf'),
-- (2, 'company_formation_draft.docx', 'https://example.com/docs/company_formation_draft.docx');

-- INSERT INTO messages (case_id, sender_id, recipient_id, content) VALUES
-- (1, 1, 1, 'Please review the latest financial statements.'),
-- (2, 2, 2, 'Initial draft for your review attached.');
