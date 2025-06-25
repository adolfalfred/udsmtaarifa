import { Link, type ExternalPathString, type RelativePathString } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native'
import { Image } from 'expo-image';

export default function ImagePlayerView({ media, maxMediaHeight, screenWidth, href }: {
    href?: RelativePathString | ExternalPathString | any,
    maxMediaHeight: number,
    screenWidth: number;
    media: {
        url: string;
        blur: string | null;
        width: number | null;
        height: number | null;
        duration: number | null;
    }
}) {
    if (href)
        return (
            <Link href={href} asChild>
                <Pressable
                    className='overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5'
                    style={{ width: screenWidth, height: screenWidth }}>
                    <Image
                        source={media.url}
                        contentFit="cover"
                        style={StyleSheet.absoluteFill}
                        blurRadius={20}
                        transition={500}
                    />
                    <Image
                        source={media.url}
                        contentFit="contain"
                        style={{ width: '100%', height: '100%' }}
                        transition={500}
                    />
                </Pressable>
            </Link>
        )
    return (
        <View
            className='overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5'
            style={{ width: screenWidth, height: maxMediaHeight }}>
            <Image
                source={media.url}
                contentFit="cover"
                style={StyleSheet.absoluteFill}
                blurRadius={20}
                transition={500}
            />
            <Image
                source={media.url}
                contentFit="contain"
                style={{ width: '100%', height: '100%' }}
                transition={500}
            />
        </View>
    )
}