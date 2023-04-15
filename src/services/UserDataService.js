import http from "./services.js";
class UserRoleDataService {
  baseUrl = "/performance-t2/user/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getAllStudents() {
    return http.get(this.baseUrl + "students");
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }
}
export default new UserRoleDataService();
