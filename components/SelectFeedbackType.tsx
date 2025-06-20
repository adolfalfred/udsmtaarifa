import { BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { useCallback, useMemo, useRef } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import { useFeedbacktypesQuery } from '@/queries/useFeedbackTypeQuery';

export default function SelectFeedbackType({
    type,
    setType,
}: {
    type: string | null;
    setType: React.Dispatch<React.SetStateAction<string | null>>
}) {
    const colorScheme = useColorScheme()

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    const snapPoints = useMemo(() => ['50%', '100%'], []);

    const { data, isLoading } = useFeedbacktypesQuery("", 1)

    return (
        <>
            <TouchableOpacity
                className="my-3 flex-row items-center w-full py-5 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full"
                onPress={presentModal}>
                <Text className="text-[#aaa] text-lg">
                    {type ? `${type}` : "Select Type"}
                </Text>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectFeedbackType'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                backdropComponent={() => <View className='bg-black/40 flex-1 absolute inset-0'></View>}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}
            >
                <BottomSheetView className='flex-1 h-[90vh] p-6 bg-background-light dark:bg-background-dark'>
                    <BottomSheetFlatList
                        data={data}
                        keyExtractor={(item) => `${item.name}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-3 flex-row justify-between gap-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                style={{ backgroundColor: type === item.name ? `${colors.foreground[colorScheme]}20` : undefined }}
                                onPress={() => {
                                    setType(prev => {
                                        if (prev === item.name) return null
                                        return item.name
                                    });
                                }}
                            >
                                <Text className="text-black dark:text-white">{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => {
                            if (isLoading) return (
                                <>
                                    <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                    <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                </>
                            )
                            return <Text className="text-black dark:text-white">No types found!</Text>
                        }}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}