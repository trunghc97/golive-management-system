import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-status',
  imports: [CommonModule, FormsModule, MatCardModule, MatSelectModule, MatButtonModule],
  template: `
    <div class="p-4 max-w-md">
      <mat-card>
        <mat-card-title>Update Status</mat-card-title>
        <mat-card-content>
          <div class="mb-2">Change ID: {{ id }}</div>
          <mat-select [(ngModel)]="status" placeholder="Status">
            <mat-option value="PENDING">PENDING</mat-option>
            <mat-option value="IN_PROGRESS">IN_PROGRESS</mat-option>
            <mat-option value="SUCCESS">SUCCESS</mat-option>
            <mat-option value="ROLLBACK_PARTIAL">ROLLBACK_PARTIAL</mat-option>
            <mat-option value="ROLLBACK_ALL">ROLLBACK_ALL</mat-option>
          </mat-select>
          <button mat-raised-button color="primary" class="ml-2" (click)="save()">Save</button>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class StatusComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  id = Number(this.route.snapshot.paramMap.get('id'));
  status = 'PENDING';

  save() {
    this.api.updateStatus(this.id, { status: this.status }).subscribe(() => alert('Updated'));
  }
}


