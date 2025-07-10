import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  Badge,
  Avatar,
  HStack,
  VStack,
  Divider,
  Grid,
  GridItem,
//   ButtonGroup,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";

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

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onDelete,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!student) return null;

  const handleDeleteClick = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${student.name}? This action cannot be undone.`
      )
    ) {
      onDelete(student.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "green";
    if (gpa >= 3.0) return "blue";
    if (gpa >= 2.5) return "yellow";
    return "red";
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="" >
      <ModalOverlay />
      <ModalContent bg={bgColor} maxW="600px">
        <ModalHeader>
          <HStack spacing={4}>
            <Avatar
              size="lg"
              name={student.name}
              bg="purple.500"
              color="white"
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="xl" fontWeight="bold">
                {student.name}
              </Text>
              <Text fontSize="sm" color="gray.500" fontFamily="mono">
                {student.registrationNumber}
              </Text>
              <Badge
                colorScheme={getGPAColor(student.gpa)}
                variant="solid"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                GPA: {student.gpa.toFixed(1)}
              </Badge>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Divider />

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <Box
                  p={4}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.600"
                    mb={2}
                  >
                    MAJOR
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {student.major}
                  </Text>
                </Box>
              </GridItem>

              <GridItem>
                <Box
                  p={4}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.600"
                    mb={2}
                  >
                    AGE
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {calculateAge(student.dateOfBirth)} years old
                  </Text>
                </Box>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <Box
                  p={4}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.600"
                    mb={2}
                  >
                    DATE OF BIRTH
                  </Text>
                  <Text fontSize="md">{formatDate(student.dateOfBirth)}</Text>
                </Box>
              </GridItem>

              <GridItem>
                <Box
                  p={4}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.600"
                    mb={2}
                  >
                    STUDENT ID
                  </Text>
                  <Text fontSize="md" fontFamily="mono" color="purple.600">
                    #{student.id}
                  </Text>
                </Box>
              </GridItem>
            </Grid>

            <Divider />

            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={3}>
                REGISTRATION DETAILS
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <Text fontSize="sm" color="gray.600">
                    Registered on:
                  </Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {formatDate(student.createdAt)}
                  </Text>
                </GridItem>
                <GridItem>
                  <Text fontSize="sm" color="gray.600">
                    Last updated:
                  </Text>
                  <Text fontSize="md" fontWeight="semibold">
                    {formatDateTime(student.updatedAt)}
                  </Text>
                </GridItem>
              </Grid>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Stack
            direction={{ base: "column", sm: "row" }} // column on mobile, row on small+ screens
            spacing={3}
            width="100%"
          >
            <Button
              colorScheme="purple"
              onClick={() => onEdit(student)}
              leftIcon={<span>✏️</span>}
              width="100%" // full-width on mobile
            >
              Edit Student
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleDeleteClick}
              leftIcon={<span>🗑️</span>}
              width="100%"
            >
              Delete Student
            </Button>
            <Button variant="ghost" onClick={onClose} width="100%">
              Close
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudentDetailModal;
