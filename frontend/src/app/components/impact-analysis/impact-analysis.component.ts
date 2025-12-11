import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ServiceCatalogService } from '../../services/service-catalog.service';
import { Service, ServiceDependency } from '../../models/models';
import cytoscape from 'cytoscape';

@Component({
    selector: 'app-impact-analysis',
    standalone: true,
    imports: [CommonModule, MatListModule, MatCardModule],
    template: `
    <div class="impact-container">
      <h1>Dependency Graph & Impact Analysis</h1>

      <div class="content-layout">
        <mat-card class="service-list">
          <h3>Services</h3>
          <mat-selection-list [multiple]="false" (selectionChange)="onServiceSelect($event)">
            <mat-list-option *ngFor="let service of services" [value]="service">
              {{ service.code }} - {{ service.name }}
            </mat-list-option>
          </mat-selection-list>
        </mat-card>

        <div class="graph-container">
          <div #cyContainer class="cy-container"></div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .impact-container {
      max-width: 1600px;
      margin: 0 auto;
      height: calc(100vh - 150px);
      display: flex;
      flex-direction: column;
    }

    h1 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .content-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 1.5rem;
      flex: 1;
      overflow: hidden;
    }

    .service-list {
      padding: 1rem;
      overflow-y: auto;
    }

    .graph-container {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .cy-container {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
  `]
})
export class ImpactAnalysisComponent implements OnInit, AfterViewInit {
    @ViewChild('cyContainer', { static: false }) cyContainer!: ElementRef;

    services: Service[] = [];
    dependencies: ServiceDependency[] = [];
    cy: any;

    constructor(private serviceCatalogService: ServiceCatalogService) { }

    ngOnInit() {
        this.loadServices();
    }

    ngAfterViewInit() {
        this.initGraph();
    }

    loadServices() {
        this.serviceCatalogService.getAllServices().subscribe({
            next: (data) => {
                this.services = data;
            },
            error: (err) => console.error('Error loading services:', err)
        });
    }

    initGraph() {
        this.cy = cytoscape({
            container: this.cyContainer.nativeElement,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'background-color': '#3f51b5',
                        'color': '#fff',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': '12px',
                        'width': '60px',
                        'height': '60px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                },
                {
                    selector: '.highlighted',
                    style: {
                        'background-color': '#ff9800',
                        'line-color': '#ff9800',
                        'target-arrow-color': '#ff9800'
                    }
                }
            ],
            layout: {
                name: 'cose',
                animate: true,
                animationDuration: 500
            }
        });
    }

    onServiceSelect(event: any) {
        const selectedService = event.options[0]?.value;
        if (selectedService) {
            this.loadDependencies(selectedService.id);
        }
    }

    loadDependencies(serviceId: number) {
        this.serviceCatalogService.getServiceDependencies(serviceId).subscribe({
            next: (deps) => {
                this.dependencies = deps;
                this.renderGraph();
            },
            error: (err) => console.error('Error loading dependencies:', err)
        });
    }

    renderGraph() {
        if (!this.cy) return;

        this.cy.elements().remove();

        const nodes = new Set<string>();
        const edges: any[] = [];

        this.dependencies.forEach(dep => {
            nodes.add(dep.fromServiceCode);
            nodes.add(dep.toServiceCode);
            edges.push({
                data: {
                    id: `${dep.fromServiceCode}-${dep.toServiceCode}`,
                    source: dep.fromServiceCode,
                    target: dep.toServiceCode
                }
            });
        });

        const elements = [
            ...Array.from(nodes).map(code => ({
                data: { id: code, label: code }
            })),
            ...edges
        ];

        this.cy.add(elements);
        this.cy.layout({ name: 'cose', animate: true }).run();
    }
}
