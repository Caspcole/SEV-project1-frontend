import http from "./services.js";
class TimeslotDataService {
  baseUrl = "/performance-t2/event/";

  getAll() {
    return http.get(this.baseUrl);
  }
  get(id) {
    return http.get(`/schedule-t2/event/${id}`);
  }
  create(data) {
    return http.post("/schedule-t2/event", data);
  }
  update(id, data) {
    return http.put(`/schedule-t2/event/${id}`, data);
  }
  delete(id) {
    return http.delete(`/schedule-t2/event/${id}`);
  }
  deleteAll() {
    return http.delete(`/schedule-t2/event`);
  }
}

export default new TimeslotDataService();
