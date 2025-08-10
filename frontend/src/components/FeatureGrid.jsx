import { SimpleGrid, Box, Icon, Heading, Text, Stack } from '@chakra-ui/react';
import { CheckCircleIcon, LockIcon, StarIcon } from '@chakra-ui/icons';

function Feature({ icon, title, desc }) {
  return (
    <Stack p={6} borderWidth="1px" borderRadius="lg" spacing={3} _hover={{ boxShadow: 'md' }}>
      <Icon as={icon} boxSize={8} color="brand.600" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{desc}</Text>
    </Stack>
  );
}

export default function FeatureGrid() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <Feature icon={StarIcon} title="Beautiful Listings" desc="Photo-first cards with clean, modern design and fast browsing." />
      <Feature icon={CheckCircleIcon} title="Easy Selling" desc="Create listings in minutes with multi-image uploads." />
      <Feature icon={LockIcon} title="Secure Accounts" desc="Role-based auth, password resets, and privacy by default." />
    </SimpleGrid>
  );
}


