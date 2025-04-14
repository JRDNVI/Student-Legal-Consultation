-- FYP Database Schema: Student and Legal Systems
-- Generated on 2025-04-14

-- Student Consultation Tables
CREATE TABLE students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  profile_info TEXT
);

CREATE TABLE mentors (
  mentor_id INT AUTO_INCREMENT PRIMARY KEY,
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
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  specialty VARCHAR(100),
  availability TEXT,
  experience_years INT
);

CREATE TABLE clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
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
