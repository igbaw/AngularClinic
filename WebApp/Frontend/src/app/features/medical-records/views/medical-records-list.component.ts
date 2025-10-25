import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { MedicalRecord } from '../../../core/models/medical-record';
import { Patient } from '../../../core/models/patient';
import { Doctor } from '../../../core/models/doctor';
import { PagedResult } from '../../../core/models/common';
import { FormsModule } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TableDirective, FormSelectDirective } from '@coreui/angular';

@Component({
  selector: 'app-medical-records-list',
  templateUrl: './medical-records-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormSelectDirective, TableDirective, ButtonDirective]
})
export class MedicalRecordsListComponent implements OnInit {
  private api = inject(ApiService);

  patientId: string = '';
  items = signal<MedicalRecord[]>([]);
  patients = signal<Patient[]>([]);
  doctors = signal<Doctor[]>([]);

  ngOnInit() {
    this.api.get<PagedResult<Patient>>('/patients').subscribe({ next: r => this.patients.set(r.items) });
    this.api.get<PagedResult<Doctor>>('/doctors').subscribe({ next: r => this.doctors.set(r.items) });
    this.load();
  }

  load() {
    const params = this.patientId ? { patientId: this.patientId } : undefined;
    this.api.get<PagedResult<MedicalRecord>>('/medical-records', params).subscribe({ next: r => this.items.set(r.items) });
  }

  patientName(id: string) { return this.patients().find(p => p.id === id)?.fullName ?? 'Pasien'; }
  doctorName(id: string) { return this.doctors().find(d => d.id === id)?.fullName ?? 'Dokter'; }
}