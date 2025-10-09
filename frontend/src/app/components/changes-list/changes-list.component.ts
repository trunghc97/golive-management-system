import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ChangeService } from '../../services/change.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-changes-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterModule
  ],
  template: `
    <div class="p-4">
      <mat-card class="shadow-md">
        <mat-card-title><mat-icon class="mr-2">list</mat-icon> Danh sách Change Đăng ký Golive</mat-card-title>
        <mat-card-content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 items-end">
            <mat-form-field appearance="outline">
              <mat-label>Tìm kiếm</mat-label>
              <input matInput placeholder="changeId, team, user" (keyup.enter)="reload()" [(ngModel)]="q" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Trạng thái</mat-label>
              <mat-select [(ngModel)]="status" (selectionChange)="reload()">
                <mat-option [value]="">Tất cả</mat-option>
                <mat-option value="PENDING">Pending</mat-option>
                <mat-option value="IN_PROGRESS">In Progress</mat-option>
                <mat-option value="SUCCESS">Success</mat-option>
                <mat-option value="ROLLBACK_PARTIAL">Rollback Partial</mat-option>
                <mat-option value="ROLLBACK_ALL">Rollback All</mat-option>
              </mat-select>
            </mat-form-field>
            <div class="flex gap-2">
              <button mat-flat-button color="primary" (click)="reload()">Lọc</button>
              <button mat-stroked-button (click)="clearFilter()">Xóa lọc</button>
            </div>
          </div>

          <table mat-table [dataSource]="items()" matSort (matSortChange)="onSort($event)" class="w-full mb-2 rounded overflow-hidden">
            <ng-container matColumnDef="changeId">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Change ID </th>
              <td mat-cell *matCellDef="let e" [matTooltip]="e.description || ''"> {{ e.changeId }} </td>
            </ng-container>
            <ng-container matColumnDef="team">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Team </th>
              <td mat-cell *matCellDef="let e"> {{ e.team }} </td>
            </ng-container>
            <ng-container matColumnDef="registeredBy">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Registered By </th>
              <td mat-cell *matCellDef="let e"> {{ e.registeredBy }} </td>
            </ng-container>
            <ng-container matColumnDef="goliveDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Golive Date </th>
              <td mat-cell *matCellDef="let e"> {{ e.startTime | date:'yyyy-MM-dd' }} </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
              <td mat-cell *matCellDef="let e"> {{ e.status }} </td>
            </ng-container>
            <ng-container matColumnDef="conflict">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Conflict </th>
              <td mat-cell *matCellDef="let e"> {{ e.conflict ? 'Yes' : 'No' }} </td>
            </ng-container>
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef> Action </th>
              <td mat-cell *matCellDef="let e">
                <div class="flex items-center gap-1">
                  <button mat-icon-button color="primary" [routerLink]="['/history', e.changeId]" matTooltip="Lịch sử">
                    <mat-icon>history</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" [routerLink]="['/rollback', e.id]" matTooltip="Rollback">
                    <mat-icon>undo</mat-icon>
                  </button>
                  <button mat-icon-button (click)="openDetail(e)" matTooltip="Chi tiết">
                    <mat-icon>info</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayed"></tr>
            <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
          </table>

          <mat-paginator [length]="total()" [pageIndex]="pageIndex" [pageSize]="pageSize"
                          [pageSizeOptions]="[10,20,50]" (page)="onPage($event)">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ChangesListComponent implements OnInit {
  private api = inject(ChangeService);
  private dialog = inject(MatDialog);
  items = signal<any[]>([]);
  total = signal<number>(0);
  displayed = ['changeId','team','registeredBy','goliveDate','status','conflict','action'];

  q = '';
  status = '';
  pageIndex = 0;
  pageSize = 20;
  sortActive: string | null = null;
  sortDirection: 'asc' | 'desc' | '' = '';

  ngOnInit() { this.reload(); }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.reload();
  }

  clearFilter() {
    this.q = '';
    this.status = '';
    this.pageIndex = 0;
    this.reload();
  }

  reload() {
    this.api.search({ search: this.q || undefined, status: this.status || undefined, page: this.pageIndex, size: this.pageSize })
      .subscribe((res: any) => {
        const content = res.content || [];
        this.items.set(this.applySort(content));
        this.total.set(res.totalElements || 0);
      });
  }

  onSort(sort: Sort) {
    this.sortActive = sort.active || null;
    this.sortDirection = (sort.direction as any) || '';
    this.items.set(this.applySort(this.items()));
  }

  private applySort(data: any[]): any[] {
    if (!this.sortActive || !this.sortDirection) return data;
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = a[this.sortActive!];
      const bv = b[this.sortActive!];
      const ax = av instanceof Date ? av.getTime() : (typeof av === 'string' ? av : JSON.stringify(av));
      const bx = bv instanceof Date ? bv.getTime() : (typeof bv === 'string' ? bv : JSON.stringify(bv));
      return ax > bx ? dir : ax < bx ? -dir : 0;
    });
  }

  openDetail(row: any) {
    this.dialog.open(ChangeDetailDialog, { data: row, width: '520px' });
  }
}

import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-change-detail-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, RouterModule],
  template: `
    <h2 class="text-lg font-semibold mb-2">Chi tiết Change</h2>
    <div class="text-sm space-y-1">
      <div><b>Change ID:</b> {{ data.changeId }}</div>
      <div><b>Team:</b> {{ data.team }}</div>
      <div><b>Registered By:</b> {{ data.registeredBy }}</div>
      <div><b>Status:</b> {{ data.status }}</div>
      <div><b>Start:</b> {{ data.startTime | date:'yyyy-MM-dd HH:mm' }}</div>
      <div><b>End:</b> {{ data.endTime | date:'yyyy-MM-dd HH:mm' }}</div>
      <div><b>Conflict:</b> {{ data.conflict ? 'Yes' : 'No' }}</div>
      <div><b>Description:</b> {{ data.description || '-' }}</div>
    </div>
    <div class="mt-4 flex justify-end gap-2">
      <a mat-button color="primary" [routerLink]="['/history', data.changeId]">Lịch sử</a>
      <a mat-button color="warn" [routerLink]="['/rollback', data.id]">Rollback</a>
      <button mat-button mat-dialog-close>Đóng</button>
    </div>
  `
})
export class ChangeDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}


