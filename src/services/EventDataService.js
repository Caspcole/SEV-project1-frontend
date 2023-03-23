import http from "./services.js";
class EventDataService {
  baseUrl = "/performance-t2/event/";

  getAll() {
    return http.get(this.baseUrl);
  }
  getGTEDate(date) {
    return http.get(this.baseUrl + `date/${date}`);
  }

  getStudentTimeslotsForDate(date) {
    return http.get(this.baseUrl + "critiqueTimeslots/" + date);
  }
  getSemesterCritiques(semesterId) {
    return http.get(this.baseUrl + "semesterCritiques/" + semesterId);
  }
}
export default new EventDataService();
