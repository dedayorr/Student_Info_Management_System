import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to database file
const dbFilePath = path.join(process.cwd(), 'data', 'students.json');

function readStudentsFromFile() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading students file:', error);
    return [];
  }
}

function writeStudentsToFile(students: any) {
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
export async function GET(request: any, { params }: any) {
  try {
    const students = readStudentsFromFile();
    const id = parseInt(params.id);
    const student = students.find((s: { id: number; }) => s.id === id);

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
    return NextResponse.json({
      success: false,
      message: 'Error retrieving student'
    }, { status: 500 });
  }
}

// To Update student
export async function PUT(request: { json: () => any; }, { params }: any) {
    try {
        const students = readStudentsFromFile();
        const id = parseInt(params.id);
        const body = await request.json();
        const { name, registrationNumber, major, dateOfBirth, gpa } = body;
    
        const studentIndex = students.findIndex((s: { id: number; }) => s.id === id);
    
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
          gpa: gpa !== undefined ? parseFloat(gpa) : students[studentIndex].gpa,
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
        return NextResponse.json({
          success: false,
          message: 'Error updating student'
        }, { status: 500 });
      }
    }
    
    
    export async function DELETE(request: any, { params }: any) {
        try {
          const students = readStudentsFromFile();
          const id = parseInt(params.id);
          const studentIndex = students.findIndex((s: { id: number; }) => s.id === id);
      
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
          return NextResponse.json({
            success: false,
            message: 'Error deleting student'
          }, { status: 500 });
        }
      }