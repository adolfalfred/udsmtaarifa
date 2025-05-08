import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <View className='bg-background-light dark:bg-background-dark'>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <MaterialIcons
          name="chevron-right"
          size={18}
          weight="medium"
          color={theme === 'dark' ? colors.foreground.dark : colors.foreground.light}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <Text className="text-foreground-light dark:text-foreground-dark">{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={{
        marginTop: 6,
        marginLeft: 24,
      }}>{children}</View>}
    </View>
  );
}
