STUDENT INFORMATION SYSTEM

A web application built with Next.js and Typescript for managing student information. It includes students records, search functionality and data managment.

FEATURES
- Add, edit, delete student records
- Search and Filter
- Chakra UI for the design
- In-memory database for backend, JSON-based data storage
- Typescript

To run the project have your Node.js installed, npm or yarn package manager and git for version control

To Install,
- Clone the respository (git clone <repository-url>)
- npm install or yarn install

To run the app,
- npm run dev or yarn dev


PROJECT STRUCTURE

STUDENT-INFO-SYSTEM 
>> data
    - students.json (student data storage)

>> Src
    - app
        -- api (routes for student operation)
            --- students
                ----> routes.ts
            --- [id]
                ----> route.ts

        -- layout.tsx (styles)

        -- page.tsx (individual student cards/page)

    - components
        -- providers
            ---> AppChakraProvider.tsx (chakra)

        -- ui 
            ---> SearchFilter.tsx (student filter component)
            ---> StudentCard.tsx (student card component)
            ---> StudentDetailsModal.tsx (student details component)
            ---> StudentForm.tsx (student form component)
            ---> StudentList.tsx (list of students component)

    - next.config.js
    - package.json
    - tsconfig.json


API ENDPOINTS
>>> GET /api/students - to retrieve all students

>>> POST /api/students - to create a new student

>>> GET /api/students/[id] - to get student by ID

>>> PUT /api/students/[id] - to update student by ID

>>> DELETE /api/students/[id] - to delete student by ID


STUDENT DATA STRUCTURE
interface student {
    id: number;
  name: string;
  registrationNumber: string;
  major: string;
  dateOfBirth: string;
  gpa: number;
  createdAt: string;
  updatedAt: string;
}

