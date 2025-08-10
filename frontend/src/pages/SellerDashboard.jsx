import { useState } from 'react';
import { Box, Button, Card, CardBody, FormControl, FormLabel, Heading, Image, Input, NumberInput, NumberInputField, SimpleGrid, Stack, Textarea, useToast } from '@chakra-ui/react';
import api from '../services/api.js';

export default function SellerDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files.slice(0, 6));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price) {
      toast({ status: 'warning', title: 'Please fill all required fields' });
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('price', String(price));
      images.forEach((file) => form.append('images', file));

      const { data } = await api.post('/plots', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast({ status: 'success', title: 'Plot created', description: data.title });
      setTitle('');
      setDescription('');
      setPrice(0);
      setImages([]);
    } catch (err) {
      toast({ status: 'error', title: 'Failed to create', description: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="xl">
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Create a new plot</Heading>
          <form onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput min={0} value={price} onChange={(v) => setPrice(v)}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Images (up to 6)</FormLabel>
                <Input type="file" accept="image/*" multiple onChange={onImagesChange} />
              </FormControl>
              {images.length > 0 && (
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                  {images.map((file, idx) => (
                    <Image key={idx} src={URL.createObjectURL(file)} alt={`preview-${idx}`} borderRadius="md" />
                  ))}
                </SimpleGrid>
              )}
              <Button type="submit" colorScheme="teal" isLoading={loading}>Save Plot</Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}
