import type { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import ParallaxScrollViewStack from "@/components/ParallaxScrollViewStack";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import DropdownMenu from "@/components/DropdownMenu";
import { useNavigation } from "expo-router";
import { View, Text } from "react-native";
import { useLayoutEffect } from "react";
import { Image } from "expo-image";

export default function ProfileScreen() {
    const { user } = useSessionStore()
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: (props: NativeStackHeaderRightProps) => <DropdownMenu {...props} />
        });
    }, [navigation]);

    return (
        <>
            <ParallaxScrollViewStack
                headerImage={
                    <View className="flex-col items-center justify-center py-5 gap-2">
                        <View className="h-36 w-36 rounded-full overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5">
                            <Image
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    borderRadius: '100%'
                                }}
                                source={user?.image}
                                contentFit="cover"
                            />
                        </View>
                        <View className="w-80 px-2">
                            <Text className="text-foreground-light dark:text-foreground-dark text-lg text-center">{user?.name}</Text>
                            <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-center">{user?.email}</Text>
                            <Text className="text-foreground-light dark:text-foreground-dark text-lg text-center">{user?.regNo}</Text>
                            <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-sm text-center">{user?.phone}</Text>
                        </View>
                    </View>
                }
            >
                <View className="h-[1000px] rounded-2xl"></View>
            </ParallaxScrollViewStack>
        </>
    )
}