import {
    Box,
    Heading,
    Text,
    Badge,
    Button,
    ButtonGroup,
    HStack,
    VStack,
  } from '@chakra-ui/react';
  
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
  
  interface StudentCardProps {
    student: Student;
    onEdit: (student: Student) => void;
    onDelete: (id: number) => void;
  }
  
  const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
    const handleDeleteClick = () => {
      if (window.confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
        onDelete(student.id);
      }
    };
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };
  
    const getGPAColor = (gpa: number) => {
      if (gpa >= 3.5) return 'green';
      if (gpa >= 3.0) return 'blue';
      if (gpa >= 2.5) return 'red';
      return 'red';
    };
  
    const calculateAge = (dateOfBirth: string) => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    };
  
    return (
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        shadow="md"
        _hover={{
          shadow: 'lg',
          transform: 'translateY(-2px)',
        }}
        transition="all 0.2s"
        p={4}
      >
        <Box pb={2}>
          <HStack justify="space-between" align="start">
            <VStack align="start">
              <Heading size="md" noOfLines={1}>
                {student.name}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {student.registrationNumber}
              </Text>
            </VStack>
            <Badge colorScheme={getGPAColor(student.gpa)} variant="solid">
              GPA {student.gpa.toFixed(1)}
            </Badge>
          </HStack>
        </Box>
  
        {/* Body */}
        <Box pt={0}>
          <VStack align="start">
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="purple">
                Major
              </Text>
              <Text fontSize="md">{student.major}</Text>
            </Box>
  
            <Box mt={3}>
              <Text fontSize="md" fontWeight="semibold" color="purple">
                Age
              </Text>
              <Text fontSize="md">{calculateAge(student.dateOfBirth)} years old</Text>
            </Box>
  
            <Box mt={3}>
              <Text fontSize="md" fontWeight="semibold" color="purple">
                Date of Birth
              </Text>
              <Text fontSize="md">{formatDate(student.dateOfBirth)}</Text>
            </Box>
  
            <Box mt={3}>
              <Text fontSize="md" fontWeight="semibold" color="purple">
                Registered
              </Text>
              <Text fontSize="md">{formatDate(student.createdAt)}</Text>
            </Box>
  
            <ButtonGroup width="100%" mt={4}>
              <Button
                colorScheme="blue"
                variant="outline"
                size="sm"
                onClick={() => onEdit(student)}
                flex={1}
              >
                ✏️ Edit
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                flex={1}
              >
                🗑️ Delete
              </Button>
            </ButtonGroup>
          </VStack>
        </Box>
      </Box>
    );
  };
  
  export default StudentCard;