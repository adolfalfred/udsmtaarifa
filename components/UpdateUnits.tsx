import { useSessionStore } from '@/lib/zustand/useSessionStore'
import { useQueryClient } from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system'
import Toast, { ToastType } from './ui/Toast'
import { useRef, useState } from 'react'
import { UserProps } from '@/types/user'
import { useRouter } from 'expo-router'
import SelectUnits from './SelectUnits'
import { View } from 'react-native'
import Button from './ui/Button'
import api from '@/lib/api'

export default function UpdateUnits({ presentUnits, setUpdateUnits }: { presentUnits: UserProps['subscribedUnits'], setUpdateUnits: (a: boolean) => void }) {
    const [units, setUnits] = useState(presentUnits.map(u => u.unit.id))
    const [loading, setLoading] = useState(false)

    const { user } = useSessionStore()
    const queryClient = useQueryClient()
    const router = useRouter()

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const patchFxn = async () => {
        try {
            if (!user && (!units?.length || units?.length === 0)) return

            setLoading(true)
            addToast('loading', "Updating units...")

            const e = new FormData();

            if (units?.length && units.length > 0) {
                e.append('unitLength', `${units.length}`)
                await Promise.all(
                    units.map(async (item, i) => {
                        e.append(`unitId-${i + 1}`, item);
                    })
                );
            }

            const res = await api.patch(`/user/${user?.id}`, e, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            addToast('success', "Account updated successfully", true)
            console.log(res?.data)
            queryClient.clear();
            await FileSystem.deleteAsync(FileSystem.cacheDirectory!, { idempotent: true }).then(() => {
                if (router.canGoBack()) router.back()
                else router.replace('/(stack)/(protected)/(tabs)/news')
            })
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                if (typeof error.response.data === 'string') addToast('danger', error.response.data, true);
                else if (error.response.data?.error && error.response.data.error?.message && typeof error.response.data.error.message === 'string')
                    addToast('danger', error.response.data.error.message, true)
                else addToast('danger', 'An unexpected error occurred', true);
            } else if (error.request) {
                console.log(error.request);
                addToast('danger', "No response received from the server. Check your network.", true)
            } else {
                console.log('Error', error.message);
                addToast('danger', "An error occurred while setting up the request.", true)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <View className='mx-4 gap-4'>
                <SelectUnits units={units} setUnits={setUnits} />
                <Button
                    onPress={patchFxn}
                    className='text-center bg-primary-light/90 dark:bg-primary-dark/50 rounded-full'
                    textClassName='text-white text-sm'
                    disabled={loading}
                >
                    Update
                </Button>
            </View>
            <Toast ref={toastRef} />
        </>
    )
}