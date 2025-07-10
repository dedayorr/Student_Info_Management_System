"use client";

import { useState, useEffect } from "react";
import {
  Input,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import {
    Box,
    VStack,
    HStack,
    Flex,
    Text,
  } from "@chakra-ui/layout";
import {
    Button,
    IconButton,
  } from "@chakra-ui/button";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import {
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/modal";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/number-input";
import { CloseIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/toast";

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

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    studentData: Omit<Student, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  editingStudent?: Student | null;
}

const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingStudent,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    major: "",
    dateOfBirth: "",
    gpa: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Populate form when editing
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        registrationNumber: editingStudent.registrationNumber,
        major: editingStudent.major,
        dateOfBirth: editingStudent.dateOfBirth,
        gpa: editingStudent.gpa,
      });
    } else {
      setFormData({
        name: "",
        registrationNumber: "",
        major: "",
        dateOfBirth: "",
        gpa: 0,
      });
    }
    setErrors({});
  }, [editingStudent, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    if (!formData.major.trim()) {
      newErrors.major = "Major is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (formData.gpa < 0 || formData.gpa > 4.0) {
      newErrors.gpa = "GPA must be between 0.0 and 4.0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save student",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <Box p={6} pb={0}>
          <Flex justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </Text>
            <IconButton
              aria-label="Close"
              icon={<CloseIcon />}
              size="sm"
              onClick={onClose}
              variant="ghost"
            />
          </Flex>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box p={6}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter student's full name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.registrationNumber}>
                <FormLabel>Registration Number</FormLabel>
                <Input
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    handleInputChange("registrationNumber", e.target.value)
                  }
                  placeholder="Enter registration number"
                />
                <FormErrorMessage>{errors.registrationNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.major}>
                <FormLabel>Major</FormLabel>
                <Select
                  value={formData.major}
                  onChange={(e: { target: { value: string | number; }; }) => handleInputChange("major", e.target.value)}
                  placeholder="Select major"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business Administration">
                    Business Administration
                  </option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Economics">Economics</option>
                  <option value="Literature">Literature</option>
                </Select>
                <FormErrorMessage>{errors.major}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.dateOfBirth}>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
                <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.gpa}>
                <FormLabel>GPA</FormLabel>
                <NumberInput
                  value={formData.gpa}
                  onChange={(_, valueAsNumber) =>
                    handleInputChange("gpa", valueAsNumber || 0)
                  }
                  min={0}
                  max={4.0}
                  step={0.1}
                  precision={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.gpa}</FormErrorMessage>
              </FormControl>
            </VStack>
          </Box>

          <Box p={6} pt={0}>
            <HStack justify="flex-end" spacing={3}>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={isSubmitting}
                loadingText="Saving..."
              >
                {editingStudent ? "Update" : "Create"} Student
              </Button>
            </HStack>
          </Box>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default StudentForm;