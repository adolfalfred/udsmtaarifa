import { View, Text, FlatList, Dimensions, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image';
import type { PostProps } from '@/types/post';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import LikePost from './LikePost';
import CommentPost from './CommentPost';

const screenWidth = Dimensions.get('window').width;

export function PostComponent({ item, page = false, schooling = false }: { item: PostProps, page?: boolean, schooling?: boolean }) {
    const [activeIndex, setActiveIndex] = useState(0);

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

    if (page)
        return (
            <View className='w-full pt-4 pb-52'>
                <View className='w-full flex-row px-4 justify-between'>
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
                    <View className='flex-row items-center gap-1 px-4'>
                        <LikePost id={item.id} postLikes={item.likes} postLikers={item.postLikes} />
                        <CommentPost id={item.id} postComments={item.comments} />
                    </View>
                    <View className="px-4">
                        {item?.title ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text> : null}
                        {item?.content ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text> : null}
                    </View>
                </View>
            </View>
        )

    return (
        <View className='w-full py-4'>
            <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`} asChild>
                <Pressable className='w-full flex-row justify-between px-4'>
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
                            renderItem={({ item: image, index }) => (
                                <>
                                    {mediaArray.length > 1 && (
                                        <View
                                            className='absolute top-2 right-2 rounded-full flex-col items-center justify-center w-10 h-10 bg-black/50'
                                            style={{ zIndex: 1 }}>
                                            <Text className='text-foreground-dark dark:text-foreground-dark text-xs font-semibold'>{index + 1}/{mediaArray.length}</Text>
                                        </View>
                                    )}
                                    <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`} asChild>
                                        <Pressable className='overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5' style={{ width: screenWidth, height: screenWidth }}>
                                            <Image
                                                source={image.url}
                                                contentFit="cover"
                                                style={StyleSheet.absoluteFill}
                                                blurRadius={20}
                                                transition={500}
                                            />
                                            <Image
                                                source={image.url}
                                                contentFit="contain"
                                                style={{ width: '100%', height: '100%' }}
                                                transition={500}
                                            />
                                        </Pressable>
                                    </Link>
                                </>
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
                            </View>
                        )}
                    </View>
                )}
                <View className="px-4">
                    <View className='flex-row items-center gap-1'>
                        <LikePost id={item.id} postLikes={item.likes} postLikers={item.postLikes} />
                        <CommentPost id={item.id} postComments={item.comments} />
                    </View>
                    <View className='flex-row justify-between gap-1'>
                        {item?.title ?
                            <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`}>
                                <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                            </Link>
                            : null}
                        {item?.createdAt ?
                            <Text className='shrink-0 text-foreground-light/60 dark:text-foreground-dark/80 text-xs'>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            : null}
                    </View>
                    {item?.content ?
                        <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`} asChild>
                            <Pressable>
                                <Text
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                    className="text-foreground-light/60 dark:text-foreground-dark/80"
                                >
                                    {item.content}
                                </Text>
                            </Pressable>
                        </Link>
                        : null}
                </View>
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
                    className='w-full py-4'
                >
                    <View className='w-full h-96 bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            ))}
        </>
    );
}