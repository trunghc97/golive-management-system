import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-history',
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-3">History: {{ changeId }}</h2>
      <table class="w-full text-sm border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-1">Time</th>
            <th class="border p-1">Component</th>
            <th class="border p-1">Action</th>
            <th class="border p-1">Actor</th>
            <th class="border p-1">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let h of data()">
            <td class="border p-1">{{ h.actionTime | date:'short' }}</td>
            <td class="border p-1">{{ h.componentCode }}</td>
            <td class="border p-1">{{ h.action }}</td>
            <td class="border p-1">{{ h.actor }}</td>
            <td class="border p-1">{{ h.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  changeId = this.route.snapshot.paramMap.get('changeId') || '';
  data = signal<any[]>([]);

  ngOnInit() {
    this.api.getHistory(this.changeId).subscribe(d => this.data.set(d as any[]));
  }
}


