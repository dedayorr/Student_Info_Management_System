"use client"

import { useState, useEffect } from 'react';
import {
  Box,
  Input,
  // HStack,
  Button,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

interface SearchFilterProps {
  onSearch: (searchTerm: string, majorFilter: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [majorFilter, setMajorFilter] = useState('');

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm, majorFilter);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, majorFilter, onSearch]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setMajorFilter('');
  };

  const hasActiveFilters = searchTerm || majorFilter;

  return (
    <Box>
      <VStack gap={4}>
        <Box position="relative" maxW="200px">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pl={10}
          />
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
          >
            <Icon as={SearchIcon} color="gray.500" />
          </Box>
        </Box>

        <Box maxW="200px">
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #E2E8F0',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '16px',
              outline: 'none',
              fontWeight: 'bold'
            }}
          >
            <option value="">Filter</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Psychology">Psychology</option>
            <option value="Economics">Economics</option>
            <option value="Literature">Literature</option>
          </select>
        </Box>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            <CloseIcon marginRight={2} />
            Clear
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default SearchFilter;