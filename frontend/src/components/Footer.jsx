import { Box, Container, HStack, Link, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" mt={10} py={6} borderTopWidth="1px">
      <Container maxW="6xl">
        <HStack justify="space-between">
          <Text fontWeight="semibold">Plotify</Text>
          <HStack spacing={4} fontSize="sm" color="gray.600">
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Privacy</Link>
          </HStack>
        </HStack>
        <Text mt={2} fontSize="xs" color="gray.500">© {new Date().getFullYear()} Plotify. All rights reserved.</Text>
      </Container>
    </Box>
  );
}


