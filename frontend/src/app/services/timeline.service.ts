import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private http = inject(HttpClient);

  getDay(date: string) {
    return this.http.get<any>(`/api/timeline?date=${date}`);
  }
}


