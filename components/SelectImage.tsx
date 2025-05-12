import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import { useCallback, useRef, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from './ui/Button';
import * as ImagePicker from 'expo-image-picker';

export default function SelectImage({ photo, setImageId }: { photo: string | null; setImageId: (setImageId: string | null) => void }) {
    const [image, setImage] = useState<string | null>(null)

    const colorScheme = useColorScheme()

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        // setImageId(selected ? selected.id : null)
        bottomSheetModalRef.current?.close();
    }, []);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'livePhotos'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    // Take photo using camera
    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    return (
        <>
            <TouchableOpacity className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 border-dashed dark:border-foreground-dark/60 rounded-xl" onPress={presentModal}>
                <FontAwesome name="image" size={20} color="#aaa" className="mr-4" />
                <View className="h-10 flex-col items-center justify-center">
                    <Text className="text-[#aaa] text-lg">
                        Select Image
                    </Text>
                </View>
                {photo ? <Image
                    source={{ uri: photo }}
                    className="w-10 h-10 ml-auto"
                /> : <Image
                    source={require('@/assets/images/icon.png')}
                    className="w-10 h-10 ml-auto"
                />}
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectImage'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                backdropComponent={() => <View className='bg-black/40 flex-1 absolute inset-0'></View>}
                onDismiss={closeModal}>
                <BottomSheetView className='flex-1 h-[90vh] p-6 bg-background-light dark:bg-background-dark'>
                    <View className='rounded-2xl overflow-hidden mb-6 relative self-center items-center justify-center'>
                        {image ? (
                            <>
                                <Image source={{ uri: image }} className='w-80 h-80 rounded-2xl' />
                                <TouchableOpacity
                                    className='absolute top-3 right-3 bg-black/60 rounded-full w-8 h-8 items-center justify-center'
                                    onPress={() => setImage(null)}
                                >
                                    <MaterialIcons name='close' size={16} color="white" />
                                </TouchableOpacity>
                            </>
                        ) : <>
                            {photo ? (
                                <Image source={{ uri: photo }} className='w-80 h-80 rounded-2xl' />
                            )
                                : <View className='w-80 h-80 rounded-2xl border-2 border-dashed border-primary-light/50 dark:border-primary-dark/50 items-center justify-center'>
                                    <MaterialIcons name='image' size={48} color={colors.primary[colorScheme]} />
                                    <Text className='text-foreground-light dark:text-foreground-dark mt-4'>
                                        No image selected
                                    </Text>
                                </View>
                            }
                        </>}

                        <View className='flex-row items-center mt-8'>
                            <Button
                                icon={<MaterialIcons name='upload' size={20} color="white" />}
                                onPress={pickImage}
                                className='border-2 border-secondary-light dark:border-secondary-dark rounded-l-full rounded-r-sm bg-secondary-light dark:bg-secondary-dark'
                                textClassName='text-foreground-dark'
                            >
                                Gallery
                            </Button>
                            <Button
                                icon={<MaterialIcons name='camera' size={20} color={colors.secondary[colorScheme]} />}
                                onPress={takePhoto}
                                className='border-2 border-secondary-light dark:border-secondary-dark rounded-r-full rounded-l-sm bg-transparent'
                                textClassName='text-secondary-light dark:text-secondary-dark'
                            >
                                Camera
                            </Button>
                        </View>
                    </View>

                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}