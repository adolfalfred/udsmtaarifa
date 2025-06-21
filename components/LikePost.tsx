import { type UserProps, useSessionStore } from '@/lib/zustand/useSessionStore'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme'
import { View, Text, Pressable, StatusBar } from 'react-native'
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'

export default function LikePost({ id, postLikes, postLikers }: { id: string; postLikes: number, postLikers: UserProps[] }) {
    const { user } = useSessionStore()
    const colorScheme = useColorScheme()

    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [likes, setLikes] = useState(postLikes)
    const [likers, setLikers] = useState(postLikers)

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        try {
            setIsLoading(true)
            // fetch likers array from reactQuery and update likers state
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    const snapPoints = useMemo(() => ['65%', '100%'], []);

    const likeFxn = async () => {
        if (loading) return
        try {
            setLoading(true)
            if (user?.id && likers.some(liker => liker.id === user.id)) {
                setLikes(prevLikes => prevLikes - 1);
                setLikers(prev => prev.filter(liker => liker.id !== user!.id));
            } else {
                setLikes(prevLikes => prevLikes + 1);
                setLikers(prev => [...prev, user!]);
            }
        } catch (err) {
            setLikes(postLikes);
            setLikers(postLikers)
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <View className='flex-row items-center gap-2 min-w-20 shrink-0'>
                <Pressable onPress={likeFxn}>
                    <FontAwesome
                        className='mb-1.5'
                        size={22}
                        name={user?.id && likers.some(liker => liker.id === user.id) ? 'heart' : 'heart-o'}
                        color={user?.id && likers.some(liker => liker.id === user.id) ? `${colors.danger[colorScheme]}e0` : `${colors.foreground[colorScheme]}e0`}
                    />
                </Pressable>
                <Pressable onPress={presentModal} className='min-w-6'>
                    <Text className='text-foreground-light/60 dark:text-foreground-dark text-sm'>
                        {likes.toLocaleString('en-US')}
                    </Text>
                </Pressable>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectCategories'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                backdropComponent={() => <View className='bg-black/40 flex-1 absolute inset-0'></View>}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}
            >
                <BottomSheetView className='flex-1 p-6 bg-background-light dark:bg-background-dark'>
                    <BottomSheetFlatList
                        data={likers}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={({ item }) => (
                            <View className='gap-2 flex-row items-center'>
                                <View className='w-14 h-14 rounded-full overflow-hidden'>
                                    <Image
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            backgroundColor: '#0553',
                                            borderRadius: '100%'
                                        }}
                                        source={item?.image}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                </View>
                                <View>
                                    <Text className='text-foreground-light dark:text-foreground-dark'>{item.name}</Text>
                                    <Text className='text-[#aaa]'>{item.email}</Text>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={() => {
                            if (isLoading) return (
                                <>
                                    <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                    <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                </>
                            )
                            return <Text className="text-black dark:text-white text-center mt-10">No likes yet!</Text>
                        }}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}