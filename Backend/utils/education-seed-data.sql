-- -- Test for algorithm (Mentors)

INSERT INTO mentors (mentor_id, cognito_id, name, email, availability, skills) VALUES
(6, 'mentor-uuid-006', 'Alice Martin', 'alice.martin@example.com', 'Weekdays', 'AI, Machine Learning'),
(7, 'mentor-uuid-007', 'Bob Harris', 'bob.harris@example.com', 'Weekends', 'Web Development, Databases'),
(8, 'mentor-uuid-008', 'Clara Zhang', 'clara.zhang@example.com', 'Weekdays', 'Cybersecurity, Networks'),
(9, 'mentor-uuid-009', 'Daniel King', 'daniel.king@example.com', 'Flexible', 'Cloud, DevOps'),
(10, 'mentor-uuid-010', 'Elena Petrova', 'elena.petrova@example.com', 'Evenings', 'AI, Natural Language Processing');

INSERT INTO mentor_expertise (mentor_id, topic_area, area_of_expertise) VALUES
(6, 'Computer Science', 'Artificial Intelligence'),
(6, 'Computer Science', 'Machine Learning'),

(7, 'Computer Science', 'Web Development'),
(7, 'Software Engineering', 'Software Engineering'),

(8, 'Information Security', 'Cybersecurity'),
(8, 'Information Technology', 'Network Engineering'),

(9, 'DevOps & Infrastructure', 'DevOps'),
(9, 'Cloud Computing', 'Cloud Computing'),

(10, 'Computer Science', 'Natural Language Processing'),
(10, 'Computer Science', 'AI');


INSERT INTO mentor_communication_styles (mentor_id, style) VALUES
(6, 'Email'), (6, 'Video Call'),
(7, 'Phone'), (7, 'Chat'),
(8, 'In-Person'), (8, 'Video Call'),
(9, 'Chat'), (9, 'Email'),
(10, 'Video Call'), (10, 'Email');

INSERT INTO mentor_languages (mentor_id, language) VALUES
(6, 'English'), (6, 'Spanish'),
(7, 'English'), (7, 'French'),
(8, 'Mandarin'), (8, 'English'),
(9, 'German'), (9, 'English'),
(10, 'Russian'), (10, 'English');

INSERT INTO mentor_availability (mentor_id, day, time_slot) VALUES
(6, 'Monday', '10:00-12:00'), (6, 'Wednesday', '14:00-16:00'),
(7, 'Saturday', '09:00-11:00'), (7, 'Sunday', '13:00-15:00'),
(8, 'Tuesday', '08:00-10:00'), (8, 'Thursday', '10:00-12:00'),
(9, 'Friday', '15:00-17:00'), (9, 'Monday', '16:00-18:00'),
(10, 'Wednesday', '09:00-11:00'), (10, 'Friday', '13:00-15:00');

INSERT INTO mentor_skills (mentor_id, skill) VALUES
(6, 'Python'), (6, 'TensorFlow'),
(7, 'React'), (7, 'Node.js'),
(8, 'Network Security'), (8, 'Ethical Hacking'),
(9, 'AWS'), (9, 'Docker'),
(10, 'NLP'), (10, 'Machine Learning');


-- Test for algorithm (Students)
-- INSERT INTO students (student_id, cognito_id, name, email, profile_info, mentor_id) VALUES
-- (4, 'uuid-student-4', 'Alice Byrne', 'alice.byrne@example.com', 'Aspiring data scientist with interest in AI.', NULL),
-- (5, 'uuid-student-5', 'Omar Farouk', 'omar.farouk@example.com', 'Looking to improve backend development skills.', NULL),
-- (6, 'uuid-student-6', 'Sophie Tan', 'sophie.tan@example.com', 'Enjoys working on frontend interfaces.', NULL),
-- (7, 'uuid-student-7', 'Liam Walsh', 'liam.walsh@example.com', 'Interested in mobile app development.', NULL),
-- (8, 'uuid-student-8', 'Maya Singh', 'maya.singh@example.com', 'Focuses on cybersecurity and ethical hacking.', NULL);


-- INSERT INTO student_preferences (student_id, area_of_study, communication_style, language, mentor_rating) VALUES
-- (4, 'Artificial Intelligence', 'Video Call', 'English', 4.8),
-- (5, 'Software Engineering', 'Email', 'English,French', 4.5),
-- (6, 'Human Computer Interaction', 'In-Person', 'English,Chinese', 4.6),
-- (7, 'Mobile Development', 'Chat', 'English,Spanish', 4.7),
-- (8, 'Cybersecurity', 'Video Call', 'English,Hindi', 4.9);

-- INSERT INTO student_interests (student_id, interest) VALUES
-- (4, 'Python'),
-- (4, 'Machine Learning'),
-- (5, 'Databases'),
-- (5, 'Node.js'),
-- (6, 'UI/UX Design'),
-- (6, 'React'),
-- (7, 'Flutter'),
-- (7, 'Kotlin'),
-- (8, 'Pen Testing'),
-- (8, 'Network Security');

-- INSERT INTO student_availability (student_id, day, time_slot) VALUES
-- (4, 'Monday', '09:00-11:00'),
-- (4, 'Wednesday', '14:00-16:00'),
-- (5, 'Tuesday', '10:00-12:00'),
-- (5, 'Thursday', '15:00-17:00'),
-- (6, 'Monday', '13:00-15:00'),
-- (6, 'Friday', '09:00-11:00'),
-- (7, 'Wednesday', '11:00-13:00'),
-- (7, 'Thursday', '10:00-12:00'),
-- (8, 'Tuesday', '14:00-16:00'),
-- (8, 'Friday', '16:00-18:00');

-- MY test data Stduent

-- INSERT INTO meetings (student_id, mentor_id, timeslot, status)
-- VALUES
-- (9, 1, '2025-04-18 10:00:00', 'confirmed'),
-- (9, 2, '2025-04-20 14:00:00', 'pending');


-- INSERT INTO tasks_student (student_id, mentor_id, title, deadline, completed)
-- VALUES
-- (9, 1, 'Write project outline', '2025-04-22', FALSE),
-- (9, 1, 'Submit draft', '2025-04-25', FALSE);


-- INSERT INTO assignments (title, description, status, grade, due_date, mentor_id, student_id)
-- VALUES
-- ('Database Assignment', 'Design a relational schema', 'pending', NULL, '2025-04-28', 1, 9),
-- ('Security Report', 'Write report on OWASP top 10', 'submitted', 80, '2025-04-30', 2, 9);


-- INSERT INTO student_documents (assignment_id, filename, url, uploaded_at)
-- VALUES
-- (1, 'db_assignment.pdf', 'https://example.com/files/db_assignment.pdf', NOW()),
-- (2, 'security_report.docx', 'https://example.com/files/security_report.docx', NOW());


-- INSERT INTO student_calendar (name, student_id)
-- VALUES
-- ('Semester Calendar', 9);


-- INSERT INTO student_event (title, description, type, creation_date, due_date, calendar_id)
-- VALUES
-- ('Assignment Deadline', 'Database assignment due', 'deadline', NOW(), '2025-04-28 23:59:59', 1),
-- ('Mentor Check-in', 'Progress meeting with mentor', 'meeting', NOW(), '2025-04-19 15:00:00', 1);