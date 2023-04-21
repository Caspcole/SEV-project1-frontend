import http from "./services.js";
class StudentInstrumentDataService {
  baseUrl = "/performance-t2/studentTimeslot/";

  getAll() {
    return http.get(this.baseUrl);
  }

  getByUser(userId) {
    return http.get(this.baseUrl + userId);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }
}
export default new StudentInstrumentDataService();
