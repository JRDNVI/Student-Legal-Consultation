// I don't know what rabbit hole I went down but this does not work.
// PAINNNNNNNNNN
// Will probaly remove this helper function tried something new, did not work

export function buildMentorPayload(mentorId, formData, shouldUpdate = false, originalData = {}) {
    const payload = [];
  
    const attachId = (item) => shouldUpdate ? { mentor_id: mentorId, ...item } : item;
    const attachWhere = (item) => shouldUpdate ? { where: { mentor_id: mentorId } } : {};
  
    const isDifferent = (field, newVal) => {
      const orig = originalData[field] || [];
      return JSON.stringify(orig) !== JSON.stringify(newVal);
    };
  
    const pushIfChanged = (field, tableName, mapper) => {
      if (!isDifferent(field, formData[field])) return;
      formData[field].forEach((val) => {
        payload.push({
          tableName,
          data: attachId(mapper(val)),
          ...attachWhere(val)
        });
      });
    };
  
    pushIfChanged("skills", "mentor_skills", (skill) => ({ skill }));
    pushIfChanged("expertise", "mentor_expertise", (item) => ({ topic_area: item.topic_area, area_of_expertise: item.area_of_expertise }));
    pushIfChanged("communication_styles", "mentor_communication_styles", (style) => ({ style }));
    pushIfChanged("languages", "mentor_languages", (language) => ({ language }));
    pushIfChanged("availability", "mentor_availability", (item) => ({ day: item.day, time_slot: item.time_slot }));
  
    return payload;
  }
  