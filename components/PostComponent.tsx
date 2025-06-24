import { View, Text, Pressable } from 'react-native'
import { convertISOToReadable } from '@/lib/utils';
import type { PostProps } from '@/types/post';
import CommentPost from './CommentPost';
import MediaSlider from './MediaSlider';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import LikePost from './LikePost';
import { useMemo } from 'react';

export function PostComponent({ item, page = false, schooling = false }: { item: PostProps, page?: boolean, schooling?: boolean }) {
    const mediaArray = useMemo(() => {
        return item.media ? Object.values(item.media) : [];
    }, [item.media]);

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
                    {mediaArray.length > 0 && <MediaSlider mediaArray={mediaArray} />}
                    <View className='flex-row items-center justify-between'>
                        <View className='flex-row items-center gap-1 px-4'>
                            <LikePost id={item.id} postLikes={item.likes} postLikers={item.postLikes} />
                            <CommentPost id={item.id} postComments={item.comments} />
                        </View>
                        {item?.createdAt ?
                            <Text className='shrink-0 text-foreground-light/60 dark:text-foreground-dark/80 text-xs'>{convertISOToReadable(item.createdAt)}</Text>
                            : null}
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
                {mediaArray.length > 0 && <MediaSlider mediaArray={mediaArray} href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`} />}
                <View className="px-4">
                    <View className='flex-row items-center justify-between'>
                        <View className='flex-row items-center gap-1'>
                            <LikePost id={item.id} postLikes={item.likes} postLikers={item.postLikes} />
                            <CommentPost id={item.id} postComments={item.comments} />
                        </View>
                        {item?.createdAt ?
                            <Text className='shrink-0 text-foreground-light/60 dark:text-foreground-dark/80 text-xs'>{convertISOToReadable(item.createdAt)}</Text>
                            : null}
                    </View>
                    {item?.title ?
                        <Link href={schooling ? `/(stack)/(protected)/(tabs)/schooling/${item.id}` : `/(stack)/(protected)/(tabs)/news/${item.id}`}>
                            <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                        </Link>
                        : null}
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

export const PostSkeleton = ({ count, page }: { count: number; page?: true }) => {
    return (
        <>
            {Array.from({ length: page ? 1 : count }).map((_, i) => (
                <View key={i} className='w-full py-4' >
                    <View className='gap-2 flex-row items-center mb-2 px-4'>
                        <View className='w-14 h-14 rounded-full overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5' />
                        <View>
                            <View className='bg-foreground-light/5 dark:bg-foreground-dark/5 w-24 h-3' />
                            <View className='bg-foreground-light/5 dark:bg-foreground-dark/5 w-32 h-3 mt-1' />
                        </View>
                    </View>
                    <View className='w-full h-80 bg-foreground-light/5 dark:bg-foreground-dark/5' />
                </View>
            ))}
        </>
    );
}