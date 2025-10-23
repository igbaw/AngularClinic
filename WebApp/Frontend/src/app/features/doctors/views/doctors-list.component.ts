import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TableDirective } from '@coreui/angular';
import { Doctor } from '../../../core/models/doctor';
import { PagedResult } from '../../../core/models/common';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, TableDirective, ButtonDirective]
})
export class DoctorsListComponent implements OnInit {
  private api = inject(ApiService);

  q: string = '';
  items = signal<Doctor[]>([]);
  loading = signal(false);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const query = this.q;
    this.api.get<PagedResult<Doctor>>('/doctors', query ? { q: query } : undefined).subscribe({
      next: (res) => this.items.set(res.items),
      complete: () => this.loading.set(false)
    });
  }

  delete(id: string) {
    if (!confirm('Hapus dokter ini?')) return;
    this.api.delete(`/doctors/${id}`).subscribe({ next: () => this.load() });
  }
}