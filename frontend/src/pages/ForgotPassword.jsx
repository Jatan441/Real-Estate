import { useState } from 'react';
import { Box, Button, Card, CardBody, Code, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from '@chakra-ui/react';
import api from '../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.token) setToken(data.token);
      toast({ status: 'success', title: 'If an account exists, a reset token was issued.' });
    } catch (err) {
      toast({ status: 'error', title: 'Request failed', description: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Forgot Password</Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="teal" isLoading={loading}>Request Reset</Button>
            </Stack>
          </form>
          {token && (
            <Box mt={4}>
              <Text fontSize="sm" color="gray.600">Demo token (use on Reset page):</Text>
              <Code display="block" mt={2} p={2}>{token}</Code>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}


