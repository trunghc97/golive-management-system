import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-timeline-node',
  imports: [CommonModule],
  template: `
    <div
      class="timeline-node absolute w-3 h-3 rounded-full cursor-pointer"
      [style.left]="calcPosition(change.startTime)"
      [style.background-color]="getColor(change.status)"
      [style.border]="hasConflict ? '2px solid #e53935' : 'none'"
      [title]="tooltip(change)">
    </div>
  `
})
export class TimelineNodeComponent {
  @Input() change: any;
  @Input() timeRange!: { start: Date; end: Date };
  @Input() hasConflict = false;

  calcPosition(time: string): string {
    const start = this.timeRange.start.getTime();
    const end = this.timeRange.end.getTime();
    const current = new Date(time).getTime();
    const percent = ((current - start) / (end - start)) * 100;
    const clamped = Math.max(0, Math.min(100, percent));
    return clamped + '%';
  }

  getColor(status: string): string {
    if (this.hasConflict) return '#e53935';
    switch (status) {
      case 'SUCCESS': return '#43a047';
      case 'ROLLBACK_PARTIAL':
      case 'ROLLBACK_ALL': return '#fb8c00';
      case 'PENDING': return '#9e9e9e';
      default: return '#2196f3';
    }
  }

  tooltip(change: any): string {
    return `${change.changeId} (${change.team})\n${change.startTime} - ${change.endTime}\n${change.status}`;
  }
}
