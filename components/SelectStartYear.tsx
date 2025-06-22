import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { useCallback, useMemo, useRef } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';

export default function SelectStartYear({
    startYear,
    setStartYear,
}: {
    startYear: number | null;
    setStartYear: (startYear: number | null) => void
}) {
    const colorScheme = useColorScheme()

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    const snapPoints = useMemo(() => ['65%', '100%'], []);

    return (
        <>
            <TouchableOpacity
                className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full"
                onPress={presentModal}>
                <FontAwesome name="calendar" size={16} color="#aaa" className="mr-5" />
                <View className="h-10 flex-col items-center justify-center">
                    <Text className="text-[#aaa] text-lg">
                        {startYear ? `${startYear}` : "Select Programme Starting Year"}
                    </Text>
                </View>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectStartYear'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}
                backdropComponent={(props) => <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />}
            >
                <BottomSheetView className='flex-1 h-[90vh] p-6 bg-background-light dark:bg-background-dark'>
                    <BottomSheetFlatList
                        data={[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]}
                        keyExtractor={(item) => `${item}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="py-3 px-5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mx-auto"
                                style={{ backgroundColor: startYear === item ? `${colors.foreground[colorScheme]}20` : undefined }}
                                onPress={() => {
                                    setStartYear(item);
                                    closeModal();
                                }}
                            >
                                <Text className="text-black dark:text-white">{`${item}`}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}