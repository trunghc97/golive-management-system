import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getComponents() {
    return this.http.get<any[]>(`/api/components`);
  }
  getTimeline(date: string) {
    return this.http.get<any[]>(`/api/timeline?date=${date}`);
  }
  createChange(payload: any) {
    return this.http.post(`/api/changes`, payload);
  }
  updateChange(id: number, payload: any) {
    return this.http.put(`/api/changes/${id}`, payload);
  }
  updateStatus(id: number, payload: any) {
    return this.http.put(`/api/changes/${id}/status`, payload);
  }
  rollbackAll(id: number, payload: any) {
    return this.http.post(`/api/changes/${id}/rollback`, payload);
  }
  rollbackComponents(id: number, payload: any) {
    return this.http.post(`/api/changes/${id}/rollback-components`, payload);
  }
  getHistory(changeId: string) {
    return this.http.get<any[]>(`/api/history?changeId=${changeId}`);
  }
}


