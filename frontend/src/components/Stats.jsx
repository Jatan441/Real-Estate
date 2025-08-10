import { Box, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';

function StatCard({ label, number, help }) {
  return (
    <Stat p={6} borderWidth="1px" borderRadius="lg" _hover={{ boxShadow: 'md' }}>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{number}</StatNumber>
      <StatHelpText>{help}</StatHelpText>
    </Stat>
  );
}

export default function Stats() {
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatCard label="Listings" number="1,200+" help="Active plots on Plotify" />
        <StatCard label="Sellers" number="350+" help="Trusted sellers" />
        <StatCard label="Buyers" number="5,000+" help="Happy users" />
      </SimpleGrid>
    </Box>
  );
}


