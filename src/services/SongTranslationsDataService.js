import http from "./services.js";
class SongTranslationsDataService {
  baseUrl = "/performance-t2/";

  getAll() {
    return http.get(this.baseUrl + "songTranslations");
  }
  get(id) {
    return http.get(this.baseUrl + `songTranslations/${id}`);
  }
  getBySongId(id) {
    return http.get(this.baseUrl + `songTranslations/song/${id}`);
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
export default new SongTranslationsDataService();
