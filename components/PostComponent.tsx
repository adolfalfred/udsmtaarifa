import { View, Text, FlatList, Dimensions, Pressable } from 'react-native'
import { Image } from 'expo-image';
import type { PostProps } from '@/types/post';
import { Link } from 'expo-router';
import { useState } from 'react';

const screenWidth = Dimensions.get('window').width;

export function PostComponent({ item, page = false, schooling = false }: { item: PostProps, page?: boolean, schooling?: boolean }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const mediaArray = item.media ? Object.values(item.media) : [];

    if (page)
        return (
            <View className='w-full px-6 py-4'>
                <View className='w-full flex-row justify-between'>
                    <View className='gap-2 flex-row items-center'>
                        <View className='w-14 h-14 rounded-full overflow-hidden'>
                            <Image
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: '#0553',
                                    borderRadius: '100%'
                                }}
                                source={item.user.image}
                                contentFit="cover"
                                transition={1000}
                            />
                        </View>
                        <View>
                            <Text className='text-foreground-light dark:text-foreground-dark'>{item.user.name}</Text>
                            <Text className='text-[#aaa]'>{item.user.email}</Text>
                        </View>
                    </View>

                </View>
                <View>
                    {item?.title ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text> : null}
                    {item?.content ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text> : null}

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
                                    <View className='rounded-lg bg-foreground-light/10 dark:bg-foreground-dark/10 overflow-hidden' style={{ width: screenWidth - 48, height: 300 }}>
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
            </View>

        )
    return (
        <View className='w-full px-6 py-4'>
            <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`} asChild>
                <Pressable className='w-full flex-row justify-between'>
                    <View className='gap-2 flex-row items-center'>
                        <View className='w-14 h-14 rounded-full overflow-hidden'>
                            <Image
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: '#0553',
                                    borderRadius: '100%'
                                }}
                                source={item.user.image}
                                contentFit="cover"
                                transition={1000}
                            />
                        </View>
                        <View>
                            <Text className='text-foreground-light dark:text-foreground-dark'>{item.user.name}</Text>
                            <Text className='text-[#aaa]'>{item.user.email}</Text>
                        </View>
                    </View>

                </Pressable>
            </Link>
            <View>
                {item?.title ?
                    <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`}>
                        <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                    </Link>
                    : null}

                {item?.content ?
                    <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`}>
                        <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text>
                    </Link>
                    : null}

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
                                <View className='rounded-lg bg-foreground-light/10 dark:bg-foreground-dark/10 overflow-hidden' style={{ width: screenWidth - 48, height: 300 }}>
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
        </View>

    )
}

export const PostSkeleton = ({ count }: { count: number }) => {
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