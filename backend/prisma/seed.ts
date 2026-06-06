/**
 * Database seeder — generates realistic demo data with @faker-js/faker.
 *
 * Run:  npm run db:seed
 *
 * It wipes existing rows (FK-safe order) then re-seeds, so it is repeatable.
 * Known logins after seeding (all passwords below):
 *   admin@sms.local    / Admin@123      (ADMIN)
 *   <teacher emails>   / Password@123   (TEACHER, printed at the end)
 *   student@sms.local  / Password@123   (STUDENT, linked to a Student record)
 *   parent@sms.local   / Password@123   (PARENT)
 */
import {
  AssessmentType,
  AttendanceStatus,
  FeeFrequency,
  FeeType,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  Role,
} from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// ---- Tunables ----
const TEACHERS = 6;
const STUDENTS = 40;
const CLASSES = 5;
const COURSES = 8;
const ATTENDANCE_DAYS = 10; // weekdays of history per student
const ACADEMIC_YEAR = '2025-2026';

const GRADE_SCALE: { letter: string; min: number }[] = [
  { letter: 'A', min: 90 },
  { letter: 'B', min: 80 },
  { letter: 'C', min: 70 },
  { letter: 'D', min: 60 },
  { letter: 'F', min: 0 },
];
const toLetterGrade = (pct: number) => GRADE_SCALE.find((g) => pct >= g.min)?.letter ?? 'F';

const pick = <T>(arr: T[]): T => faker.helpers.arrayElement(arr);

/** Returns the last N weekdays (skipping Sat/Sun), normalised to midnight. */
function recentWeekdays(n: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < n) {
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
    d.setDate(d.getDate() - 1);
  }
  return out;
}

