import { useEffect, useState } from 'react';
import { Box, Card, CardBody, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function Favorites() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/users/favorites');
        setPlots(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box>
      <Heading size="md" mb={4}>Your Favorites</Heading>
      {plots.length === 0 ? (
        <Text color="gray.600">No favorites yet.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1 }} spacing={4}>
          {plots.map((plot) => (
            <Card key={plot._id} as={Link} to={`/plots/${plot._id}`} _hover={{ boxShadow: 'md' }}>
              <CardBody>
                <Heading size="sm">{plot.title}</Heading>
                <Text color="gray.600" noOfLines={2}>{plot.description}</Text>
                <Text mt={2} fontWeight="bold">${plot.price.toLocaleString()}</Text>
                <Text fontSize="sm" color="gray.500">Seller: {plot.seller?.name || 'Unknown'}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}


