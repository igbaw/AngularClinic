import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Doctor } from '../../../core/models/doctor';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-doctors-edit',
  templateUrl: './doctors-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective]
})
export class DoctorsEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: string | null = null;
  form = this.fb.group({
    full_name: ['', [Validators.required]],
    specialization: [''],
    license_number: ['', [Validators.required]],
    sip: ['', [Validators.required]],
    contact_number: [''],
    email: [''],
    availability: [''] // JSON string for MVP
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Doctor>(`/doctors/${this.id}`).subscribe({ next: (d) => d && this.form.patchValue({
        full_name: d.full_name,
        specialization: d.specialization ?? '',
        license_number: d.license_number,
        sip: d.sip,
        contact_number: d.contact_number ?? '',
        email: d.email ?? '',
        availability: d.availability ? JSON.stringify(d.availability) : ''
      }) });
    }
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const payload: Partial<Doctor> = {
      full_name: value.full_name!,
      specialization: value.specialization || undefined,
      license_number: value.license_number!,
      sip: value.sip!,
      contact_number: value.contact_number || undefined,
      email: value.email || undefined,
      availability: (() => { try { return value.availability ? JSON.parse(value.availability) : undefined; } catch { return undefined; } })()
    };

    if (this.id) {
      this.api.put<Doctor>(`/doctors/${this.id}`, payload).subscribe({ next: () => this.router.navigate(['../'], { relativeTo: this.route }) });
    } else {
      this.api.post<Doctor>('/doctors', payload).subscribe({ next: () => this.router.navigate(['../'], { relativeTo: this.route }) });
    }
  }
}