import { useState } from 'react';
import { Box, Button, Card, CardBody, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      toast({ status: 'success', title: 'Welcome back!' });
      const redirectTo = location.state?.from?.pathname || (data.user.role === 'seller' ? '/dashboard' : '/plots');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast({ status: 'error', title: 'Login failed', description: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Login</Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="purple" isLoading={loading}>Login</Button>
            </Stack>
          </form>
          <Text mt={3} fontSize="sm">
            <Link to="/forgot-password" style={{ color: '#805AD5' }}>Forgot password?</Link>
          </Text>
          <Box mt={2} fontSize="sm">
            Don't have an account? <Link to="/register" style={{ color: '#805AD5' }}>Register</Link>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
