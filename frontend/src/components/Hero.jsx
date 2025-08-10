import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <Box bgGradient="linear(to-r, brand.500, purple.600)" color="white" py={{ base: 16, md: 24 }}>
      <Container maxW="6xl">
        <Stack spacing={5} maxW="3xl">
          <Heading size="2xl" lineHeight={1.1}>Discover and sell plots with confidence</Heading>
          <Text fontSize="lg" color="whiteAlpha.900">Professional tools for sellers, beautiful browsing for buyers, and secure account management.</Text>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <Button as={Link} to="/plots" colorScheme="blackAlpha" bg="white" color="black" _hover={{ bg: 'whiteAlpha.800' }}>Browse Plots</Button>
            <Button as={Link} to="/register" variant="outline" colorScheme="whiteAlpha">Get Started</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}


