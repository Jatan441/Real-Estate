import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
  },
  styles: {
    global: {
      body: {
        bg: { base: 'gray.50', _dark: 'gray.900' },
      },
    },
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'brand' },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
        },
      },
    },
  },
});

export default theme;
