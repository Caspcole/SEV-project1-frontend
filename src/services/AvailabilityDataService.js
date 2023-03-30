import http from "./services.js";
class AvailabilityDataService {
  baseUrl = "/performance-t2/availability/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getByUser(userId) {
    return http.get(this.baseUrl + "userId/" + userId);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }
}
export default new AvailabilityDataService();
