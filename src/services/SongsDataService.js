import http from "./services.js";
class SongssDataService {
  baseUrl = "/performance-t2/";

  getAll() {
    return http.get(this.baseUrl + "song");
  }
  getByComposerId(composerId) {
    return http.get(this.baseUrl + `song/composer/${composerId}`);
  }
  // update(id, data) {
  //   return http.put(`/schedule-t2/course/${id}`, data);
  // }
  // delete(id) {
  //   return http.delete(`/schedule-t2/course/${id}`);
  // }
  // deleteAll() {
  //   return http.delete(`/schedule-t2/course`);
  // }
}
export default new SongssDataService();
