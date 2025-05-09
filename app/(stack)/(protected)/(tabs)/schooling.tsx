import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Platform, Text, View } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <MaterialIcons
          size={200}
          color="#808080"
          name='code'
          className='-bottom-2 -left-2 absolute'
        />
      }>
      <View className='flex-row gap-2'>
        <Text className='text-foreground-light dark:text-foreground-dark'>Explore</Text>
      </View>
      <Text className='text-foreground-light dark:text-foreground-dark'>This app includes example code to help you get started.</Text>
      <Collapsible title="File-based routing">
        <Text className='text-foreground-light dark:text-foreground-dark'>
          This app has two screens:{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>app/(tabs)/index.tsx</Text> and{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>app/(tabs)/explore.tsx</Text>
        </Text>
        <Text className='text-foreground-light dark:text-foreground-dark'>
          The layout file in <Text className='text-foreground-light dark:text-foreground-dark'>app/(tabs)/_layout.tsx</Text>{' '}
          sets up the tab navigator.
        </Text>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Text className='text-foreground-light dark:text-foreground-dark'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <Text className='text-foreground-light dark:text-foreground-dark'>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>w</Text> in the terminal running this project.
        </Text>
      </Collapsible>
      <Collapsible title="Images">
        <Text className='text-foreground-light dark:text-foreground-dark'>
          For static images, you can use the <Text className='text-foreground-light dark:text-foreground-dark'>@2x</Text> and{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>@3x</Text> suffixes to provide files for
          different screen densities
        </Text>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <Text className='text-foreground-light dark:text-foreground-dark'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <Text className='text-foreground-light dark:text-foreground-dark'>
          Open <Text className='text-foreground-light dark:text-foreground-dark'>app/_layout.tsx</Text> to see how to load{' '}
          <Text style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </Text>
        </Text>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <Text className='text-foreground-light dark:text-foreground-dark'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <Text className='text-foreground-light dark:text-foreground-dark'>
          This template has light and dark mode support. The{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>useColorScheme()</Text> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </Text>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <Text className='text-foreground-light dark:text-foreground-dark'>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <Text className='text-foreground-light dark:text-foreground-dark'>
          This template includes an example of an animated component. The{' '}
          <Text className='text-foreground-light dark:text-foreground-dark'>components/HelloWave.tsx</Text> component uses
          the powerful <Text className='text-foreground-light dark:text-foreground-dark'>react-native-reanimated</Text>{' '}
          library to create a waving hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text className='text-foreground-light dark:text-foreground-dark'>
              The <Text className='text-foreground-light dark:text-foreground-dark'>components/ParallaxScrollView.tsx</Text>{' '}
              component provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}