import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Clear database
  await prisma.attendance.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.groupStudent.deleteMany();
  await prisma.group.deleteMany();
  await prisma.course.deleteMany();
  await prisma.room.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned.');

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      phone: '+998901234567',
      passwordHash,
    },
  });
  console.log('Admin user created:', admin.phone);

  // 3. Create Teachers
  const teacher1 = await prisma.teacher.create({
    data: { firstName: 'Eshmat', lastName: 'Toshmatov', phone: '+998911112233', subject: 'Ingliz tili' },
  });
  const teacher2 = await prisma.teacher.create({
    data: { firstName: 'Vali', lastName: 'Aliyev', phone: '+998912223344', subject: 'Matematika' },
  });
  const teacher3 = await prisma.teacher.create({
    data: { firstName: 'Gulnoza', lastName: 'Karimova', phone: '+998913334455', subject: 'Fizika' },
  });
  console.log('Teachers created.');

  // 4. Create Rooms
  const room1 = await prisma.room.create({ data: { name: '101-xona', capacity: 15 } });
  const room2 = await prisma.room.create({ data: { name: '102-xona', capacity: 20 } });
  const room3 = await prisma.room.create({ data: { name: 'IT Lab', capacity: 10 } });
  console.log('Rooms created.');

  // 5. Create Courses
  const course1 = await prisma.course.create({
    data: { name: 'Ingliz tili - General English', description: 'Boshlang\'ich va o\'rta darajadagilar uchun ingliz tili kursi.' },
  });
  const course2 = await prisma.course.create({
    data: { name: 'Matematika - IELTS / Vestminster', description: 'Vestminster universiteti va litseyiga tayyorlov kursi.' },
  });
  console.log('Courses created.');

  // 6. Create Groups
  const group1 = await prisma.group.create({
    data: {
      name: 'English Evening',
      courseId: course1.id,
      teacherId: teacher1.id,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-12-01'),
    },
  });
  const group2 = await prisma.group.create({
    data: {
      name: 'Math Westminster',
      courseId: course2.id,
      teacherId: teacher2.id,
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-12-15'),
    },
  });
  console.log('Groups created.');

  // 7. Create Students
  const student1 = await prisma.student.create({
    data: { firstName: 'Jasur', lastName: 'Raimov', phone: '+998901112233', status: 'ACTIVE' },
  });
  const student2 = await prisma.student.create({
    data: { firstName: 'Dilnoza', lastName: 'Sodiqova', phone: '+998902223344', status: 'ACTIVE' },
  });
  const student3 = await prisma.student.create({
    data: { firstName: 'Sardor', lastName: 'Kamilov', phone: '+998903334455', status: 'ACTIVE' },
  });
  const student4 = await prisma.student.create({
    data: { firstName: 'Madina', lastName: 'Umarova', phone: '+998904445566', status: 'ACTIVE' },
  });
  const student5 = await prisma.student.create({
    data: { firstName: 'Bekzod', lastName: 'Tursunov', phone: '+998905556677', status: 'INACTIVE' },
  });
  console.log('Students created.');

  // 8. Enroll Students in Groups
  await prisma.groupStudent.createMany({
    data: [
      { groupId: group1.id, studentId: student1.id },
      { groupId: group1.id, studentId: student2.id },
      { groupId: group1.id, studentId: student3.id },
      { groupId: group2.id, studentId: student3.id }, // Sardor is in both groups
      { groupId: group2.id, studentId: student4.id },
    ],
  });
  console.log('Students enrolled in groups.');

  // 9. Create Schedules
  // DayOfWeek standard MONDAY, TUESDAY etc.
  // We'll create English Evening schedules (teacher1, room1) on Mon, Wed, Fri 14:00 - 15:30 (840 - 930)
  // We'll create Math Westminster schedules (teacher2, room2) on Tue, Thu, Sat 16:00 - 17:30 (960 - 1050)
  await prisma.schedule.createMany({
    data: [
      // English Evening schedules
      { groupId: group1.id, roomId: room1.id, dayOfWeek: 'MONDAY', startTime: '14:00', endTime: '15:30', startMinutes: 840, endMinutes: 930 },
      { groupId: group1.id, roomId: room1.id, dayOfWeek: 'WEDNESDAY', startTime: '14:00', endTime: '15:30', startMinutes: 840, endMinutes: 930 },
      { groupId: group1.id, roomId: room1.id, dayOfWeek: 'FRIDAY', startTime: '14:00', endTime: '15:30', startMinutes: 840, endMinutes: 930 },
      // Math Westminster schedules
      { groupId: group2.id, roomId: room2.id, dayOfWeek: 'TUESDAY', startTime: '16:00', endTime: '17:30', startMinutes: 960, endMinutes: 1050 },
      { groupId: group2.id, roomId: room2.id, dayOfWeek: 'THURSDAY', startTime: '16:00', endTime: '17:30', startMinutes: 960, endMinutes: 1050 },
      { groupId: group2.id, roomId: room2.id, dayOfWeek: 'SATURDAY', startTime: '16:00', endTime: '17:30', startMinutes: 960, endMinutes: 1050 },
    ],
  });
  console.log('Schedules created.');

  // 10. Create Attendances
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  await prisma.attendance.createMany({
    data: [
      { studentId: student1.id, groupId: group1.id, date: yesterday, status: 'kelgan', comment: 'Darsda faol ishtirok etdi' },
      { studentId: student2.id, groupId: group1.id, date: yesterday, status: 'kelmagan', comment: 'Kasal bo\'lib qolibdi' },
      { studentId: student3.id, groupId: group1.id, date: yesterday, status: 'sababli', comment: 'Ruxsat olgandi' },
    ],
  });
  console.log('Attendances created.');

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
