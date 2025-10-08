import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="p-4 max-w-xl">
      <mat-card>
        <mat-card-title>Register Change</mat-card-title>
        <mat-card-content>
          <form (ngSubmit)="submit()" #f="ngForm" class="grid gap-2">
            <mat-form-field appearance="outline">
              <mat-label>Change ID</mat-label>
              <input matInput name="changeId" [(ngModel)]="form.changeId" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Team</mat-label>
              <input matInput name="team" [(ngModel)]="form.team" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Registered By</mat-label>
              <input matInput name="registeredBy" [(ngModel)]="form.registeredBy" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput name="description" [(ngModel)]="form.description"></textarea>
            </mat-form-field>
            <div class="grid gap-2">
              <label>Start Time</label>
              <input class="border p-2" type="datetime-local" name="startTime" [(ngModel)]="form.startTime" required />
              <label>End Time</label>
              <input class="border p-2" type="datetime-local" name="endTime" [(ngModel)]="form.endTime" required />
            </div>
            <label>Components</label>
            <div class="flex flex-col gap-1 max-h-48 overflow-auto border p-2">
              <label *ngFor="let c of components">
                <input type="checkbox" [value]="c.id" (change)="toggleComp(c.id, $event)"/> {{ c.code }} - {{ c.name }}
              </label>
            </div>
            <button mat-raised-button color="primary" class="mt-2" [disabled]="!f.form.valid" type="submit">Submit</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  private api = inject(ApiService);
  components: any[] = [];
  form: any = {
    changeId: '', team: '', registeredBy: '', description: '',
    startTime: '', endTime: '', componentIds: [] as number[]
  };

  ngOnInit() {
    this.api.getComponents().subscribe(c => this.components = c as any[]);
  }

  toggleComp(id: number, e: any) {
    if (e.target.checked) this.form.componentIds.push(id);
    else this.form.componentIds = this.form.componentIds.filter((x: number) => x !== id);
  }

  submit() {
    this.api.createChange(this.form).subscribe(() => alert('Created'));
  }
}