async function wipe() {
  // Delete children before parents to satisfy foreign keys.
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.staffAttendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.course.deleteMany();
  await prisma.class.deleteMany();
  await prisma.student.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  faker.seed(42); // deterministic data run-to-run
  console.log('Wiping existing data…');
  await wipe();

  const adminHash = await bcrypt.hash('Admin@123', 10);
  const userHash = await bcrypt.hash('Password@123', 10);

  // ---- Users ----
  console.log('Seeding users…');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sms.local',
      password: adminHash,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  const teachers = [];
  for (let i = 0; i < TEACHERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    teachers.push(
      await prisma.user.create({
        data: {
          email: faker.internet
            .email({ firstName, lastName, provider: 'sms.local' })
            .toLowerCase(),
          password: userHash,
          firstName,
          lastName,
          role: Role.TEACHER,
        },
      }),
    );
  }

  // ---- Classes & Courses ----
  console.log('Seeding classes & courses…');
  const classes = [];
  for (let i = 0; i < CLASSES; i++) {
    classes.push(
      await prisma.class.create({
        data: {
          name: `Grade ${i + 1}${pick(['A', 'B'])}`,
          gradeLevel: String(i + 1),
          capacity: faker.number.int({ min: 25, max: 35 }),
          academicYear: ACADEMIC_YEAR,
          teacherId: pick(teachers).id,
        },
      }),
    );
  }

  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'History',
    'Geography',
    'Computer Science',
    'Physical Education',
    'Art',
  ];
  const courses = [];
  for (let i = 0; i < COURSES; i++) {
    courses.push(
      await prisma.course.create({
        data: {
          code: `C${String(i + 1).padStart(3, '0')}`,
          name: subjects[i % subjects.length],
          description: faker.lorem.sentence(),
          creditHours: faker.number.int({ min: 2, max: 5 }),
          teacherId: pick(teachers).id,
        },
      }),
    );
  }

  // ---- Guardians, Students, linked student/parent accounts ----
  console.log('Seeding students…');
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@sms.local',
      password: userHash,
      firstName: 'Demo',
      lastName: 'Student',
      role: Role.STUDENT,
    },
  });
  await prisma.user.create({
    data: {
      email: 'parent@sms.local',
      password: userHash,
      firstName: 'Demo',
      lastName: 'Parent',
      role: Role.PARENT,
    },
  });

  const students = [];
  for (let i = 0; i < STUDENTS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const guardian = await prisma.guardian.create({
      data: {
        firstName: faker.person.firstName(),
        lastName,
        phone: faker.phone.number(),
        email: faker.internet.email({ lastName }).toLowerCase(),
        address: faker.location.streetAddress(),
      },
    });

    students.push(
      await prisma.student.create({
        data: {
          studentId: `STU-${String(i + 1).padStart(5, '0')}`,
          firstName,
          lastName,
          dateOfBirth: faker.date.birthdate({ min: 6, max: 18, mode: 'age' }),
          gender: pick(['male', 'female', 'other']),
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          status: faker.helpers.weightedArrayElement([
            { weight: 9, value: 'ACTIVE' as const },
            { weight: 1, value: 'SUSPENDED' as const },
          ]),
          guardianId: guardian.id,
          // Link the first student to the demo student login.
          userId: i === 0 ? studentUser.id : undefined,
        },
      }),
    );
  }

  // ---- Enrollments (one class each) ----
  console.log('Seeding enrollments…');
  for (const student of students) {
    const cls = pick(classes);
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: cls.id,
        courseId: pick(courses).id,
        academicYear: ACADEMIC_YEAR,
        status: 'ACTIVE',
      },
    });
  }

  // ---- Attendance ----
  console.log('Seeding attendance…');
  const enrollments = await prisma.enrollment.findMany();
  const days = recentWeekdays(ATTENDANCE_DAYS);
  for (const enr of enrollments) {
    for (const date of days) {
      await prisma.attendance.create({
        data: {
          studentId: enr.studentId,
          classId: enr.classId,
          date,
          status: faker.helpers.weightedArrayElement([
            { weight: 80, value: AttendanceStatus.PRESENT },
            { weight: 8, value: AttendanceStatus.ABSENT },
            { weight: 8, value: AttendanceStatus.LATE },
            { weight: 4, value: AttendanceStatus.EXCUSED },
          ]),
          markedBy: pick(teachers).id,
        },
      });
    }
  }

  // ---- Grades & Exams ----
  console.log('Seeding grades & exams…');
  for (const course of courses) {
    await prisma.exam.create({
      data: {
        courseId: course.id,
        title: `${course.name} Final`,
        date: faker.date.soon({ days: 30 }),
        time: '09:00',
        duration: 90,
        location: `Room ${faker.number.int({ min: 100, max: 300 })}`,
        maxScore: 100,
      },
    });
  }

  const assessmentTypes = Object.values(AssessmentType);
  for (const student of students) {
    const studentCourses = faker.helpers.arrayElements(courses, 3);
    for (const course of studentCourses) {
      for (const assessmentType of faker.helpers.arrayElements(assessmentTypes, 3)) {
        const maxScore = 100;
        const score = faker.number.int({ min: 40, max: 100 });
        await prisma.grade.create({
          data: {
            studentId: student.id,
            courseId: course.id,
            assessmentType,
            score,
            maxScore,
            weight: faker.helpers.arrayElement([0.2, 0.3, 0.5, 1]),
            letterGrade: toLetterGrade((score / maxScore) * 100),
          },
        });
      }
    }
  }

  // ---- Fees, payments, scholarships ----
  console.log('Seeding fees & payments…');
  const feeDefs: { feeType: FeeType; amount: number; frequency: FeeFrequency }[] = [
    { feeType: FeeType.TUITION, amount: 1500, frequency: FeeFrequency.MONTHLY },
    { feeType: FeeType.ADMISSION, amount: 500, frequency: FeeFrequency.YEARLY },
    { feeType: FeeType.TRANSPORT, amount: 200, frequency: FeeFrequency.MONTHLY },
    { feeType: FeeType.LIBRARY, amount: 100, frequency: FeeFrequency.YEARLY },
  ];
  const fees = [];
  for (const def of feeDefs) {
    fees.push(
      await prisma.fee.create({
        data: { ...def, dueDate: faker.date.soon({ days: 20 }), description: `${def.feeType} fee` },
      }),
    );
  }

  for (const student of students) {
    // ~70% of students have at least one payment
    if (faker.datatype.boolean({ probability: 0.7 })) {
      const fee = pick(fees);
      const full = faker.datatype.boolean();
      await prisma.feePayment.create({
        data: {
          studentId: student.id,
          feeId: fee.id,
          amountPaid: full ? fee.amount : Math.round(fee.amount * 0.5),
          paymentMethod: pick(Object.values(PaymentMethod)),
          transactionId: faker.string.alphanumeric(10).toUpperCase(),
          status: full ? PaymentStatus.COMPLETED : PaymentStatus.PARTIAL,
        },
      });
    }
    // ~15% have a scholarship
    if (faker.datatype.boolean({ probability: 0.15 })) {
      await prisma.scholarship.create({
        data: {
          studentId: student.id,
          percentage: pick([10, 25, 50, 100]),
          reason: pick(['Merit', 'Need-based', 'Sports', 'Sibling']),
          startDate: faker.date.past({ years: 1 }),
        },
      });
    }
  }

  // ---- Summary ----
  const counts = {
    users: await prisma.user.count(),
    students: await prisma.student.count(),
    classes: await prisma.class.count(),
    courses: await prisma.course.count(),
    attendance: await prisma.attendance.count(),
    grades: await prisma.grade.count(),
    payments: await prisma.feePayment.count(),
  };
  console.log('\n✅ Seed complete:', counts);
  console.log('\nLogins:');
  console.log('  admin@sms.local   / Admin@123     (ADMIN)');
  console.log('  student@sms.local / Password@123  (STUDENT)');
  console.log('  parent@sms.local  / Password@123  (PARENT)');
  console.log(`  ${teachers[0].email} / Password@123  (TEACHER, +${TEACHERS - 1} more)`);
  console.log(`  (admin id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
