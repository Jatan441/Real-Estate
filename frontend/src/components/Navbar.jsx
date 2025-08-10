import { Box, Button, Flex, HStack, Link as CLink, Spacer, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ColorModeToggle from './ColorModeToggle.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, setToken, setUser, role } = useAuth();

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <Box as="nav" bg="gray.800" color="white" px={6} py={3} boxShadow="sm" position="sticky" top={0} zIndex={10} opacity={0.98}>
      <Flex align="center">
        <Text fontWeight="bold" fontSize="xl" bgGradient="linear(to-r, brand.400, purple.400)" bgClip="text">Plotify</Text>
        <HStack spacing={4} ml={8}>
          <CLink as={Link} to="/">Home</CLink>
          <CLink as={Link} to="/plots">Explore Plots</CLink>
          {role === 'seller' && (
            <CLink as={Link} to="/dashboard">Seller Dashboard</CLink>
          )}
          {role === 'buyer' && (
            <CLink as={Link} to="/favorites">Favorites</CLink>
          )}
        </HStack>
        <Spacer />
        <HStack>
          <ColorModeToggle />
          {!isAuthenticated ? (
            <>
              <Button as={Link} to="/login" size="sm" variant="outline">Login</Button>
              <Button as={Link} to="/register" size="sm" colorScheme="purple">Sign Up</Button>
            </>
          ) : (
            <>
              <Text fontSize="sm">Hi, {user?.name}</Text>
              <Button size="sm" onClick={logout} colorScheme="red" variant="outline">Logout</Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
