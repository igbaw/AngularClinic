import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Patient } from '../../../core/models/patient';
import { Doctor } from '../../../core/models/doctor';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-appointments-calendar',
  templateUrl: './appointments-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective]
})
export class AppointmentsCalendarComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  patients = signal<Patient[]>([]);
  doctors = signal<Doctor[]>([]);
  appointments = signal<Appointment[]>([]);
  selectedId = signal<string | null>(null);

  form = this.fb.group({
    patient_id: ['', Validators.required],
    doctor_id: ['', Validators.required],
    appointment_date: ['', Validators.required],
    status: ['Pending' as AppointmentStatus, Validators.required],
    notes: ['']
  });

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    slotDuration: { minutes: environment.slotMinutes },
    allDaySlot: false,
    selectable: true,
    selectMirror: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    select: (info) => {
      // Pre-fill form with selected time
      this.selectedId.set(null);
      this.form.patchValue({ appointment_date: info.startStr });
    },
    eventClick: (arg) => {
      const id = arg.event.id;
      const a = this.appointments().find(x => x.id === id);
      if (a) {
        this.selectedId.set(a.id);
        this.form.patchValue({
          patient_id: a.patient_id,
          doctor_id: a.doctor_id,
          appointment_date: a.appointment_date.substring(0,16),
          status: a.status,
          notes: a.notes ?? ''
        });
      }
    },
    events: () => this.toEvents()
  };

  ngOnInit() {
    this.loadLookups();
    this.loadAppointments();
  }

  private loadLookups() {
    this.api.get<{ items: Patient[]; total: number }>('/patients').subscribe({ next: res => this.patients.set(res.items) });
    this.api.get<{ items: Doctor[]; total: number }>('/doctors').subscribe({ next: res => this.doctors.set(res.items) });
  }

  private loadAppointments() {
    this.api.get<{ items: Appointment[]; total: number }>('/appointments').subscribe({
      next: res => this.appointments.set(res.items)
    });
  }

  toEvents(): EventInput[] {
    return this.appointments().map(a => ({
      id: a.id,
      title: `${this.patientName(a.patient_id)} — ${this.doctorName(a.doctor_id)}`,
      start: a.appointment_date,
      end: this.computeEnd(a.appointment_date),
      color: a.status === 'Cancelled' ? '#dc3545' : a.status === 'Pending' ? '#ffc107' : '#198754'
    }));
  }

  private computeEnd(startIso: string) {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + environment.slotMinutes * 60000);
    return end.toISOString();
  }

  patientName(id: string) { return this.patients().find(p => p.id === id)?.full_name ?? 'Pasien'; }
  doctorName(id: string) { return this.doctors().find(d => d.id === id)?.full_name ?? 'Dokter'; }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const payload: Partial<Appointment> = {
      patient_id: value.patient_id!,
      doctor_id: value.doctor_id!,
      appointment_date: value.appointment_date!,
      status: value.status!,
      notes: value.notes || undefined
    };

    const id = this.selectedId();
    if (id) {
      this.api.put<Appointment>(`/appointments/${id}`, payload).subscribe({ next: () => this.afterSave() });
    } else {
      this.api.post<Appointment>('/appointments', payload).subscribe({ next: () => this.afterSave() });
    }
  }

  delete() {
    const id = this.selectedId();
    if (!id) return;
    if (!confirm('Hapus janji temu ini?')) return;
    this.api.delete(`/appointments/${id}`).subscribe({ next: () => this.afterSave(true) });
  }

  clearForm() {
    this.selectedId.set(null);
    this.form.reset({ status: 'Pending' });
  }

  private afterSave(clearOnly = false) {
    if (!clearOnly) this.clearForm(); else this.clearForm();
    this.loadAppointments();
  }
}