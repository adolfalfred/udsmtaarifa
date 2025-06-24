import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native'
import { useCallback, useMemo, useRef } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import Button from './ui/Button';
import { Image } from "expo-image"

export default function SelectMedia({ media, setMedia }: { media: string[]; setMedia: (setImageId: string[]) => void }) {
    const colorScheme = useColorScheme()

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    const snapPoints = useMemo(() => ['100%'], []);

    const pickMedia = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'livePhotos', 'videos'],
                aspect: [1, 1],
                quality: 0.8,
                allowsMultipleSelection: true
            });
            if (!result.canceled) {
                const uris = result.assets.map(asset => asset.uri);
                setMedia(uris);
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
                allowsMultipleSelection: true
            });

            if (!result.canceled) {
                const uris = result.assets.map(asset => asset.uri);
                setMedia(uris);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    return (
        <>
            <TouchableOpacity className="my-3 flex-row gap-1 flex-wrap items-center py-5 px-4 border border-foreground-light/60 border-dashed dark:border-foreground-dark/60 rounded-[28px]" onPress={presentModal}>
                {media?.length && media.length > 0 ? media.map((uri, index) => (
                    <View key={index} className='w-[32%] h-32 rounded overflow-hidden'>
                        <Image
                            style={{
                                flex: 1,
                                width: '100%',
                                backgroundColor: '#0553',
                            }}
                            source={uri}
                            contentFit="contain"
                            transition={1000}
                        />
                    </View>
                )) : <Text className="text-[#aaa] text-lg">
                    Select Images
                </Text>}
            </TouchableOpacity>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectMedia'
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
                <BottomSheetScrollView className='flex-1 p-6 bg-background-light dark:bg-background-dark'>
                    {media?.length && media.length > 0 ? (
                        <>
                            {media.map((item, i) => (
                                <View key={i} className='mx-auto w-80 h-80 my-1 rounded overflow-hidden'>
                                    <Image
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            backgroundColor: '#0553',
                                        }}
                                        source={item}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                </View>
                            ))}
                            <TouchableOpacity
                                className='absolute top-3 right-3 bg-black/60 rounded-full w-8 h-8 items-center justify-center'
                                onPress={() => setMedia([])}
                            >
                                <MaterialIcons name='close' size={16} color="white" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View className='w-80 h-80 mx-auto rounded-2xl border border-dashed border-primary-light/50 dark:border-primary-dark/50 items-center justify-center'>
                            <MaterialIcons name='image' size={48} color={colors.primary[colorScheme]} />
                            <Text className='text-foreground-light dark:text-foreground-dark mt-4'>
                                No image selected
                            </Text>
                        </View>
                    )}
                    <View className='flex-col items-center justify-center w-full gap-4'>
                        <Text className='text-foreground-light dark:text-foreground-dark text-center mt-5 text-lg'>
                            Select a Photo for your Account
                        </Text>

                        <View className='flex-row items-center'>
                            <Button
                                icon={<MaterialIcons name='upload' size={20} color="white" />}
                                onPress={pickMedia}
                                className='h-14 border border-primary-light dark:border-primary-dark rounded-l-full rounded-r-sm bg-primary-light dark:bg-primary-dark'
                                textClassName='text-foreground-dark'
                            >
                                Gallery
                            </Button>
                            <Button
                                icon={<MaterialIcons name='camera' size={20} color={colors.primary[colorScheme]} />}
                                onPress={takePhoto}
                                className='h-14 border border-primary-light dark:border-primary-dark rounded-r-full rounded-l-sm bg-transparent'
                                textClassName='text-primary-light dark:text-primary-dark'
                            >
                                Camera
                            </Button>
                        </View>
                        <Button
                            onPress={() => closeModal()}
                            className="bg-primary-light dark:bg-primary-dark w-full rounded-full"
                            textClassName="text-foreground-dark text-2xl"
                        >
                            Confirm
                        </Button>
                    </View>
                </BottomSheetScrollView>
            </BottomSheetModal>
        </>
    )
}