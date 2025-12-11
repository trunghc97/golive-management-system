import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    ChangeRequest,
    ChangeServiceDeployment,
    CreateChangeRequest,
    ImpactAnalysis,
    ChangeStatus
} from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ChangeService {
    private readonly baseUrl = `${environment.apiUrl}/changes`;

    constructor(private http: HttpClient) { }

    getAllChanges(): Observable<ChangeRequest[]> {
        return this.http.get<ChangeRequest[]>(this.baseUrl);
    }

    getChangesByDateRange(
        from?: string,
        to?: string,
        systemId?: number,
        status?: ChangeStatus
    ): Observable<ChangeRequest[]> {
        let params = new HttpParams();
        if (from) params = params.set('from', from);
        if (to) params = params.set('to', to);
        if (systemId) params = params.set('system', systemId.toString());
        if (status) params = params.set('status', status);

        return this.http.get<ChangeRequest[]>(this.baseUrl, { params });
    }

    getChangeById(id: number): Observable<ChangeRequest> {
        return this.http.get<ChangeRequest>(`${this.baseUrl}/${id}`);
    }

    getChangeByCode(code: string): Observable<ChangeRequest> {
        return this.http.get<ChangeRequest>(`${this.baseUrl}/code/${code}`);
    }

    getChangeDeployments(changeId: number): Observable<ChangeServiceDeployment[]> {
        return this.http.get<ChangeServiceDeployment[]>(`${this.baseUrl}/${changeId}/services`);
    }

    getChangeImpact(changeId: number): Observable<ImpactAnalysis[]> {
        return this.http.get<ImpactAnalysis[]>(`${this.baseUrl}/${changeId}/impact`);
    }

    createChange(request: CreateChangeRequest): Observable<ChangeRequest> {
        return this.http.post<ChangeRequest>(this.baseUrl, request);
    }
}
