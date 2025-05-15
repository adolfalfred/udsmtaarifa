import { BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { useCallback, useMemo, useRef } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import { useUnitsQuery } from '@/queries/useUnitsQuery';

export default function SelectUnits({
    units,
    setUnits,
}: {
    units: string[];
    setUnits: React.Dispatch<React.SetStateAction<string[]>>
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

    const { data, isLoading } = useUnitsQuery("", 1)

    return (
        <>
            <TouchableOpacity
                className="my-3 flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-lg"
                onPress={presentModal}>
                <Text className="text-[#aaa] text-lg">
                    {units ? `${units.length} Units Selected` : "Select Related Units"}
                </Text>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectUnits'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                backdropComponent={() => <View className='bg-black/40 flex-1 absolute inset-0'></View>}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}>
                <BottomSheetView className='flex-1 h-[90vh] p-6 bg-background-light dark:bg-background-dark'>
                    <BottomSheetFlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-3 flex-row justify-between gap-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                style={{ backgroundColor: units?.includes(item.id) ? `${colors.foreground[colorScheme]}20` : undefined }}
                                onPress={() => {
                                    setUnits((prev: string[]) => {
                                        if (prev.includes(item.id)) return prev.filter(id => id !== item.id);
                                        return [...prev, item.id]
                                    });
                                }}
                            >
                                <Text className="text-black dark:text-white">{item.name}</Text>
                                <Text className="text-black dark:text-white">{item.unitType.name}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => {
                            if (isLoading) return (
                                <>
                                    <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                    <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                </>
                            )
                            return <Text className="text-black dark:text-white">No units found!</Text>
                        }}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}