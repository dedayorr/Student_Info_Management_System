"use client"

import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Button, 
  useDisclosure,
  Spinner,
  Center,
  Text,
  Flex
} from '@chakra-ui/react';
import { useToast } from "@chakra-ui/toast";
import StudentList from "@/components/ui/StudentList"
import StudentForm from '@/components/ui/StudentForm';
import StudentDetailModal from '@/components/ui/StudentDetailsModal';
import SearchFilter from '@/components/ui/SearchFilter';


interface Student {
  id: number;
  name: string;
  registrationNumber: string;
  major: string;
  dateOfBirth: string;
  gpa: number;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const toast = useToast();

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students');
      const data = await response.json();
      
      if (data.success) {
        setStudents(data.data);
        setFilteredStudents(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  //To create and update
  const handleStudentSubmit = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: editingStudent ? 'Student updated successfully' : 'Student created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        fetchStudents(); // Refresh the list
        handleCloseForm();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to save student',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error saving student:', err);
      toast({
        title: 'Error',
        description: 'Network error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // To delete student 
  const handleDeleteStudent = async (id: number) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Student deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        fetchStudents(); // Refresh the list
        onDetailClose(); // Close detail modal if open
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete student',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      toast({
        title: 'Error',
        description: 'Network error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // To view student details
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    onDetailOpen();
  };

  // To edit student
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    onDetailClose(); // Close detail modal
    onOpen();
  };

  // To close form
  const handleCloseForm = () => {
    setEditingStudent(null);
    onClose();
  };

  // To search and filter
  const handleSearch = (searchTerm: string, majorFilter: string) => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (majorFilter) {
      filtered = filtered.filter(student =>
        student.major.toLowerCase().includes(majorFilter.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="50vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box
          bg="red.50"
          border="1px"
          borderColor="red.200"
          borderRadius="md"
          p={4}
        >
          <Flex align="center">
            <Box
              w={5}
              h={5}
              bg="red.500"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={3}
            >
              <Text color="white" fontSize="sm" fontWeight="bold">!</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="red.800">
                Error!
              </Text>
              <Text color="red.700">
                {error}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={4} textAlign="center" fontWeight={900}>
          Student Management System
        </Heading>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <SearchFilter onSearch={handleSearch} />
          
          <Button
            colorScheme="purple"
            onClick={onOpen}
            size="md"
            ml={5}
          >
            <Text mr={2} fontSize="lg">+</Text>
            Add New Student
          </Button>
        </Box>
      </Box>

      {filteredStudents.length === 0 ? (
        <Center py={12}>
          <Box
            bg="blue.50"
            border="1px"
            borderColor="blue.200"
            borderRadius="md"
            p={6}
            maxW="md"
          >
            <Flex align="center">
              <Box
                w={5}
                h={5}
                bg="blue.500"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={3}
              >
                <Text color="white" fontSize="sm" fontWeight="bold">i</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" color="blue.800">
                  No students found!
                </Text>
                <Text color="blue.700">
                  {students.length === 0 
                    ? "Start by adding your first student."
                    : "Try adjusting your search criteria."
                  }
                </Text>
              </Box>
            </Flex>
          </Box>
        </Center>
      ) : (
        <StudentList
          students={filteredStudents}
          onViewStudent={handleViewStudent}
        />
      )}

      {/* Student Form Modal */}
      <StudentForm
        isOpen={isOpen}
        onClose={handleCloseForm}
        onSubmit={handleStudentSubmit}
        editingStudent={editingStudent}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        student={selectedStudent}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />
    </Container>
  );
}