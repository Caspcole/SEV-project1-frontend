import http from "./services.js";
class SemesterDataService {
  baseUrl = "/performance-t2/semester/";

  getAll() {
    return http.get(this.baseUrl);
  }

  getCurrent(date) {
    return http.get(this.baseUrl + "date/" + date);
  }
}
export default new SemesterDataService();
