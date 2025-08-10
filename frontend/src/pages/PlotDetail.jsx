import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AspectRatio, Box, Button, Card, CardBody, Heading, HStack, IconButton, SimpleGrid, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function PlotDetail() {
  const { id } = useParams();
  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/plots/${id}`);
        setPlot(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (isAuthenticated && role === 'buyer') {
        try {
          const { data } = await api.get('/users/favorites');
          setFavorited(data.some((p) => p._id === id));
        } catch {}
      } else {
        setFavorited(false);
      }
    })();
  }, [id, isAuthenticated, role]);

  if (loading) return <Box display="flex" alignItems="center" justifyContent="center" h="60vh"><Spinner /></Box>;

  if (!plot) return <Box>Not found</Box>;

  const toggleFavorite = async () => {
    if (!(isAuthenticated && role === 'buyer')) {
      toast({ status: 'info', title: 'Login as buyer to favorite plots' });
      return;
    }
    try {
      if (favorited) {
        await api.delete(`/users/favorites/${id}`);
        setFavorited(false);
      } else {
        await api.post(`/users/favorites/${id}`);
        setFavorited(true);
      }
    } catch (err) {
      toast({ status: 'error', title: 'Failed to update favorites' });
    }
  };

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} alignItems="start">
      <Card>
        <CardBody>
          {plot.images?.length > 0 ? (
            <AspectRatio ratio={16 / 9} borderRadius="lg" overflow="hidden">
              <Box>
                <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} style={{ height: '100%' }}>
                  {plot.images.map((src, idx) => (
                    <SwiperSlide key={idx}>
                      <Box bg="black" display="flex" alignItems="center" justifyContent="center" h="100%">
                        <img src={src} alt={`plot-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </AspectRatio>
          ) : (
            <Box h="320px" bg="gray.100" borderRadius="lg" />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing={3}>
            <HStack justify="space-between" align="start">
              <Heading size="lg">{plot.title}</Heading>
              <IconButton aria-label="favorite" icon={favorited ? <FaHeart color="#E53E3E" /> : <FaRegHeart />} variant="ghost" onClick={toggleFavorite} />
            </HStack>
            <Text color="gray.700">{plot.description}</Text>
            <Text fontWeight="bold" fontSize="xl">${plot.price.toLocaleString()}</Text>
            <Text fontSize="sm" color="gray.500">Seller: {plot.seller?.name || 'Unknown'}</Text>
            {plot.seller?.email && (
              <Button as="a" href={`mailto:${plot.seller.email}?subject=Interest in ${encodeURIComponent(plot.title)}`} colorScheme="teal" width="fit-content">Contact Seller</Button>
            )}
          </Stack>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
}
