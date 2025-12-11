import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardDay, DashboardWeek, ChangeServiceDeployment } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly baseUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getDayView(date: string): Observable<DashboardDay> {
        const params = new HttpParams().set('date', date);
        return this.http.get<DashboardDay>(`${this.baseUrl}/day`, { params });
    }

    getWeekView(weekStart: string): Observable<DashboardWeek> {
        const params = new HttpParams().set('start', weekStart);
        return this.http.get<DashboardWeek>(`${this.baseUrl}/week`, { params });
    }

    getServicesDeployed(from: string, to: string): Observable<ChangeServiceDeployment[]> {
        const params = new HttpParams()
            .set('from', from)
            .set('to', to);
        return this.http.get<ChangeServiceDeployment[]>(`${this.baseUrl}/services-deployed`, { params });
    }
}
