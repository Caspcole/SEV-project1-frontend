import http from "./services.js";
class CritiqueDataService {
  baseUrl = "/performance-t2/critique/";

  getAll() {
    return http.get(this.baseUrl);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  update(id, data) {
    return http.put(`/performance-t2/critique/${id}`, data);
  }
  delete(id) {
    return http.delete(`/performance-t2/critique/${id}`);
  }
  deleteAll() {
    return http.delete(`/performace-t2/critique`);
  }
}
export default new CritiqueDataService();
