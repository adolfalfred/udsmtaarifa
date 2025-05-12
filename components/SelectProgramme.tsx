import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { useCallback, useRef, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';

export type ProgrammeProps = {
    id: string;
    name: string;
    code: string;
    years: number;
    departmentId: string;
    createdAt: Date;
    updatedAt: Date;
    department: {
        name: string;
        code: string;
        collegeId: string;
        college: {
            name: string;
            code: string;
        };
    };
}

export default function SelectProgramme({ data, setProgrammeId }: { data: ProgrammeProps[]; setProgrammeId: (programmeId: string | null) => void }) {
    const [selected, setSelected] = useState<ProgrammeProps | null>(null)
    const [query, setQuery] = useState("");

    const colorScheme = useColorScheme()

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        setProgrammeId(selected ? selected.id : null)
        bottomSheetModalRef.current?.close();
    }, [selected, setProgrammeId]);

    const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            <TouchableOpacity
                className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl"
                onPress={presentModal}>
                <FontAwesome name="graduation-cap" size={16} color="#aaa" className="mr-4" />
                <View className="h-10 flex-col items-center justify-center">
                    <Text className="text-[#aaa] text-lg">
                        {selected ? `${selected.name} (${selected.code})` : "Programme Taking"}
                    </Text>
                </View>
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectProgramme'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                backdropComponent={() => <View className='bg-black/40 flex-1 absolute inset-0'></View>}
                onDismiss={closeModal}>
                <BottomSheetView className='flex-1 h-[90vh] p-6 bg-background-light dark:bg-background-dark'>
                    <TextInput
                        className="border border-[#aaa] p-3 rounded-md mb-3 text-black dark:text-white bg-background-light dark:bg-background-dark"
                        placeholder="Search..."
                        placeholderTextColor="#999"
                        value={query}
                        onChangeText={(e) => {
                            if (e === '') setSelected(null)
                            setQuery(e)
                        }}
                        autoFocus
                    />
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        className="max-h-60"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                onPress={() => {
                                    setSelected(item);
                                    setQuery(item.name)
                                }}
                            >
                                <Text className="text-black dark:text-white">{`${item.name} (${item.code})`}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}