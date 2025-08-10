import { useEffect, useState } from 'react';
import { Box, Button, Card, CardBody, FormControl, FormLabel, Heading, Input, Stack, useToast } from '@chakra-ui/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const t = searchParams.get('token');
    if (t) setToken(t);
  }, [searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast({ status: 'success', title: 'Password reset successful' });
      navigate('/login');
    } catch (err) {
      toast({ status: 'error', title: 'Reset failed', description: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Reset Password</Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Token</FormLabel>
                <Input value={token} onChange={(e) => setToken(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="teal" isLoading={loading}>Reset Password</Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}


