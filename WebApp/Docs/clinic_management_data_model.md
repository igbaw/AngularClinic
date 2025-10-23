
# Universal Data Model for Clinic Management System

## Patient
Represents individuals receiving medical services.

| **Field Name**     | **Type**         | **Description**                                 | **Constraints**                  |
|---------------------|------------------|-------------------------------------------------|----------------------------------|
| `id`               | UUID             | Unique identifier for the patient.             | Primary Key                      |
| `full_name`        | String           | Full name of the patient.                      | Required                         |
| `date_of_birth`    | Date             | Date of birth of the patient.                  | Required                         |
| `gender`           | Enum (Male, Female, Other) | Gender of the patient.                     | Required                         |
| `contact_number`   | String           | Phone number for communication.                | Optional                         |
| `email`            | String           | Email address for communication.               | Optional                         |
| `address`          | String           | Residential address.                           | Optional                         |
| `insurance_id`     | String           | Insurance or BPJS number.                      | Required for insured patients    |
| `created_at`       | DateTime         | Record creation timestamp.                     | Auto-generated                   |
| `updated_at`       | DateTime         | Last update timestamp.                         | Auto-generated                   |

---

## Doctor
Represents healthcare providers.

| **Field Name**       | **Type**      | **Description**                             | **Constraints**         |
|-----------------------|---------------|---------------------------------------------|-------------------------|
| `id`                 | UUID          | Unique identifier for the doctor.           | Primary Key             |
| `full_name`          | String        | Full name of the doctor.                    | Required                |
| `specialization`     | String        | Area of expertise or specialty.             | Optional                |
| `license_number`     | String        | Official license number.                    | Required                |
| `sip`                | String        | Surat Izin Praktik (practice permit).       | Required                |
| `contact_number`     | String        | Phone number for communication.             | Optional                |
| `email`              | String        | Email address for communication.            | Optional                |
| `availability`       | JSON          | Weekly availability schedule.               | Optional                |
| `created_at`         | DateTime      | Record creation timestamp.                  | Auto-generated          |
| `updated_at`         | DateTime      | Last update timestamp.                      | Auto-generated          |

---

## Appointment
Represents scheduled consultations between patients and doctors.

| **Field Name**       | **Type**      | **Description**                             | **Constraints**         |
|-----------------------|---------------|---------------------------------------------|-------------------------|
| `id`                 | UUID          | Unique identifier for the appointment.      | Primary Key             |
| `patient_id`         | UUID          | Reference to the patient.                   | Foreign Key (Patient)   |
| `doctor_id`          | UUID          | Reference to the doctor.                    | Foreign Key (Doctor)    |
| `appointment_date`   | DateTime      | Date and time of the appointment.           | Required                |
| `status`             | Enum (Pending, Confirmed, Cancelled) | Current status of the appointment. | Required                |
| `notes`              | Text          | Additional notes for the appointment.       | Optional                |
| `created_at`         | DateTime      | Record creation timestamp.                  | Auto-generated          |
| `updated_at`         | DateTime      | Last update timestamp.                      | Auto-generated          |

---

## MedicalRecord
Represents patient health records.

| **Field Name**       | **Type**      | **Description**                             | **Constraints**         |
|-----------------------|---------------|---------------------------------------------|-------------------------|
| `id`                 | UUID          | Unique identifier for the medical record.   | Primary Key             |
| `patient_id`         | UUID          | Reference to the patient.                   | Foreign Key (Patient)   |
| `doctor_id`          | UUID          | Reference to the doctor.                    | Foreign Key (Doctor)    |
| `record_number`      | String        | Unique medical record number.               | Required                |
| `subjective`         | Text          | SOAP - Subjective (patient's symptoms).     | Required                |
| `objective`          | Text          | SOAP - Objective (clinical observations).   | Required                |
| `assessment`         | Text          | SOAP - Assessment (diagnosis/impressions).  | Required                |
| `plan`               | Text          | SOAP - Plan (treatment and next steps).     | Required                |
| `attachments`        | List<String>  | URLs or paths to attached files (e.g., imaging). | Optional          |
| `created_at`         | DateTime      | Record creation timestamp.                  | Auto-generated          |
| `updated_at`         | DateTime      | Last update timestamp.                      | Auto-generated          |
