import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { MedicalRecord } from '../../../core/models/medical-record';
import { Patient } from '../../../core/models/patient';
import { Doctor } from '../../../core/models/doctor';
import { Attachment } from '../../../core/models/common';
import { environment } from '../../../../environments/environment';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, FormDirective, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-medical-records-edit',
  templateUrl: './medical-records-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, FormControlDirective, ButtonDirective]
})
export class MedicalRecordsEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: string | null = null;
  patients = signal<Patient[]>([]);
  doctors = signal<Doctor[]>([]);
  attachments = signal<Attachment[]>([]);

  form = this.fb.group({
    patient_id: ['', Validators.required],
    doctor_id: ['', Validators.required],
    record_number: ['', Validators.required],
    subjective: ['', Validators.required],
    objective: ['', Validators.required],
    assessment: ['', Validators.required],
    plan: ['', Validators.required],
    signed: [false],
    signed_by: ['']
  });

  ngOnInit() {
    this.api.get<{ items: Patient[]; total: number }>('/patients').subscribe({ next: r => this.patients.set(r.items) });
    this.api.get<{ items: Doctor[]; total: number }>('/doctors').subscribe({ next: r => this.doctors.set(r.items) });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<MedicalRecord>(`/medical-records/${this.id}`).subscribe({ next: (rec) => {
        if (!rec) return;
        this.attachments.set(rec.attachments ?? []);
        this.form.patchValue({
          patient_id: rec.patient_id,
          doctor_id: rec.doctor_id,
          record_number: rec.record_number,
          subjective: rec.subjective,
          objective: rec.objective,
          assessment: rec.assessment,
          plan: rec.plan,
          signed: !!rec.signed_at,
          signed_by: rec.signed_by ?? ''
        });
      }});
    }
  }

  private validateFile(file: File) {
    const maxBytes = environment.upload.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) return `Ukuran file melebihi ${environment.upload.maxSizeMB}MB`;
    const allowed = environment.upload.allowedMimeTypes;
    const ok = allowed.some((type) => type.endsWith('/*') ? file.type.startsWith(type.slice(0, -1)) : file.type === type);
    return ok ? null : 'Tipe file tidak diizinkan';
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach(file => {
      const err = this.validateFile(file);
      if (err) { alert(err); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const payload = { fileName: file.name, mimeType: file.type, size: file.size, dataUrl };
        this.api.post<Attachment>('/files', payload).subscribe({ next: att => this.attachments.set([...this.attachments(), att]) });
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeAttachment(id: string) {
    this.attachments.set(this.attachments().filter(a => a.id !== id));
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload: Partial<MedicalRecord> = {
      patient_id: v.patient_id!,
      doctor_id: v.doctor_id!,
      record_number: v.record_number!,
      subjective: v.subjective!,
      objective: v.objective!,
      assessment: v.assessment!,
      plan: v.plan!,
      attachments: this.attachments(),
      signed_by: v.signed ? (v.signed_by || 'Dokter') : undefined,
      signed_at: v.signed ? new Date().toISOString() : undefined
    };

    if (this.id) {
      this.api.put<MedicalRecord>(`/medical-records/${this.id}`, payload).subscribe({ next: () => this.router.navigate(['../'], { relativeTo: this.route }) });
    } else {
      this.api.post<MedicalRecord>('/medical-records', payload).subscribe({ next: () => this.router.navigate(['../'], { relativeTo: this.route }) });
    }
  }
}