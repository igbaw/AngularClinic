import { ChangeDetectionStrategy, Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Patient } from '../../../core/models/patient';
import { Doctor } from '../../../core/models/doctor';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, FormSelectDirective } from '@coreui/angular';
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
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, FormSelectDirective]
})
export class AppointmentsCalendarComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  patients = signal<Patient[]>([]);
  doctors = signal<Doctor[]>([]);
  appointments = signal<Appointment[]>([]);
  selectedId = signal<string | null>(null);

  form = this.fb.group({
    patientId: ['', Validators.required],
    doctorId: ['', Validators.required],
    appointmentDate: ['', Validators.required],
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
      this.form.patchValue({ appointmentDate: this.toLocalDateTimeInput(info.start) });
      this.cdr.markForCheck();
    },
    eventClick: (arg) => {
      const id = arg.event.id;
      const a = this.appointments().find(x => x.id === id);
      if (a) {
        this.selectedId.set(a.id);
        this.form.patchValue({
          patientId: a.patientId,
          doctorId: a.doctorId,
          appointmentDate: this.toLocalDateTimeInput(a.appointmentDate),
          status: a.status,
          notes: a.notes ?? ''
        });
        this.cdr.markForCheck();
      }
    },
    events: []
  };

  private updateCalendarEvents() {
    this.calendarOptions = { ...this.calendarOptions, events: this.toEvents() };
    this.cdr.markForCheck();
  }

  private toLocalDateTimeInput(value: string | Date): string {
    const d = (typeof value === 'string') ? new Date(value) : value;
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

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
      next: res => {
        this.appointments.set(res.items);
        this.updateCalendarEvents();
      }
    });
  }

  toEvents(): EventInput[] {
    return this.appointments().map(a => ({
      id: a.id,
      title: `${this.patientName(a.patientId)} — ${this.doctorName(a.doctorId)}`,
      start: a.appointmentDate,
      end: this.computeEnd(a.appointmentDate),
      color: a.status === 'Cancelled' ? '#dc3545' : a.status === 'Pending' ? '#ffc107' : '#198754'
    }));
  }

  private computeEnd(startIso: string) {
    const start = new Date(startIso);
    const end = new Date(start.getTime() + environment.slotMinutes * 60000);
    return end.toISOString();
  }

  patientName(id: string) { return this.patients().find(p => p.id === id)?.fullName ?? 'Pasien'; }
  doctorName(id: string) { return this.doctors().find(d => d.id === id)?.fullName ?? 'Dokter'; }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const payload: Partial<Appointment> = {
      patientId: value.patientId!,
      doctorId: value.doctorId!,
      appointmentDate: value.appointmentDate!,
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
    this.updateCalendarEvents();
  }
}