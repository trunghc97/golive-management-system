import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ChangeSearchParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class ChangeService {
  private http = inject(HttpClient);

  search(params: ChangeSearchParams) {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.status) q.set('status', params.status);
    q.set('page', String(params.page ?? 0));
    q.set('size', String(params.size ?? 20));
    return this.http.get<any>(`/api/changes?${q.toString()}`);
  }
}


