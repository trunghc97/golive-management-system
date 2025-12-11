import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Service, ServiceDependency, ServiceType } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ServiceCatalogService {
    private readonly baseUrl = `${environment.apiUrl}/services`;

    constructor(private http: HttpClient) { }

    getAllServices(): Observable<Service[]> {
        return this.http.get<Service[]>(this.baseUrl);
    }

    getServicesBySystem(systemId: number): Observable<Service[]> {
        const params = new HttpParams().set('system', systemId.toString());
        return this.http.get<Service[]>(this.baseUrl, { params });
    }

    getServicesByType(type: ServiceType): Observable<Service[]> {
        const params = new HttpParams().set('type', type);
        return this.http.get<Service[]>(this.baseUrl, { params });
    }

    getServicesBySystemAndType(systemId: number, type: ServiceType): Observable<Service[]> {
        const params = new HttpParams()
            .set('system', systemId.toString())
            .set('type', type);
        return this.http.get<Service[]>(this.baseUrl, { params });
    }

    getServiceById(id: number): Observable<Service> {
        return this.http.get<Service>(`${this.baseUrl}/${id}`);
    }

    getServiceByCode(code: string): Observable<Service> {
        return this.http.get<Service>(`${this.baseUrl}/code/${code}`);
    }

    getServiceDependencies(serviceId: number): Observable<ServiceDependency[]> {
        return this.http.get<ServiceDependency[]>(`${this.baseUrl}/${serviceId}/dependencies`);
    }
}
