import { useState } from 'react';
import { Box, Button, Card, CardBody, FormControl, FormLabel, Heading, Input, Radio, RadioGroup, Stack, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      setToken(data.token);
      setUser(data.user);
      toast({ status: 'success', title: 'Account created' });
      navigate(role === 'seller' ? '/dashboard' : '/plots', { replace: true });
    } catch (err) {
      toast({ status: 'error', title: 'Registration failed', description: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Create your account</Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <RadioGroup onChange={setRole} value={role}>
                  <Stack direction="row">
                    <Radio value="buyer">Buyer</Radio>
                    <Radio value="seller">Seller</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <Button type="submit" colorScheme="teal" isLoading={loading}>Sign Up</Button>
            </Stack>
          </form>
          <Box mt={4} fontSize="sm">
            Already have an account? <Link to="/login" style={{ color: '#319795' }}>Login</Link>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}


