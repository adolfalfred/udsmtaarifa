import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'expo-image';
import { Platform, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={{ height: 176, width: 288, left: 0, bottom: 0, position: 'absolute' }}
        />
      }>
      <View className='flex-row items-center gap-2'>
        <Text className='text-foreground-light dark:text-foreground-dark'>Welcome!</Text>
        <HelloWave />
      </View>
      <View className='gap-2 mb-2'>
        <Text className='text-foreground-light dark:text-foreground-dark'>Step 1: Try it</Text>
        <Text className='text-foreground-light dark:text-foreground-dark'>
          Edit <Text className='text-foreground-light dark:text-foreground-dark'>app/(tabs)/index.tsx</Text> to see changes.
          Press{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </Text>{' '}
          to open developer tools.
        </Text>
      </View>
      <View className='gap-2 mb-2'>
        <Text className='text-foreground-light dark:text-foreground-dark'>Step 2: Explore</Text>
        <Text className='text-foreground-light dark:text-foreground-dark'>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </Text>
      </View>
      <View className='gap-2 mb-2'>
        <Text className='text-foreground-light dark:text-foreground-dark'>Step 3: Get a fresh start</Text>
        <Text className='text-foreground-light dark:text-foreground-dark'>
          {`When you're ready, run `}
          <Text className='text-foreground-light dark:text-foreground-dark'>npm run reset-project</Text> to get a fresh{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>app</Text> directory. This will move the current{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>app</Text> to{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>app-example</Text>.
        </Text>
      </View>
    </ParallaxScrollView>
  );
}