import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CustomerService } from '../../../core/services/customer.service';
import { BirthRateByMonthYear, CustomerIndicators } from '../../../models/customer-indicators.model';

@Component({
  selector: 'app-indicators-dashboard',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './indicators-dashboard.html',
  styleUrl: './indicators-dashboard.scss'
})
export class IndicatorsDashboard implements OnInit {
  private readonly customerService = inject(CustomerService);

  protected readonly indicators = signal<CustomerIndicators | null>(null);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly rows = computed(() => this.indicators()?.natalidadPorMesAnio ?? []);

  protected readonly chartData = computed<ChartData<'bar', number[], string>>(() => {
    const rows = this.rows();
    return {
      labels: rows.map((row) => this.formatMonthYear(row)),
      datasets: [
        {
          label: 'Cantidad de clientes',
          data: rows.map((row) => row.cantidad)
        }
      ]
    };
  });

  protected readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Cantidad de clientes'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  ngOnInit(): void {
    this.loadIndicators();
  }

  protected formatMonthYear(item: BirthRateByMonthYear): string {
    const month = String(item.mes).padStart(2, '0');
    const year = String(item.anio).padStart(4, '0');
    return `${month}/${year}`;
  }

  protected formatRate(tasaNatalidad: number): string {
    return `${tasaNatalidad.toFixed(2)}%`;
  }

  private loadIndicators(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.customerService.getIndicators().subscribe({
      next: (indicators) => {
        this.indicators.set(indicators);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los indicadores.');
        this.loading.set(false);
      }
    });
  }
}
