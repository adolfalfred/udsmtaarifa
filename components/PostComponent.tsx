import { View, Text } from 'react-native'
import { Image } from 'expo-image';
import { PostProps } from '@/types/post';
import { Link } from 'expo-router';

export function PostComponent({ item, page = false }: { item: PostProps, page?: boolean }) {
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
                {item?.title
                    ? <>
                        {page
                            ? <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                            : <Link href={`/(stack)/(protected)/post/${item.id}`}>
                                <Text className='text-lg text-foreground-light dark:text-foreground-dark py-1'>{item.title}</Text>
                            </Link>
                        }
                    </>
                    : null}
                {item?.content
                    ? <>
                        {page
                            ? <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text>
                            : <Link href={`/(stack)/(protected)/post/${item.id}`}>
                                <Text className='text-foreground-light/60 dark:text-foreground-dark/80'>{item.content}</Text>
                            </Link>
                        }
                    </>
                    : null}
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