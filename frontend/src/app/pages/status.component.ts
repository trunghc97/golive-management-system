import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-status',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 max-w-md">
      <h2 class="text-lg font-semibold mb-3">Update Status</h2>
      <div class="mb-2">Change ID: {{ id }}</div>
      <select class="border p-2" [(ngModel)]="status">
        <option value="PENDING">PENDING</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="SUCCESS">SUCCESS</option>
        <option value="ROLLBACK_PARTIAL">ROLLBACK_PARTIAL</option>
        <option value="ROLLBACK_ALL">ROLLBACK_ALL</option>
      </select>
      <button class="border px-3 py-1 ml-2" (click)="save()">Save</button>
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


