import { IconButton, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label="Toggle color mode"
      icon={isDark ? <SunIcon /> : <MoonIcon />}
      variant="ghost"
    />
  );
}


