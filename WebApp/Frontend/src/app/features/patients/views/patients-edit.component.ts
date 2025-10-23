import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Patient } from '../../../core/models/patient';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';

@Component({
  selector: 'app-patients-edit',
  templateUrl: './patients-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent, RowComponent, ColComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective]
})
export class PatientsEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: string | null = null;
  form = this.fb.group({
    full_name: ['', [Validators.required]],
    date_of_birth: ['', [Validators.required]],
    gender: ['Other', [Validators.required]],
    contact_number: [''],
    email: [''],
    address: [''],
    insurance_id: ['']
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Patient>(`/patients/${this.id}`).subscribe({ next: (p) => p && this.form.patchValue(p as any) });
    }
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    if (this.id) {
      this.api.put<Patient>(`/patients/${this.id}`, value).subscribe({ next: () => this.router.navigate(['../'], { relativeTo: this.route }) });
    } else {
      this.api.post<Patient>('/patients', value).subscribe({ next: () => this.router.navigate(['../'], { relativeTo: this.route }) });
    }
  }
}