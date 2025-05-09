import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function DropdownMenu() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)} className='h-8 w-8 rounded-full bg-primary-light dark:bg-primary-dark mr-4'>
            </TouchableOpacity>
            {isDropdownVisible && (
                <View className='absolute top-10 right-0 bg-active-light dark:bg-active-dark rounded-lg w-40 mr-1' style={{ elevation: 5 }}>
                    <TouchableOpacity className='p-3'>
                        <Text className='text-foreground-light dark:text-foreground-dark text-lg p-1'>Option 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='p-3'>
                        <Text className='text-foreground-light dark:text-foreground-dark text-lg p-1'>Option 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='p-3'>
                        <Text className='text-foreground-light dark:text-foreground-dark text-lg p-1'>Option 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='p-3'>
                        <Text className='text-foreground-light dark:text-foreground-dark text-lg p-1'>Option 1</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};