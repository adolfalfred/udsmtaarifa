import { View, Text, FlatList, Dimensions, Pressable } from 'react-native'
import { Image } from 'expo-image';
import type { EventProps } from '@/types/event';
import { Link } from 'expo-router';
import { useState } from 'react';
import { convertISOToReadable } from '@/lib/utils';

const screenWidth = Dimensions.get('window').width;

export function EventComponent({ item, page = false }: { item: EventProps, page?: boolean }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const mediaArray = item.media ? Object.values(item.media) : [];

    if (!page)
        return (
            <Link href={`/(stack)/(protected)/(tabs)/events/${item.id}`} asChild>
                <Pressable className='w-full px-6 py-4'>
                    <View className='flex flex-row gap-2 justify-between border border-foreground-light/20 dark:border-foreground-dark/20 rounded-xl overflow-hidden'>
                        <View className='p-3 w-1/2'>
                            {item?.title
                                ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                                : null}
                            {item?.content
                                ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80 truncate'>{item.content}</Text>
                                : null}
                        </View>

                        {mediaArray.length > 0 ? (
                            <View className='w-36 h-36 shrink-0'>
                                <Image
                                    source={mediaArray[0].url}
                                    contentFit='cover'
                                    style={{ width: '100%', height: '100%' }}
                                    placeholder={mediaArray[0].blur || undefined}
                                    transition={500}
                                />
                            </View>
                        ) : null}
                    </View>
                </Pressable>
            </Link>
        )
    return (
        <View className='w-full px-6 py-4'>
            <View className='p-3'>
                {item?.title
                    ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                    : null}
                {item?.content
                    ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text>
                    : null}
                {item?.date
                    ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{convertISOToReadable(item.date)}</Text>
                    : null}
                {item?.startTime
                    ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.startTime}{item?.endTime ? ` - ${item.endTime}` : null}</Text>
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
                            <View className='bg-foreground-light/10 dark:bg-foreground-dark/10 rounded-lg' style={{ width: screenWidth - 48, height: 300, overflow: 'hidden' }}>
                                <Image
                                    source={item.url}
                                    contentFit='contain'
                                    style={{ width: '100%', height: '100%' }}
                                    placeholder={item.blur || undefined}
                                    transition={500}
                                />
                            </View>
                        )}
                    />

                    <View className="flex-row justify-center mt-2 space-x-1">
                        {mediaArray.map((_, i) => (
                            <View
                                key={i}
                                className={`w-2 h-2 rounded-full ${i === activeIndex ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300/50 dark:bg-gray-600/30'}`}
                            />
                        ))}
                    </View>
                </View>
            )}

        </View>
    )
}

export const EventSkeleton = ({ count }: { count: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View
                    key={i}
                    className='w-full px-6 py-4'
                >
                    <View className='w-full h-96 rounded-2xl bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            ))}
        </>
    );
}