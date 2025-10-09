import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>
            <span class="title-row">
              <mat-icon color="primary">playlist_add</mat-icon>
              Register Change
            </span>
          </mat-card-title>
          <mat-card-subtitle>Điền thông tin thay đổi và chọn components</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="submit()" #f="ngForm" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Change ID</mat-label>
              <input matInput name="changeId" [(ngModel)]="form.changeId" #changeId="ngModel" required />
              <mat-icon matSuffix>tag</mat-icon>
              <mat-hint>Ví dụ: CHG-12345</mat-hint>
              <mat-error *ngIf="changeId.invalid && changeId.touched">Bắt buộc</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Team</mat-label>
              <input matInput name="team" [(ngModel)]="form.team" #team="ngModel" required />
              <mat-icon matSuffix>groups</mat-icon>
              <mat-error *ngIf="team.invalid && team.touched">Bắt buộc</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Registered By</mat-label>
              <input matInput name="registeredBy" [(ngModel)]="form.registeredBy" #registeredBy="ngModel" required />
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registeredBy.invalid && registeredBy.touched">Bắt buộc</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Description</mat-label>
              <textarea matInput name="description" [(ngModel)]="form.description" rows="3" placeholder="Mô tả ngắn gọn"></textarea>
            </mat-form-field>

            <div class="time-grid full">
              <mat-form-field appearance="outline">
                <mat-label>Start Time</mat-label>
                <input matInput type="datetime-local" name="startTime" [(ngModel)]="form.startTime" #startTime="ngModel" required />
                <mat-icon matSuffix>schedule</mat-icon>
                <mat-error *ngIf="startTime.invalid && startTime.touched">Bắt buộc</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>End Time</mat-label>
                <input matInput type="datetime-local" name="endTime" [(ngModel)]="form.endTime" #endTime="ngModel" required />
                <mat-icon matSuffix>event</mat-icon>
                <mat-error *ngIf="endTime.invalid && endTime.touched">Bắt buộc</mat-error>
              </mat-form-field>
            </div>

            <div class="components-section full">
              <div class="section-header">
                <span class="section-title">
                  <mat-icon>view_list</mat-icon>
                  Components
                </span>
                <span class="section-actions">
                  <button type="button" mat-stroked-button color="primary" (click)="selectAll()">Select All</button>
                  <button type="button" mat-button (click)="clearAll()">Clear</button>
                </span>
              </div>

              <mat-form-field appearance="outline" class="full">
                <mat-label>Tìm component</mat-label>
                <input matInput [(ngModel)]="componentFilter" name="componentFilter" placeholder="Nhập mã hoặc tên" />
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-selection-list [(ngModel)]="selectedComponents" name="componentSelection" [multiple]="true" (ngModelChange)="onSelectedChange($event)" class="components-list">
                <mat-list-option *ngFor="let c of filteredComponents" [value]="c.id">
                  {{ c.code }} — {{ c.name }}
                </mat-list-option>
              </mat-selection-list>
            </div>

            <div class="actions full">
              <button mat-stroked-button type="button" (click)="reset(f)">Reset</button>
              <button mat-raised-button color="primary" [disabled]="f.form.invalid || submitting" type="submit">
                <mat-icon>save</mat-icon>
                Submit
              </button>
            </div>

            <mat-progress-bar *ngIf="submitting" mode="indeterminate"></mat-progress-bar>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `.register-container { max-width: 880px; margin: 24px auto; padding: 0 16px; }`,
    `.register-card { overflow: hidden; }`,
    `.title-row { display: inline-flex; align-items: center; gap: 8px; }`,
    `.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }`,
    `.full { grid-column: 1 / -1; }`,
    `.time-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }`,
    `.components-section { display: grid; gap: 12px; }`,
    `.section-header { display: flex; align-items: center; justify-content: space-between; }`,
    `.section-title { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; }`,
    `.section-actions { display: inline-flex; gap: 8px; }`,
    `.components-list { max-height: 240px; overflow: auto; border: 1px solid rgba(0,0,0,0.12); border-radius: 4px; }
    `
  ]
})
export class RegisterComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  components: ComponentItem[] = [];
  componentFilter = '';
  selectedComponents: number[] = [];
  submitting = false;
  form: {
    changeId: string; team: string; registeredBy: string; description: string;
    startTime: string; endTime: string; componentIds: number[];
  } = {
    changeId: '', team: '', registeredBy: '', description: '',
    startTime: '', endTime: '', componentIds: [] as number[]
  };

  ngOnInit() {
    this.api.getComponents().subscribe(c => this.components = c as any[]);
  }

  get filteredComponents(): ComponentItem[] {
    const q = (this.componentFilter || '').toLowerCase().trim();
    if (!q) return this.components;
    return this.components.filter((c: ComponentItem) =>
      (c.code || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q)
    );
  }

  onSelectedChange(ids: number[]) {
    this.form.componentIds = Array.isArray(ids) ? ids : [];
  }

  selectAll() {
    this.selectedComponents = this.filteredComponents.map((c: ComponentItem) => c.id);
    this.form.componentIds = [...this.selectedComponents];
  }

  clearAll() {
    this.selectedComponents = [];
    this.form.componentIds = [];
  }

  reset(f: { resetForm: () => void }) {
    f.resetForm();
    this.selectedComponents = [];
    this.componentFilter = '';
    this.submitting = false;
  }

  submit() {
    this.submitting = true;
    this.api.createChange(this.form).subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open('Tạo thay đổi thành công', 'Đóng', { duration: 2500 });
      },
      error: (err: unknown) => {
        this.submitting = false;
        this.snackBar.open('Có lỗi xảy ra. Vui lòng thử lại', 'Đóng', { duration: 3000 });
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
  }
}

interface ComponentItem {
  id: number;
  code: string;
  name: string;
}


