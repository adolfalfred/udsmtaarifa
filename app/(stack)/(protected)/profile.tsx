import type { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import ParallaxScrollViewStack from "@/components/ParallaxScrollViewStack";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import { Fragment, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserQuery } from '@/queries/useUserQuery';
import DropdownMenu from "@/components/DropdownMenu";
import { Link, useNavigation } from "expo-router";
import UserPosts from '@/components/UserPosts';
import { colors } from '@/constants/Colors';
import { Image } from "expo-image";
import Button from '@/components/ui/Button';
import UpdateUnits from '@/components/UpdateUnits';

export default function ProfileScreen() {
    const { user, setUser } = useSessionStore()
    const navigation = useNavigation();
    const colorScheme = useColorScheme()
    const [page, setPage] = useState<'info' | 'posts'>('info')
    const [updateUnits, setUpdateUnits] = useState(false)

    const { data, isLoading } = useUserQuery(user!.id)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: (props: NativeStackHeaderRightProps) => <DropdownMenu {...props} />
        });
        if (data)
            setUser({
                id: data!.id,
                email: data.email,
                image: data.image,
                name: data.name,
                phone: data.phone,
                regNo: data.regNo,
                userRoles: data.userRoles
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, data]);

    return (
        <>
            {!updateUnits ?
                <ParallaxScrollViewStack
                    headerImage={
                        <View className="flex-col items-center justify-center gap-2">
                            <View className="h-36 w-36 rounded-full overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5">
                                <Image
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        borderRadius: '100%'
                                    }}
                                    source={user?.image}
                                    cachePolicy='none'
                                    contentFit="cover"
                                />
                            </View>
                            <View className="w-80 px-2">
                                <Text className="text-foreground-light dark:text-foreground-dark text-lg text-center">{user?.name}</Text>
                                <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-center">{user?.email}</Text>
                                <Text className="text-foreground-light dark:text-foreground-dark text-lg text-center">{user?.regNo}</Text>
                                <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-sm text-center">{user?.phone}</Text>
                            </View>
                            <Link href='/(stack)/(protected)/editprofile' asChild>
                                <TouchableOpacity className='py-2.5 px-4 w-36 mt-1 items-center justify-center rounded-lg bg-/90/90 dark:bg-primary-dark/60'>
                                    <Text className='text-foreground-dark text-sm'>Edit Profile</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    }
                >
                    <View className="bg-background-light dark:bg-background-dark">
                        <View className="flex-row justify-between px-4">
                            <TouchableOpacity
                                onPress={() => setPage('info')}
                                className='py-2 w-[49.5%] bg-foreground-light rounded-lg items-center justify-center'
                                style={{ backgroundColor: page === 'info' ? colorScheme === 'dark' ? `${colors.primary[colorScheme]}90` : `${colors.primary[colorScheme]}f0` : `${colors.foreground[colorScheme]}10` }}
                            >
                                <Text className={`${page === 'info' ? 'text-foreground-dark' : 'text-foreground-light'} dark:text-foreground-dark`}>
                                    Details
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPage('posts')}
                                className='py-2 w-[49.5%] bg-foreground-light rounded-lg items-center justify-center'
                                style={{ backgroundColor: page === 'posts' ? colorScheme === 'dark' ? `${colors.primary[colorScheme]}90` : `${colors.primary[colorScheme]}f0` : `${colors.foreground[colorScheme]}10` }}
                            >
                                <Text className={`${page === 'posts' ? 'text-foreground-dark' : 'text-foreground-light'} dark:text-foreground-dark`}>
                                    Your Posts
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {page === 'info' ? (
                            <>
                                {/* Personal nformation */}
                                {isLoading ? <View className='mx-4 mt-4 mb-2 h-[206px] rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4' />
                                    : (
                                        <View className='mx-4 mt-4 mb-2 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4 gap-1'>
                                            <Text className='text-foreground-light dark:text-foreground-dark mb-2 text-center font-semibold'>Academic Information</Text>

                                            {data?.programme && Array.isArray(data.programme) && data.programme.length > 0 ? (
                                                <>
                                                    {data.programme.map(({ programmeId, currentStudyYear, programme, startYear }) => (
                                                        <Fragment key={programmeId}>
                                                            <View className='flex-row'>
                                                                <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>Programme</Text>
                                                                <View className='w-3/4'>
                                                                    <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{programme.name}</Text>
                                                                    <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{programme.code}</Text>
                                                                </View>
                                                            </View>
                                                            <View className='flex-row'>
                                                                <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>Study Year</Text>
                                                                <View className='w-3/4'>
                                                                    <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{currentStudyYear} / {programme.years}</Text>
                                                                </View>
                                                            </View>
                                                            <View className='flex-row'>
                                                                <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>Start Year</Text>
                                                                <Text className='w-3/4 text-foreground-light/70 dark:text-foreground-dark/60'>{startYear}</Text>
                                                            </View>
                                                            <View className='flex-row'>
                                                                <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>College</Text>
                                                                <View className='w-3/4'>
                                                                    <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{programme.department.college.name}</Text>
                                                                    <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{programme.department.college.code}</Text>
                                                                </View>
                                                            </View>
                                                            <View className='flex-row'>
                                                                <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>Department</Text>
                                                                <View className='w-3/4'>
                                                                    <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{programme.department.name}</Text>
                                                                    <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{programme.department.code}</Text>
                                                                </View>
                                                            </View>
                                                        </Fragment>
                                                    ))}
                                                </>
                                            ) : null}
                                        </View>
                                    )}

                                {/* Subscribed Units nformation */}
                                {isLoading ? <View className='mx-4 my-2  h-52 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4' />
                                    : (
                                        <View className='mx-4 my-2 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4 gap-1'>
                                            {data?.subscribedUnits && Array.isArray(data.subscribedUnits) && data.subscribedUnits.length > 0 ? (
                                                <>
                                                    {data.subscribedUnits.map(({ unitId, unit }) => (
                                                        <View key={unitId} className='flex-row'>
                                                            <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>Involved Unit</Text>
                                                            <View className='w-3/4'>
                                                                <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.name}</Text>
                                                                {unit?.description ? <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.description}</Text> : null}
                                                                <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.unitType.name}</Text>
                                                                {unit.unitType?.description ? <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.unitType.description}</Text> : null}
                                                            </View>
                                                        </View>
                                                    ))}
                                                </>
                                            ) : null}
                                            <View className='justify-center items-center'>
                                                <Button
                                                    onPress={() => setUpdateUnits(true)}
                                                    className='text-center bg-primary-light/90 dark:bg-primary-dark/50 rounded-xl'
                                                    textClassName='text-white text-sm'
                                                >
                                                    Subscribe to units
                                                </Button>
                                            </View>
                                        </View>
                                    )}

                                {/* Leading Units nformation */}
                                {isLoading ? <View className='m-4 h-52 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4' />
                                    : (
                                        <View className='m-4 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4 gap-1'>
                                            {data?.leadingUnits && Array.isArray(data.leadingUnits) && data.leadingUnits.length > 0 ? (
                                                <>
                                                    {data.leadingUnits.map(({ unitId, unit }) => (
                                                        <View key={unitId} className='flex-row'>
                                                            <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>Admin Unit</Text>
                                                            <View className='w-3/4'>
                                                                <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.name}</Text>
                                                                {unit?.description ? <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.description}</Text> : null}
                                                                <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.unitType.name}</Text>
                                                                {unit.unitType?.description ? <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{unit.unitType.description}</Text> : null}
                                                            </View>
                                                        </View>
                                                    ))}
                                                </>
                                            ) : null}
                                        </View>
                                    )}

                                {/* User Roles */}
                                {isLoading ? <View className='m-4 h-52 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4' />
                                    : (
                                        <View className='m-4 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5 p-4 gap-1'>
                                            {data?.userRoles && Array.isArray(data.userRoles) && data.userRoles.length > 0 ? (
                                                <>
                                                    {data.userRoles.map(({ role, roleId }) => (
                                                        <View key={roleId} className='flex-row'>
                                                            <Text className='w-1/4 text-foreground-light dark:text-foreground-dark font-semibold'>Role</Text>
                                                            <View className='w-3/4'>
                                                                <Text className='text-foreground-light/70 dark:text-foreground-dark/60'>{role.name}</Text>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </>
                                            ) : null}
                                        </View>
                                    )}
                            </>
                        ) : null}
                        {page === 'posts' ? (
                            <UserPosts />
                        ) : null}
                    </View>
                </ParallaxScrollViewStack> : <UpdateUnits presentUnits={data?.subscribedUnits || []} setUpdateUnits={setUpdateUnits} />}
        </>
    )
}