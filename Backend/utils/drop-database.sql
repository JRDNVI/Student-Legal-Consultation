SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS 
  -- Education
  mentor_skills,
  mentor_expertise,
  mentor_communication_styles,
  mentor_languages,
  mentor_availability,
  student_preferences,
  student_interests,
  student_suggested_course,
  student_availability,
  meetings,
  tasks_student,
  student_documents,
  assignments,
  student_event,
  student_calendar,
  appointments,
  students,
  mentors,

  -- Legal
  solicitor_languages,
  solicitor_communication_styles,
  solicitor_specialisations,
  solicitor_availability,
  client_legal_needs,
  billing,
  notes,
  solicitor_cases, 
  case_events,
  calendar,
  messages,
  documents,
  tasks,
  cases,
  clients,
  case_documents,
  solicitors;

SET FOREIGN_KEY_CHECKS = 1;