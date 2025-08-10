import { useEffect, useState } from 'react';
import { Box, Button, Card, CardBody, Heading, HStack, IconButton, Image, Input, NumberInput, NumberInputField, SimpleGrid, Skeleton, Text, useToast, FormControl, FormLabel } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Plots() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const { isAuthenticated, role } = useAuth();
  const toast = useToast();

  const fetchPlots = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/plots', { params });
      setPlots(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  useEffect(() => {
    (async () => {
      if (isAuthenticated && role === 'buyer') {
        try {
          const { data } = await api.get('/users/favorites');
          setFavorites(new Set(data.map((p) => p._id)));
        } catch {}
      } else {
        setFavorites(new Set());
      }
    })();
  }, [isAuthenticated, role]);

  const applyFilters = () => {
    fetchPlots({ q: q || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined });
  };

  const resetFilters = () => {
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    fetchPlots();
  };

  const toggleFavorite = async (plotId) => {
    if (!(isAuthenticated && role === 'buyer')) {
      toast({ status: 'info', title: 'Login as buyer to favorite plots' });
      return;
    }
    try {
      if (favorites.has(plotId)) {
        await api.delete(`/users/favorites/${plotId}`);
        const copy = new Set(favorites);
        copy.delete(plotId);
        setFavorites(copy);
      } else {
        await api.post(`/users/favorites/${plotId}`);
        const copy = new Set(favorites);
        copy.add(plotId);
        setFavorites(copy);
      }
    } catch (err) {
      toast({ status: 'error', title: 'Failed to update favorites' });
    }
  };

  return (
    <>
      <Card mb={6} bgGradient="linear(to-r, brand.500, purple.600)" color="white">
        <CardBody>
          <Heading size="lg">Find your perfect plot</Heading>
          <Text mt={2} color="whiteAlpha.900">Search listings and browse photos to discover your match.</Text>
        </CardBody>
      </Card>

      <Card mb={4}>
        <CardBody>
          <HStack spacing={3} align="end">
            <FormControl>
              <FormLabel mb={1}>Search</FormLabel>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or description" />
            </FormControl>
            <FormControl maxW="36">
              <FormLabel mb={1}>Min Price</FormLabel>
              <NumberInput value={minPrice} onChange={(v) => setMinPrice(v)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl maxW="36">
              <FormLabel mb={1}>Max Price</FormLabel>
              <NumberInput value={maxPrice} onChange={(v) => setMaxPrice(v)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <Button onClick={applyFilters}>Apply</Button>
            <Button onClick={resetFilters} variant="outline">Reset</Button>
          </HStack>
        </CardBody>
      </Card>

      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardBody><Skeleton height="200px" /></CardBody></Card>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {plots.map((plot) => (
            <Card key={plot._id} as={Link} to={`/plots/${plot._id}`} _hover={{ boxShadow: 'lg' }}>
              <CardBody>
                {plot.images?.[0] && (
                  <Image src={plot.images[0]} alt={plot.title} borderRadius="md" mb={3} objectFit="cover" w="100%" h="200px" />
                )}
                <Heading size="sm">{plot.title}</Heading>
                <Text color="gray.600" noOfLines={2}>{plot.description}</Text>
                <HStack justify="space-between" mt={2}>
                  <Text fontWeight="bold">${plot.price.toLocaleString()}</Text>
                  <IconButton
                    aria-label="favorite"
                    icon={favorites.has(plot._id) ? <FaHeart color="#E53E3E" /> : <FaRegHeart />}
                    variant="ghost"
                    onClick={(e) => { e.preventDefault(); toggleFavorite(plot._id); }}
                  />
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
