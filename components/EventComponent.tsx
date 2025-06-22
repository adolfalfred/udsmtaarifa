import { View, Text, FlatList, Dimensions, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image';
import type { EventProps } from '@/types/event';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { convertISOToReadable } from '@/lib/utils';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

export function EventComponent({ item, page = false }: { item: EventProps, page?: boolean }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const colorScheme = useColorScheme()

    const mediaArray = useMemo(() => {
        return item.media ? Object.values(item.media) : [];
    }, [item.media]);

    const maxImageHeight = useMemo(() => {
        return Math.max(
            ...mediaArray.map(img =>
                img.height && img.width ? (img.height / img.width) * screenWidth : 0
            )
        );
    }, [mediaArray]);

    const maxDots = 5;
    const half = Math.floor(maxDots / 2);

    const start = Math.max(0, activeIndex - half);
    const end = Math.min(mediaArray.length, start + maxDots);
    const visibleDots = mediaArray.slice(start, end);

    if (!page)
        return (
            <Link href={`/(stack)/(protected)/(tabs)/events/${item.id}`} asChild>
                <Pressable className='flex flex-row overflow-hidden h-36 w-full px-2 my-1.5'>
                    <View
                        className='flex-grow p-3 w-1/2 bg-foreground-light/5 dark:bg-foreground-dark/5'
                        style={{
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderLeftWidth: 1,
                            borderColor: `${colors.foreground[colorScheme]}20`,
                            borderTopRightRadius: mediaArray.length > 0 ? 0 : 16,
                            borderBottomRightRadius: mediaArray.length > 0 ? 0 : 16,
                            borderRightWidth: mediaArray.length > 0 ? 0 : 1,
                        }}>
                        {item?.title ? (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                className='text-lg text-foreground-light dark:text-foreground-dark py-1'
                            >
                                {item.title}
                            </Text>
                        ) : null}
                        {item?.content ? (
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                className='text-foreground-light/60 dark:text-foreground-dark/80 truncate text-xs'
                            >
                                {item.content}
                            </Text>
                        ) : null}
                        <View className='mt-auto mb-0'>
                            {item?.location ?
                                <View className='flex-row gap-2 mt-1'>
                                    <FontAwesome size={16} name="map-marker" className='w-4 shrink-0' color={colors.success[colorScheme]} />
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        className='text-foreground-light/60 dark:text-foreground-dark/80'
                                    >
                                        {item.location}
                                    </Text>
                                </View>
                                : null}
                            {item?.date ?
                                <View className='flex-row gap-2 mt-1'>
                                    <FontAwesome size={14} name="calendar-times-o" className='w-4 shrink-0' color={colors.secondary[colorScheme]} />
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        className='text-foreground-light/60 dark:text-foreground-dark/80'
                                    >
                                        {convertISOToReadable(item.date)}
                                    </Text>
                                </View>
                                : null}
                        </View>
                    </View>

                    {mediaArray.length > 0 ? (
                        <View
                            className='w-36 h-36 shrink-0 overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5'
                            style={{
                                borderTopRightRadius: 16,
                                borderBottomRightRadius: 16,
                            }}
                        >
                            <Image
                                source={mediaArray[0].url}
                                contentFit="cover"
                                style={StyleSheet.absoluteFill}
                                blurRadius={20}
                                transition={500}
                            />
                            <Image
                                source={mediaArray[0].url}
                                contentFit='contain'
                                style={{ width: '100%', height: '100%' }}
                                transition={500}
                            />
                        </View>
                    ) : null}
                </Pressable>
            </Link>
        )
    return (
        <View className='w-full py-4'>
            <View className='px-4'>
                {item?.title
                    ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                    : null}
                {item?.content
                    ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text>
                    : null}
                {item?.location ?
                    <View className='flex-row gap-2 mt-3'>
                        <FontAwesome size={16} name="map-marker" className='w-4 shrink-0' color={colors.success[colorScheme]} />
                        <Text
                            className='text-foreground-light/60 dark:text-foreground-dark/80'
                        >
                            {item.location}
                        </Text>
                    </View>
                    : null}
                {item?.date ?
                    <View className='flex-row gap-2 mt-2'>
                        <FontAwesome size={14} name="calendar-times-o" className='w-4 shrink-0' color={colors.secondary[colorScheme]} />
                        <Text
                            className='text-foreground-light/60 dark:text-foreground-dark/80'
                        >
                            {convertISOToReadable(item.date)}
                        </Text>
                    </View>
                    : null}
            </View>

            {mediaArray.length > 0 && (
                <View className="my-2">
                    <FlatList
                        data={mediaArray}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                            setActiveIndex(index);
                        }}
                        renderItem={({ item }) => (
                            <View className='overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5' style={{ width: screenWidth, height: maxImageHeight }}>
                                <Image
                                    source={item.url}
                                    contentFit="cover"
                                    style={StyleSheet.absoluteFill}
                                    blurRadius={20}
                                    transition={500}
                                />
                                <Image
                                    source={item.url}
                                    contentFit="contain"
                                    style={{ width: '100%', height: '100%' }}
                                    transition={500}
                                />
                            </View>
                        )}
                    />

                    {mediaArray.length > 1 && (
                        <View className="flex-row justify-center -mt-4 pb-2 gap-1">
                            {visibleDots.map((_, i) => {
                                const dotIndex = start + i;
                                return (
                                    <View
                                        key={dotIndex}
                                        className={`w-2 h-2 rounded-full ${i === activeIndex ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300/50 dark:bg-gray-600/30'}`}
                                    />
                                )
                            })}
                        </View>)}
                </View>
            )}

        </View>
    )
}

export const EventSkeleton = ({ count, page }: { count: number, page?: true }) => {
    if (page) return (
        <View className='w-full py-1.5'>
            <View className='h-32' />
            <View className='w-full h-40 bg-foreground-light/5 dark:bg-foreground-dark/5' />
        </View>
    )
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    className='w-full px-2 py-1.5'
                >
                    <View className='w-full h-36 rounded-2xl bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            ))}
        </>
    );
}