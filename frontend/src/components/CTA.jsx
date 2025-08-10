import { Button, Card, CardBody, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <Card bgGradient="linear(to-r, purple.500, pink.500)" color="white">
      <CardBody>
        <Stack spacing={3} align="start">
          <Heading size="lg">Ready to list your first plot?</Heading>
          <Text color="whiteAlpha.900">Join sellers using Plotify to reach more buyers with beautiful listings.</Text>
          <Button as={Link} to="/register" colorScheme="blackAlpha" bg="white" color="black" _hover={{ bg: 'whiteAlpha.800' }}>Create an account</Button>
        </Stack>
      </CardBody>
    </Card>
  );
}


