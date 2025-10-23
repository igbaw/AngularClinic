import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Patient } from '../../../core/models/patient';
import { PagedResult } from '../../../core/models/common';
import { FormsModule } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TableDirective } from '@coreui/angular';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, TableDirective, ButtonDirective]
})
export class PatientsListComponent implements OnInit {
  private api = inject(ApiService);

  q = signal('');
  items = signal<Patient[]>([]);
  loading = signal(false);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const query = this.q();
    this.api.get<PagedResult<Patient>>('/patients', query ? { q: query } : undefined).subscribe({
      next: (res) => this.items.set(res.items),
      complete: () => this.loading.set(false)
    });
  }

  delete(id: string) {
    if (!confirm('Hapus pasien ini?')) return;
    this.api.delete(`/patients/${id}`).subscribe({ next: () => this.load() });
  }
}