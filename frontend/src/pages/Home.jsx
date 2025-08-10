import { Box, Container, VStack } from '@chakra-ui/react';
import Hero from '../components/Hero.jsx';
import FeatureGrid from '../components/FeatureGrid.jsx';
import Stats from '../components/Stats.jsx';
import CTA from '../components/CTA.jsx';

export default function Home() {
  return (
    <Box>
      <Hero />
      <Container maxW="6xl" py={10}>
        <VStack spacing={12} align="stretch">
          <FeatureGrid />
          <Stats />
          <CTA />
        </VStack>
      </Container>
    </Box>
  );
}


