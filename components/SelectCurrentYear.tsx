import { BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { useCallback, useMemo, useRef } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';

export default function SelectCurrentYear({
    currentYear,
    setCurrentYear,
    totalYears,
}: {
    currentYear: number;
    setCurrentYear: (currentYear: number) => void;
    totalYears: number | null;
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

    if (totalYears === null) return;
    return (
        <>
            <TouchableOpacity
                className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full"
                onPress={presentModal}>
                <FontAwesome name="clock-o" size={22} color="#aaa" className="mr-4" />
                <View className="h-10 flex-col items-center justify-center">
                    <Text className="text-[#aaa] text-lg">
                        {currentYear > 0 ? `Study Year ${currentYear}` : "Select Current Study Year"}
                    </Text>
                </View>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectCurrentYear'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                backdropComponent={() => <View className='bg-black/40 flex-1 absolute inset-0'></View>}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}>
                <BottomSheetView className='flex-1 h-[90vh] p-6 bg-background-light dark:bg-background-dark'>
                    <BottomSheetFlatList
                        data={Array.from({ length: totalYears }, (_, index) => index + 1)}
                        keyExtractor={(item) => `${item}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="py-3 px-5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 mx-auto"
                                style={{ backgroundColor: currentYear === item ? `${colors.foreground[colorScheme]}20` : undefined }}
                                onPress={() => {
                                    setCurrentYear(item);
                                    closeModal();
                                }}
                            >
                                <Text className="text-black dark:text-white">{`Study Year ${item}`}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}