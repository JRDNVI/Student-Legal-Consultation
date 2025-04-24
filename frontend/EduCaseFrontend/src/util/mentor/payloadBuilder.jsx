export function buildMentorPayload(mentorId, formData) {
  const payload = [];

  const attachId = (item) => ({ mentor_id: mentorId, ...item });

  const pushAll = (field, tableName, mapper) => {
    formData[field]?.forEach((val) => {
      payload.push({
        tableName,
        data: attachId(mapper(val))
      });
    });
  };

  pushAll("skills", "mentor_skills", (skill) => ({ skill }));
  pushAll("expertise", "mentor_expertise", (item) => ({
    topic_area: item.topic_area,
    area_of_expertise: item.area_of_expertise
  }));
  pushAll("communication_styles", "mentor_communication_styles", (style) => ({ style }));
  pushAll("languages", "mentor_languages", (language) => ({ language }));
  pushAll("availability", "mentor_availability", (item) => ({
    day: item.day,
    time_slot: item.time_slot
  }));

  return payload;
}
