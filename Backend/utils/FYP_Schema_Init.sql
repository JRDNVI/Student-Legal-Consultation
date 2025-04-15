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

CREATE TABLE assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status ENUM('Due', 'Completed', 'Overdue'),
  grade DECIMAL(5,2),
  due_date DATE,
  mentor_id INT,
  student_id INT,
  FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id),
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE student_documents (
  document_id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT,
  filename VARCHAR(255),
  url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id)
);

CREATE TABLE appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(16),
  date DATETIME,
  status ENUM('Scheduled', 'Completed', 'Canceled'),
  student_id INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE student_calendar (
  calendar_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32),
  student_id INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE student_event (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(32),
  description VARCHAR(255),
  type VARCHAR(16),
  creation_date DATETIME,
  due_date DATETIME,
  calendar_id INT,
  FOREIGN KEY (calendar_id) REFERENCES student_calendar(calendar_id)
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

CREATE TABLE calendar (
  calendar_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32),
  solicitor_id INT,
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id)
);

CREATE TABLE event (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(32),
  description VARCHAR(255),
  type VARCHAR(16),
  creation_date DATETIME,
  due_date DATETIME,
  calendar_id INT,
  FOREIGN KEY (calendar_id) REFERENCES calendar(calendar_id)
);

CREATE TABLE solicitor_cases (
  solicitor_id INT,
  case_id INT,
  PRIMARY KEY (solicitor_id, case_id),
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id),
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE TABLE billing (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  amount_due DECIMAL(10,2),
  amount_paid DECIMAL(10,2),
  billing_status VARCHAR(16),
  billing_date DATE,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE TABLE notes (
  note_id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT,
  note_name VARCHAR(16),
  note_type VARCHAR(16),
  creation_date DATE,
  content TEXT,
  FOREIGN KEY (case_id) REFERENCES cases(case_id)
);