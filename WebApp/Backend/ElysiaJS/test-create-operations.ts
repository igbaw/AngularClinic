// Comprehensive test for all Create operations
import { createApp } from "./src/app";

const app = createApp();

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    results.push({ name, passed: true });
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error:`, error instanceof Error ? error.message : String(error));
    results.push({ name, passed: false, error: error instanceof Error ? error.message : String(error) });
  }
}

// Store created IDs for cleanup and reference
let cookie = "";
let patientId = "";
let doctorId = "";
let appointmentId = "";
let medicalRecordId = "";
let recordNumber = "";

// Test 1: Login to get session cookie
await test("Login as admin", async () => {
  const res = await app.handle(
    new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "ChangeMe123!",
      }),
    })
  );
  
  if (res.status !== 200) {
    const body = await res.text();
    throw new Error(`Login failed with status ${res.status}: ${body}`);
  }
  
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const match = setCookie.match(/clinic_sess=([^;]+)/);
    if (match) cookie = match[1];
  }
  
  if (!cookie) {
    throw new Error("No cookie received from login");
  }
  
  console.log(`   Cookie obtained: ${cookie.substring(0, 20)}...`);
});

// Test 2: Create Patient
await test("Create Patient", async () => {
  const patientData = {
    full_name: "Test Patient",
    date_of_birth: "1990-01-15",
    gender: "Male",
    contact_number: "08123456789",
    email: "test.patient@example.com",
    address: "123 Test Street",
    insurance_id: "INS123456",
  };
  
  const res = await app.handle(
    new Request("http://localhost/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `clinic_sess=${cookie}`,
      },
      body: JSON.stringify(patientData),
    })
  );
  
  if (res.status !== 200) {
    const body = await res.text();
    throw new Error(`Create patient failed with status ${res.status}: ${body}`);
  }
  
  const result = await res.json();
  if (!result.id) {
    throw new Error("Patient created but no ID returned");
  }
  
  patientId = result.id;
  console.log(`   Patient created with ID: ${patientId}`);
});

// Test 3: Create Doctor
await test("Create Doctor", async () => {
  const doctorData = {
    full_name: "Dr. Test Doctor",
    specialization: "ENT Specialist",
    license_number: "LIC-TEST-001",
    sip: "SIP-TEST-001",
    contact_number: "08987654321",
    email: "test.doctor@example.com",
    availability: JSON.stringify({ monday: "09:00-17:00" }),
  };
  
  const res = await app.handle(
    new Request("http://localhost/api/doctors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `clinic_sess=${cookie}`,
      },
      body: JSON.stringify(doctorData),
    })
  );
  
  if (res.status !== 200) {
    const body = await res.text();
    throw new Error(`Create doctor failed with status ${res.status}: ${body}`);
  }
  
  const result = await res.json();
  if (!result.id) {
    throw new Error("Doctor created but no ID returned");
  }
  
  doctorId = result.id;
  console.log(`   Doctor created with ID: ${doctorId}`);
});

// Test 4: Create Appointment
await test("Create Appointment", async () => {
  if (!patientId || !doctorId) {
    throw new Error("Cannot create appointment - patient or doctor ID missing");
  }
  
  const appointmentData = {
    patient_id: patientId,
    doctor_id: doctorId,
    appointment_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: "Pending",
    notes: "Test appointment notes",
  };
  
  const res = await app.handle(
    new Request("http://localhost/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `clinic_sess=${cookie}`,
      },
      body: JSON.stringify(appointmentData),
    })
  );
  
  if (res.status !== 200) {
    const body = await res.text();
    throw new Error(`Create appointment failed with status ${res.status}: ${body}`);
  }
  
  const result = await res.json();
  if (!result.id) {
    throw new Error("Appointment created but no ID returned");
  }
  
  appointmentId = result.id;
  console.log(`   Appointment created with ID: ${appointmentId}`);
});

// Test 5: Generate Medical Record Number
await test("Generate Medical Record Number", async () => {
  const res = await app.handle(
    new Request("http://localhost/api/medical-records/generate-record-number", {
      method: "GET",
      headers: {
        Cookie: `clinic_sess=${cookie}`,
      },
    })
  );
  
  if (res.status !== 200) {
    const body = await res.text();
    throw new Error(`Generate record number failed with status ${res.status}: ${body}`);
  }
  
  const result = await res.json();
  if (!result.recordNumber) {
    throw new Error("No record number returned");
  }
  
  recordNumber = result.recordNumber;
  console.log(`   Record number generated: ${recordNumber}`);
});

// Test 6: Create Medical Record
await test("Create Medical Record", async () => {
  if (!patientId || !doctorId || !recordNumber) {
    throw new Error("Cannot create medical record - missing required data");
  }
  
  const medicalRecordData = {
    patientId: patientId,
    doctorId: doctorId,
    recordNumber: recordNumber,
    subjective: "Patient complains of ear pain and hearing difficulty",
    objective: "Examination shows inflammation in left ear canal",
    assessment: "Acute otitis externa (left ear)",
    plan: "Prescribed antibiotic ear drops, follow-up in 7 days",
  };
  
  const res = await app.handle(
    new Request("http://localhost/api/medical-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `clinic_sess=${cookie}`,
      },
      body: JSON.stringify(medicalRecordData),
    })
  );
  
  if (res.status !== 200) {
    const body = await res.text();
    throw new Error(`Create medical record failed with status ${res.status}: ${body}`);
  }
  
  const result = await res.json();
  if (!result.id) {
    throw new Error("Medical record created but no ID returned");
  }
  
  medicalRecordId = result.id;
  console.log(`   Medical record created with ID: ${medicalRecordId}`);
});

// Test 7: Verify Patient Can Be Retrieved
await test("Verify Patient Retrieval", async () => {
  const res = await app.handle(
    new Request(`http://localhost/api/patients/${patientId}`, {
      headers: {
        Cookie: `clinic_sess=${cookie}`,
      },
    })
  );
  
  if (res.status !== 200) {
    throw new Error(`Failed to retrieve patient: ${res.status}`);
  }
  
  const patient = await res.json();
  if (patient.id !== patientId) {
    throw new Error("Retrieved patient ID doesn't match");
  }
  
  console.log(`   Patient verified: ${patient.full_name}`);
});

