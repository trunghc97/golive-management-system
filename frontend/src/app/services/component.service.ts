import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ComponentService {
  private http = inject(HttpClient);

  getSummary(from: string, to: string) {
    return this.http.get<any[]>(`/api/components/summary?from=${from}&to=${to}`);
  }
}


