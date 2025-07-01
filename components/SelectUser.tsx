import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { useCallback, useMemo, useRef, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUsersQuery } from '@/queries/useUserQuery';
import type { UserProps } from '@/types/user';
import { colors } from '@/constants/Colors';
import { Image } from 'expo-image';

export default function SelectUser({
    userIds,
    setUserIds,
    type
}: {
    userIds: string[];
    setUserIds: (userIds: string[]) => void;
    type: 'group' | 'chat'
}) {
    const [selected, setSelected] = useState<UserProps[]>([])
    const [query, setQuery] = useState("");

    const colorScheme = useColorScheme()

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    const snapPoints = useMemo(() => ['100%'], []);

    const { data, isLoading } = useUsersQuery(query, 1)

    const header = useMemo(() => (
        <BottomSheetTextInput
            className="my-4 mx-4 border border-[#aaa] px-3 py-5 rounded-full mb-3 text-black dark:text-white bg-background-light dark:bg-background-dark"
            placeholder="Search user..."
            placeholderTextColor="#999"
            value={query}
            cursorColor={colors.primary[colorScheme]}
            onChangeText={(e) => {
                if (e === '' && type !== 'group') setSelected([])
                setQuery(e)
            }}
            autoFocus
        />
    ), [colorScheme, query, type]);

    return (
        <>
            <TouchableOpacity
                className="flex-row flex-wrap gap-2 items-center w-full py-1 pl-1.5 pr-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-[28px]"
                onPress={presentModal}>
                {selected.length > 0 ? (
                    <>
                        {selected.map(item => (
                            <View key={item.id} className='flex-row flex-wrap gap-1 items-center rounded-full bg-foreground-light/20 dark:bg-foreground-dark/20 p-1 pr-3'>
                                <View className='w-12 h-12 rounded-full overflow-hidden bg-foreground-light/10 dark:bg-foreground-dark/10'>
                                    {item && item.image ?
                                        <Image
                                            style={{
                                                flex: 1,
                                                width: '100%',
                                                borderRadius: '100%'
                                            }}
                                            source={item.image}
                                            cachePolicy='none'
                                            contentFit="cover"
                                        />
                                        : null}
                                </View>
                                <View className="h-10 flex-col justify-center">
                                    <Text className="text-foreground-light dark:text-foreground-dark">
                                        {item.name}
                                    </Text>
                                    <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-xs">
                                        {item.email}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </>
                ) : (
                    <>
                        <View className="h-14 flex-col items-center justify-center">
                            <Text className="text-[#aaa] text-lg pl-3.5">
                                {type === 'group' ? 'Select Users' : 'Select User'}
                            </Text>
                        </View>
                    </>
                )}
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectUser'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                topInset={StatusBar.currentHeight || 0}
                keyboardBehavior="extend"
                enableDynamicSizing={false}
                snapPoints={snapPoints}
                onDismiss={() => closeModal()}
                backdropComponent={(props) => <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />}
            >
                {header}
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    className='px-4'
                    ListEmptyComponent={() => {
                        if (isLoading) return <ItemSkeleton count={10} />
                        return <Text className="text-foreground-light dark:text-foreground-dark text-center mt-44">No users found!</Text>
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex-row gap-2 p-2 my-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            style={{ backgroundColor: userIds.includes(item.id) ? `${colors.foreground[colorScheme]}20` : undefined }}
                            onPress={() => {
                                if (type === 'group') {
                                    const exists = selected.find((u) => u.id === item.id);
                                    const updated = exists
                                        ? selected.filter((u) => u.id !== item.id)
                                        : [...selected, item];

                                    setSelected(updated);
                                    setUserIds(updated.map((u) => u.id));
                                } else {
                                    setSelected([item]);
                                    setUserIds([item.id]);
                                    closeModal();
                                }
                            }}
                        >
                            <View className='w-12 h-12 rounded-full overflow-hidden bg-foreground-light/20 dark:bg-foreground-dark/20'>
                                {item && item.image ?
                                    <Image
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            borderRadius: '100%'
                                        }}
                                        source={item.image}
                                        cachePolicy='none'
                                        contentFit="cover"
                                    />
                                    : null}
                            </View>
                            <View className="h-10 flex-col justify-between">
                                <Text className="text-foreground-light dark:text-foreground-dark text-lg">
                                    {item ? `${item.name}` : "User"}
                                </Text>
                                <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-base">
                                    {item ? `${item.email}` : "User Email"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </BottomSheetModal>
        </>
    )
}


const ItemSkeleton = ({ count }: { count: number; }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View key={i} className='flex flex-col gap-0.5 mb-4 px-4'>
                    <View className='gap-2 flex-row items-center'>
                        <View className='w-10 h-10 rounded-full overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5' />
                        <View className='flex-col gap-1'>
                            <View className='h-3 w-24 rounded bg-foreground-light/5 dark:bg-foreground-dark/5' />
                            <View className='h-3 w-40 rounded bg-foreground-light/5 dark:bg-foreground-dark/5' />
                        </View>
                    </View>
                </View>
            ))}
        </>
    )
}