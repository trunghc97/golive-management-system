import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 max-w-xl">
      <h2 class="text-lg font-semibold mb-3">Register Change</h2>
      <form (ngSubmit)="submit()" #f="ngForm" class="grid gap-2">
        <input class="border p-2" name="changeId" [(ngModel)]="form.changeId" placeholder="Change ID" required />
        <input class="border p-2" name="team" [(ngModel)]="form.team" placeholder="Team" required />
        <input class="border p-2" name="registeredBy" [(ngModel)]="form.registeredBy" placeholder="Registered By" required />
        <textarea class="border p-2" name="description" [(ngModel)]="form.description" placeholder="Description"></textarea>
        <label>Start Time</label>
        <input class="border p-2" type="datetime-local" name="startTime" [(ngModel)]="form.startTime" required />
        <label>End Time</label>
        <input class="border p-2" type="datetime-local" name="endTime" [(ngModel)]="form.endTime" required />
        <label>Components</label>
        <div class="flex flex-col gap-1 max-h-48 overflow-auto border p-2">
          <label *ngFor="let c of components">
            <input type="checkbox" [value]="c.id" (change)="toggleComp(c.id, $event)"/> {{ c.code }} - {{ c.name }}
          </label>
        </div>
        <button class="border px-3 py-1 mt-2" [disabled]="!f.form.valid" type="submit">Submit</button>
      </form>
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


