import { useState } from 'react';
import { Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';

export default function DropdownMenu() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setDropdownVisible(true)}
                className="h-8 w-8 rounded-full bg-primary-light dark:bg-primary-dark mr-4"
            />

            <Modal
                transparent
                animationType="none"
                visible={isDropdownVisible}
                onRequestClose={() => setDropdownVisible(false)}
            >
                <Pressable
                    onPress={() => setDropdownVisible(false)}
                    className="flex-1"
                >
                    <View className="absolute top-10 right-4 bg-active-light dark:bg-active-dark rounded-lg w-40 p-1" style={{ elevation: 5 }}>
                        {[...Array(4)].map((_, i) => (
                            <TouchableOpacity key={i} className="p-3">
                                <Text className="text-foreground-light dark:text-foreground-dark text-lg">Option {i + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
