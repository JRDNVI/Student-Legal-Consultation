-- -- Test for algorithm (Mentors)

INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES
(1, 'mentor-uuid-006', 'Alice Martin', 'alice.martin@example.com', 'Weekdays', 'AI, Machine Learning'),
(2, 'mentor-uuid-007', 'Bob Harris', 'bob.harris@example.com', 'Weekends', 'Web Development, Databases'),
(3, 'mentor-uuid-008', 'Clara Zhang', 'clara.zhang@example.com', 'Weekdays', 'Cybersecurity, Networks'),
(4, 'mentor-uuid-009', 'Daniel King', 'daniel.king@example.com', 'Flexible', 'Cloud, DevOps'),
(5, 'mentor-uuid-010', 'Elena Petrova', 'elena.petrova@example.com', 'Evenings', 'AI, Natural Language Processing');

INSERT INTO mentor_expertise (mentor_id, topic_area, area_of_expertise) VALUES
(1, 'Computer Science', 'Artificial Intelligence'),
(1, 'Computer Science', 'Machine Learning'),

(2, 'Computer Science', 'Web Development'),
(2, 'Software Engineering', 'Software Engineering'),

(3, 'Information Security', 'Cybersecurity'),
(3, 'Information Technology', 'Network Engineering'),

(4, 'DevOps & Infrastructure', 'DevOps'),
(4, 'Cloud Computing', 'Cloud Computing'),

(5, 'Computer Science', 'Natural Language Processing'),
(5, 'Computer Science', 'AI');


INSERT INTO mentor_communication_styles (mentor_id, style) VALUES
(1, 'Email'), (1, 'Video Call'),
(2, 'Phone'), (2, 'Chat'),
(3, 'In-Person'), (3, 'Video Call'),
(4, 'Chat'), (4, 'Email'),
(5, 'Video Call'), (5, 'Email');

INSERT INTO mentor_languages (mentor_id, language) VALUES
(1, 'English'), (1, 'Spanish'),
(2, 'English'), (2, 'French'),
(3, 'Mandarin'), (3, 'English'),
(4, 'German'), (4, 'English'),
(5, 'Russian'), (5, 'English');

INSERT INTO mentor_availability (mentor_id, day, time_slot) VALUES
(1, 'Monday', '5:00-12:00'), (1, 'Wednesday', '14:00-16:00'),
(2, 'Saturday', '09:00-11:00'), (2, 'Sunday', '13:00-15:00'),
(3, 'Tuesday', '08:00-5:00'), (3, 'Thursday', '5:00-12:00'),
(4, 'Friday', '15:00-17:00'), (4, 'Monday', '16:00-18:00'),
(5, 'Wednesday', '09:00-11:00'), (5, 'Friday', '13:00-15:00');

INSERT INTO mentor_skills (mentor_id, skill) VALUES
(1, 'Python'), (1, 'TensorFlow'),
(2, 'React'), (2, 'Node.js'),
(3, 'Network Security'), (3, 'Ethical Hacking'),
(4, 'AWS'), (4, 'Docker'),
(5, 'NLP'), (5, 'Machine Learning');


-- Test for algorithm (Students)
-- INSERT INTO students (student_id, cognito_id, name, email, profile_info, mentor_id) VALUES
-- (4, 'uuid-student-4', 'Alice Byrne', 'alice.byrne@example.com', 'Aspiring data scientist with interest in AI.', NULL),
-- (5, 'uuid-student-5', 'Omar Farouk', 'omar.farouk@example.com', 'Looking to improve backend development skills.', NULL),
-- (1, 'uuid-student-1', 'Sophie Tan', 'sophie.tan@example.com', 'Enjoys working on frontend interfaces.', NULL),
-- (2, 'uuid-student-2', 'Liam Walsh', 'liam.walsh@example.com', 'Interested in mobile app development.', NULL),
-- (3, 'uuid-student-3', 'Maya Singh', 'maya.singh@example.com', 'Focuses on cybersecurity and ethical hacking.', NULL);


-- INSERT INTO student_preferences (student_id, area_of_study, communication_style, language, mentor_rating) VALUES
-- (4, 'Artificial Intelligence', 'Video Call', 'English', 4.3),
-- (5, 'Software Engineering', 'Email', 'English,French', 4.5),
-- (1, 'Human Computer Interaction', 'In-Person', 'English,Chinese', 4.1),
-- (2, 'Mobile Development', 'Chat', 'English,Spanish', 4.2),
-- (3, 'Cybersecurity', 'Video Call', 'English,Hindi', 4.4);

-- INSERT INTO student_interests (student_id, interest) VALUES
-- (4, 'Python'),
-- (4, 'Machine Learning'),
-- (5, 'Databases'),
-- (5, 'Node.js'),
-- (1, 'UI/UX Design'),
-- (1, 'React'),
-- (2, 'Flutter'),
-- (2, 'Kotlin'),
-- (3, 'Pen Testing'),
-- (3, 'Network Security');

-- INSERT INTO student_availability (student_id, day, time_slot) VALUES
-- (4, 'Monday', '09:00-11:00'),
-- (4, 'Wednesday', '14:00-16:00'),
-- (5, 'Tuesday', '5:00-12:00'),
-- (5, 'Thursday', '15:00-17:00'),
-- (1, 'Monday', '13:00-15:00'),
-- (1, 'Friday', '09:00-11:00'),
-- (2, 'Wednesday', '11:00-13:00'),
-- (2, 'Thursday', '5:00-12:00'),
-- (3, 'Tuesday', '14:00-16:00'),
-- (3, 'Friday', '16:00-18:00');

-- MY test data Stduent

-- INSERT INTO meetings (student_id, mentor_id, timeslot, status)
-- VALUES
-- (4, 1, '2025-04-18 5:00:00', 'confirmed'),
-- (4, 2, '2025-04-20 14:00:00', 'pending');


-- INSERT INTO tasks_student (student_id, mentor_id, title, deadline, completed)
-- VALUES
-- (4, 1, 'Write project outline', '2025-04-22', FALSE),
-- (4, 1, 'Submit draft', '2025-04-25', FALSE);


-- INSERT INTO assignments (title, description, status, grade, due_date, mentor_id, student_id)
-- VALUES
-- ('Database Assignment', 'Design a relational schema', 'pending', NULL, '2025-04-28', 1, 4),
-- ('Security Report', 'Write report on OWASP top 5', 'submitted', 80, '2025-04-30', 2, 4);


-- INSERT INTO student_documents (assignment_id, filename, url, uploaded_at)
-- VALUES
-- (1, 'db_assignment.pdf', 'https://example.com/files/db_assignment.pdf', NOW()),
-- (2, 'security_report.docx', 'https://example.com/files/security_report.docx', NOW());


-- INSERT INTO student_calendar (name, student_id)
-- VALUES
-- ('Semester Calendar', 4);


-- INSERT INTO student_event (title, description, type, creation_date, due_date, calendar_id)
-- VALUES
-- ('Assignment Deadline', 'Database assignment due', 'deadline', NOW(), '2025-04-28 23:59:59', 1),
-- ('Mentor Check-in', 'Progress meeting with mentor', 'meeting', NOW(), '2025-04-19 15:00:00', 1);