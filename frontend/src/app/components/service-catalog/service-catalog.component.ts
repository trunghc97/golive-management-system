import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ServiceCatalogService } from '../../services/service-catalog.service';
import { Service, ServiceType } from '../../models/models';

@Component({
    selector: 'app-service-catalog',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule
    ],
    template: `
    <div class="catalog-container">
      <h1>Service Catalog</h1>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Filter by Type</mat-label>
          <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
            <mat-option [value]="null">All Types</mat-option>
            <mat-option *ngFor="let type of serviceTypes" [value]="type">{{ type }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="filteredServices" class="services-table">
        <ng-container matColumnDef="code">
          <th mat-header-cell *matHeaderCellDef>Code</th>
          <td mat-cell *matCellDef="let service">{{ service.code }}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let service">{{ service.name }}</td>
        </ng-container>

        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let service">
            <mat-chip>{{ service.type }}</mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="system">
          <th mat-header-cell *matHeaderCellDef>System</th>
          <td mat-cell *matCellDef="let service">{{ service.systemName }}</td>
        </ng-container>

        <ng-container matColumnDef="techStack">
          <th mat-header-cell *matHeaderCellDef>Tech Stack</th>
          <td mat-cell *matCellDef="let service">{{ service.techStack }}</td>
        </ng-container>

        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let service">
            <mat-chip [class]="service.active ? 'status-active' : 'status-inactive'">
              {{ service.active ? 'Active' : 'Inactive' }}
            </mat-chip>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
    styles: [`
    .catalog-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .filters {
      margin-bottom: 2rem;
      display: flex;
      gap: 1rem;
    }

    .services-table {
      width: 100%;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    th {
      font-weight: 600;
      background: #f5f5f5;
    }

    .status-active {
      background: #4caf50;
      color: white;
    }

    .status-inactive {
      background: #9e9e9e;
      color: white;
    }
  `]
})
export class ServiceCatalogComponent implements OnInit {
    services: Service[] = [];
    filteredServices: Service[] = [];
    selectedType: ServiceType | null = null;
    serviceTypes = Object.values(ServiceType);
    displayedColumns = ['code', 'name', 'type', 'system', 'techStack', 'active'];

    constructor(private serviceCatalogService: ServiceCatalogService) { }

    ngOnInit() {
        this.loadServices();
    }

    loadServices() {
        this.serviceCatalogService.getAllServices().subscribe({
            next: (data) => {
                this.services = data;
                this.applyFilters();
            },
            error: (err) => console.error('Error loading services:', err)
        });
    }

    applyFilters() {
        if (this.selectedType) {
            this.filteredServices = this.services.filter(s => s.type === this.selectedType);
        } else {
            this.filteredServices = this.services;
        }
    }
}
