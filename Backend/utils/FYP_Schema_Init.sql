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
  topic_area VARCHAR(255),
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

-- Legal Case Management Tables
-- Expanded the tables so it was normalised and provided more data to match on
CREATE TABLE solicitors (
  solicitor_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  hourly_rate DECIMAL(10, 2),
  experience_years INT
);

CREATE TABLE solicitor_languages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitor_id INT,
  language VARCHAR(50),
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id) ON DELETE CASCADE
);

CREATE TABLE solicitor_communication_styles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitor_id INT,
  style VARCHAR(50),
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id) ON DELETE CASCADE
);

CREATE TABLE solicitor_specialisations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitor_id INT,
  specialization VARCHAR(100),
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id) ON DELETE CASCADE
);

CREATE TABLE solicitor_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitor_id INT,
  day_of_week VARCHAR(10),
  time_slot VARCHAR(50),
  FOREIGN KEY (solicitor_id) REFERENCES solicitors(solicitor_id) ON DELETE CASCADE
);

CREATE TABLE clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
  cognito_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  language VARCHAR(25),
  communcation_style VARCHAR(50),
  email VARCHAR(255) UNIQUE,
  budget DECIMAL(10, 2)
);

CREATE TABLE client_legal_needs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  legal_topic VARCHAR(100),
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
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

-- All insert data was generated by Chat GPT


-- SET FOREIGN_KEY_CHECKS = 0;

-- Disable foreign key checks to avoid errors during drop


