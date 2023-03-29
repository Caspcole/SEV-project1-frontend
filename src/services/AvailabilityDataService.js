import http from "./services.js";
class AvailabilityDataService {
  baseUrl = "/performance-t2/availability/";

  create(data) {
    return http.post(this.baseUrl, data);
  }
}
export default new AvailabilityDataService();
