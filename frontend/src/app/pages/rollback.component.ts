import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-rollback',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule],
  template: `
    <div class="p-4 max-w-xl">
      <mat-card>
        <mat-card-title>Rollback Components</mat-card-title>
        <mat-card-content>
          <div class="mb-2">Change ID: {{ id }}</div>
          <div class="flex flex-col gap-1 max-h-48 overflow-auto border p-2">
            <label *ngFor="let c of components">
              <input type="checkbox" [value]="c.componentId" (change)="toggle(c.componentId, $event)" />
              {{ c.code }} - {{ c.name }}
            </label>
          </div>
          <div class="mt-2 flex gap-2">
            <input class="border p-2 flex-1" placeholder="Actor" [(ngModel)]="actor"/>
            <button mat-raised-button color="warn" (click)="doPartial()">Rollback Partial</button>
            <button mat-raised-button color="accent" (click)="doFull()">Rollback All</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class RollbackComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  id = Number(this.route.snapshot.paramMap.get('id'));
  components: any[] = [];
  selected: number[] = [];
  actor = '';

  constructor() {
    // giả định API trả ChangeResponse; để demo, cần một API fetch change by id (chưa thêm), tạm bỏ qua load components
  }

  toggle(id: number, e: any) {
    if (e.target.checked) this.selected.push(id);
    else this.selected = this.selected.filter(x => x !== id);
  }

  doPartial() {
    this.api.rollbackComponents(this.id, { actor: this.actor, componentIds: this.selected }).subscribe(() => alert('OK'));
  }
  doFull() {
    this.api.rollbackAll(this.id, { actor: this.actor }).subscribe(() => alert('OK'));
  }
}


