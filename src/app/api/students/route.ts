import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbFilePath = path.join(process.cwd(), "data", "students.json");

function readStudentsFromFile() {
  try {
    // Creates data directory if it doesn't exist
    const dataDir = path.dirname(dbFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Creates file with initial data if it doesn't exist
    if (!fs.existsSync(dbFilePath)) {
      const initialData = [
        {
          id: 1,
          name: "Faith Adegoke",
          registrationNumber: "2024001",
          major: "Computer Science",
          dateOfBirth: "2002-03-15",
          gpa: 3.8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Cynthia Mgbakogu",
          registrationNumber: "2024002",
          major: "Engineering",
          dateOfBirth: "2001-07-22",
          gpa: 3.9,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Habibat Mohammed",
          registrationNumber: "2024003",
          major: "Human resource",
          dateOfBirth: "2002-11-08",
          gpa: 3.6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2));
    }

    const data = fs.readFileSync(dbFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading students file:", error);
    return [];
  }
}

function writeStudentsToFile(students: any) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(students, null, 2));
  } catch (error) {
    console.error("Error writing students file:", error);
  }
}

// This is for getting all students
export async function GET() {
  try {
    const students = readStudentsFromFile();
    return NextResponse.json({
      success: true,
      data: students,
      message: "Students retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error retrieving students",
      },
      { status: 500 }
    );
  }
}

//   To create new student
export async function POST(request: { json: () => any }) {
  try {
    const body = await request.json();
    const { name, registrationNumber, major, dateOfBirth, gpa } = body;

    if (
      !name ||
      !registrationNumber ||
      !major ||
      !dateOfBirth ||
      gpa === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields (name, registrationNumber, major, dateOfBirth, gpa) are required",
        },
        { status: 400 }
      );
    }

    const students = readStudentsFromFile();

    const newId =
      students.length > 0
        ? Math.max(...students.map((s: { id: any }) => s.id)) + 1
        : 1;

    // Create new student
    const newStudent = {
      id: newId,
      name,
      registrationNumber,
      major,
      dateOfBirth,
      gpa: parseFloat(gpa),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to students array
    students.push(newStudent);

    // Write back to file
    writeStudentsToFile(students);

    return NextResponse.json(
      {
        success: true,
        data: newStudent,
        message: "Student created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error creating student",
      },
      { status: 500 }
    );
  }
}
