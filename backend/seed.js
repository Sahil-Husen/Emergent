import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import Course from './models/Course.js';
import Fee from './models/Fee.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Faculty.deleteMany({}),
      Course.deleteMany({}),
      Fee.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      email: 'admin@amu.ac.in',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin created:', admin.email);

    // Create Faculty Users
    const faculty1User = await User.create({
      email: 'faculty1@amu.ac.in',
      password: 'faculty123',
      role: 'faculty'
    });

    const faculty1 = await Faculty.create({
      userId: faculty1User._id,
      employeeId: 'FAC001',
      name: 'Dr. Ahmed Khan',
      department: 'Computer',
      designation: 'Professor',
      phone: '9876543210',
      specialization: 'Algorithms'
    });

    faculty1User.profileId = faculty1._id;
    await faculty1User.save();

    const faculty2User = await User.create({
      email: 'faculty2@amu.ac.in',
      password: 'faculty123',
      role: 'faculty'
    });

    const faculty2 = await Faculty.create({
      userId: faculty2User._id,
      employeeId: 'FAC002',
      name: 'Prof. Fatima Syed',
      department: 'Electrical',
      designation: 'Associate Professor',
      phone: '9876543211',
      specialization: 'Power Systems'
    });

    faculty2User.profileId = faculty2._id;
    await faculty2User.save();

    console.log('Faculty created');

    // Create Student Users
    const student1User = await User.create({
      email: 'student1@amu.ac.in',
      password: 'student123',
      role: 'student'
    });

    const student1 = await Student.create({
      userId: student1User._id,
      rollNumber: 'AMU20260001',
      name: 'Mohammad Zubair',
      dateOfBirth: new Date('2005-05-15'),
      phone: '9876543220',
      address: 'AMU Campus, Aligarh',
      department: 'Computer',
      program: 'Computer Science B.Tech',
      semester: 3
    });

    student1User.profileId = student1._id;
    await student1User.save();

    const student2User = await User.create({
      email: 'student2@amu.ac.in',
      password: 'student123',
      role: 'student'
    });

    const student2 = await Student.create({
      userId: student2User._id,
      rollNumber: 'AMU20260002',
      name: 'Ayesha Rahman',
      dateOfBirth: new Date('2005-08-20'),
      phone: '9876543221',
      address: 'AMU Campus, Aligarh',
      department: 'Electrical',
      program: 'Electrical Engineering B.Tech',
      semester: 3
    });

    student2User.profileId = student2._id;
    await student2User.save();

    console.log('Students created');

    // Create Courses
    const courses = await Course.create([
      {
        courseCode: 'CS301',
        courseName: 'Data Structures and Algorithms',
        department: 'Computer',
        credits: 4,
        semester: 3,
        facultyId: faculty1._id,
        description: 'Advanced data structures and algorithm design'
      },
      {
        courseCode: 'CS302',
        courseName: 'Database Management Systems',
        department: 'Computer',
        credits: 4,
        semester: 3,
        facultyId: faculty1._id,
        description: 'Relational databases and SQL'
      },
      {
        courseCode: 'EE301',
        courseName: 'Power Electronics',
        department: 'Electrical',
        credits: 4,
        semester: 3,
        facultyId: faculty2._id,
        description: 'Power electronic devices and circuits'
      },
      {
        courseCode: 'EE302',
        courseName: 'Control Systems',
        department: 'Electrical',
        credits: 4,
        semester: 3,
        facultyId: faculty2._id,
        description: 'Feedback control systems'
      }
    ]);

    console.log('Courses created');

    // Create Fees
    await Fee.create([
      {
        studentId: student1._id,
        feeType: 'tuition',
        amount: 50000,
        dueDate: new Date('2026-07-15'),
        semester: 3,
        academicYear: '2026-27',
        status: 'pending'
      },
      {
        studentId: student1._id,
        feeType: 'hostel',
        amount: 15000,
        dueDate: new Date('2026-07-15'),
        semester: 3,
        academicYear: '2026-27',
        status: 'pending'
      },
      {
        studentId: student2._id,
        feeType: 'tuition',
        amount: 50000,
        dueDate: new Date('2026-07-15'),
        semester: 3,
        academicYear: '2026-27',
        status: 'pending'
      }
    ]);

    console.log('Fees created');

    console.log('\n=== SEED DATA CREATED SUCCESSFULLY ===');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@amu.ac.in / admin123');
    console.log('Faculty: faculty1@amu.ac.in / faculty123');
    console.log('Student: student1@amu.ac.in / student123');
    console.log('=====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