// Test 8: Verify Doctor Can Be Retrieved
await test("Verify Doctor Retrieval", async () => {
  const res = await app.handle(
    new Request(`http://localhost/api/doctors/${doctorId}`, {
      headers: {
        Cookie: `clinic_sess=${cookie}`,
      },
    })
  );
  
  if (res.status !== 200) {
    throw new Error(`Failed to retrieve doctor: ${res.status}`);
  }
  
  const doctor = await res.json();
  if (doctor.id !== doctorId) {
    throw new Error("Retrieved doctor ID doesn't match");
  }
  
  console.log(`   Doctor verified: ${doctor.full_name}`);
});

// Test 9: Verify Appointment Can Be Retrieved
await test("Verify Appointment Retrieval", async () => {
  const res = await app.handle(
    new Request(`http://localhost/api/appointments/${appointmentId}`, {
      headers: {
        Cookie: `clinic_sess=${cookie}`,
      },
    })
  );
  
  if (res.status !== 200) {
    throw new Error(`Failed to retrieve appointment: ${res.status}`);
  }
  
  const appointment = await res.json();
  if (appointment.id !== appointmentId) {
    throw new Error("Retrieved appointment ID doesn't match");
  }
  
  console.log(`   Appointment verified with status: ${appointment.status}`);
});

// Test 10: Verify Medical Record Can Be Retrieved
await test("Verify Medical Record Retrieval", async () => {
  const res = await app.handle(
    new Request(`http://localhost/api/medical-records/${medicalRecordId}`, {
      headers: {
        Cookie: `clinic_sess=${cookie}`,
      },
    })
  );
  
  if (res.status !== 200) {
    throw new Error(`Failed to retrieve medical record: ${res.status}`);
  }
  
  const record = await res.json();
  if (record.id !== medicalRecordId) {
    throw new Error("Retrieved medical record ID doesn't match");
  }
  
  console.log(`   Medical record verified: ${record.recordNumber}`);
});

// Cleanup (optional - comment out if you want to keep test data)
console.log("\n🧹 Cleaning up test data...");

if (medicalRecordId) {
  await test("Cleanup: Delete Medical Record", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/medical-records/${medicalRecordId}`, {
        method: "DELETE",
        headers: {
          Cookie: `clinic_sess=${cookie}`,
        },
      })
    );
    
    if (res.status !== 200) {
      throw new Error(`Failed to delete medical record: ${res.status}`);
    }
  });
}

if (appointmentId) {
  await test("Cleanup: Delete Appointment", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          Cookie: `clinic_sess=${cookie}`,
        },
      })
    );
    
    if (res.status !== 200) {
      throw new Error(`Failed to delete appointment: ${res.status}`);
    }
  });
}

if (doctorId) {
  await test("Cleanup: Delete Doctor", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/doctors/${doctorId}`, {
        method: "DELETE",
        headers: {
          Cookie: `clinic_sess=${cookie}`,
        },
      })
    );
    
    if (res.status !== 200) {
      throw new Error(`Failed to delete doctor: ${res.status}`);
    }
  });
}

if (patientId) {
  await test("Cleanup: Delete Patient", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/patients/${patientId}`, {
        method: "DELETE",
        headers: {
          Cookie: `clinic_sess=${cookie}`,
        },
      })
    );
    
    if (res.status !== 200) {
      throw new Error(`Failed to delete patient: ${res.status}`);
    }
  });
}

// Print summary
console.log("\n" + "=".repeat(60));
console.log("TEST SUMMARY");
console.log("=".repeat(60));

const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

console.log(`Total tests: ${results.length}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.log("\nFailed tests:");
  results.filter(r => !r.passed).forEach(r => {
    console.log(`  - ${r.name}`);
    if (r.error) console.log(`    ${r.error}`);
  });
}

console.log("\n" + "=".repeat(60));

if (failed > 0) {
  process.exit(1);
}
