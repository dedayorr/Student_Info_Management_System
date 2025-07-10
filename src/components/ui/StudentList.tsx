import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Button,
    Text,
    Avatar,
    HStack,
    VStack,
    useColorModeValue,
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
  
  interface StudentListProps {
    students: Student[];
    onViewStudent: (student: Student) => void;
  }
  
  const StudentList: React.FC<StudentListProps> = ({ students, onViewStudent }) => {
    const tableBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
  
    const getGPAColor = (gpa: number) => {
      if (gpa >= 3.5) return 'green';
      if (gpa >= 3.0) return 'blue';
      if (gpa >= 2.5) return 'yellow';
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
  
    // const getInitials = (name: string) => {
    //   return name.split(' ').map(n => n[0]).join('').toUpperCase();
    // };
  
    return (
      <Box
  bg={tableBg}
  border="1px"
  borderColor={borderColor}
  borderRadius="lg"
  overflow="hidden"
  shadow="md"
>
  <Box overflowX="auto">
    <Table variant="simple" size="md" minWidth="800px">
      <Thead bg="gray.50">
        <Tr>
          <Th>Student</Th>
          <Th>Registration No.</Th>
          <Th>Major</Th>
          <Th>Age</Th>
          <Th>GPA</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {students.map((student) => (
          <Tr
            key={student.id}
            _hover={{
              bg: 'gray.50',
              cursor: 'pointer',
            }}
            onClick={() => onViewStudent(student)}
          >
            <Td>
              <HStack spacing={3}>
                <Avatar
                  size="sm"
                  name={student.name}
                  bg="purple.500"
                  color="white"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
                    {student.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    ID: {student.id}
                  </Text>
                </VStack>
              </HStack>
            </Td>
            <Td>
              <Text fontFamily="mono" fontSize="sm" color="purple.600">
                {student.registrationNumber}
              </Text>
            </Td>
            <Td>
              <Text fontSize="sm" noOfLines={1}>
                {student.major}
              </Text>
            </Td>
            <Td>
              <Text fontSize="sm">
                {calculateAge(student.dateOfBirth)} years
              </Text>
            </Td>
            <Td>
              <Badge
                colorScheme={getGPAColor(student.gpa)}
                variant="solid"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
              >
                {student.gpa.toFixed(1)}
              </Badge>
            </Td>
            <Td>
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click
                  onViewStudent(student);
                }}
              >
                View Details
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
</Box>
    );
  };
  
  export default StudentList;