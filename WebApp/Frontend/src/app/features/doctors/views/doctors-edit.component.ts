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
    fullName: ['', [Validators.required]],
    specialization: [''],
    licenseNumber: ['', [Validators.required]],
    sip: ['', [Validators.required]],
    contactNumber: [''],
    email: [''],
    availability: [''] // JSON string for MVP
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Doctor>(`/doctors/${this.id}`).subscribe({ next: (d) => d && this.form.patchValue({
        fullName: d.fullName,
        specialization: d.specialization ?? '',
        licenseNumber: d.licenseNumber,
        sip: d.sip,
        contactNumber: d.contactNumber ?? '',
        email: d.email ?? '',
        availability: d.availability ? JSON.stringify(d.availability) : ''
      }) });
    }
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const payload: Partial<Doctor> = {
      fullName: value.fullName!,
      specialization: value.specialization || undefined,
      licenseNumber: value.licenseNumber!,
      sip: value.sip!,
      contactNumber: value.contactNumber || undefined,
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