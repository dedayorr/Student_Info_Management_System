import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Student {
  id: number;
  name: string;
  registrationNumber: string;
  major: string;
  dateOfBirth: string;
  gpa: number;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateStudentBody {
  name?: string;
  registrationNumber?: string;
  major?: string;
  dateOfBirth?: string;
  gpa?: number;
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// Path to database file
const dbFilePath = path.join(process.cwd(), 'data', 'students.json');

function readStudentsFromFile(): Student[] {
  try {
    if (!fs.existsSync(dbFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data) as Student[];
  } catch (error) {
    console.error('Error reading students file:', error);
    return [];
  }
}

function writeStudentsToFile(students: Student[]): void {
  try {
    const dataDir = path.dirname(dbFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(students, null, 2));
  } catch (error) {
    console.error('Error writing students file:', error);
  }
}

// GET single student
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const students = readStudentsFromFile();
    const { id } = await context.params;
    const studentId = parseInt(id);
    const student = students.find((s: Student) => s.id === studentId);

    if (!student) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving student:', error);
    return NextResponse.json({
      success: false,
      message: 'Error retrieving student'
    }, { status: 500 });
  }
}

// Update student
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const students = readStudentsFromFile();
    const { id } = await context.params;
    const studentId = parseInt(id);
    const body = await request.json() as UpdateStudentBody;
    const { name, registrationNumber, major, dateOfBirth, gpa } = body;

    const studentIndex = students.findIndex((s: Student) => s.id === studentId);

    if (studentIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    // Update student
    students[studentIndex] = {
      ...students[studentIndex],
      name: name || students[studentIndex].name,
      registrationNumber: registrationNumber || students[studentIndex].registrationNumber,
      major: major || students[studentIndex].major,
      dateOfBirth: dateOfBirth || students[studentIndex].dateOfBirth,
      gpa: gpa !== undefined ? parseFloat(gpa.toString()) : students[studentIndex].gpa,
      updatedAt: new Date().toISOString()
    };

    // Write back to file
    writeStudentsToFile(students);

    return NextResponse.json({
      success: true,
      data: students[studentIndex],
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating student'
    }, { status: 500 });
  }
}

// Delete student
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const students = readStudentsFromFile();
    const { id } = await context.params;
    const studentId = parseInt(id);
    const studentIndex = students.findIndex((s: Student) => s.id === studentId);

    if (studentIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];

    // Write back to file
    writeStudentsToFile(students);

    return NextResponse.json({
      success: true,
      data: deletedStudent,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({
      success: false,
      message: 'Error deleting student'
    }, { status: 500 });
  }
}