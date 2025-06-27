import { colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type ToastType = 'danger' | 'warning' | 'success' | "loading";

type ToastProps = {
    position?: 'up' | 'down';
};

const Toast = forwardRef<
    { show: (params: { type: ToastType; text: string, shouldClose?: boolean }) => void },
    ToastProps
>(({ position = 'down' }, ref) => {
    const colorScheme = useColorScheme();

    const [close, setClose] = useState(false);
    const [showing, setShowing] = useState(false);
    const [toastType, setToastType] = useState<ToastType>('success');
    const [toastText, setToastText] = useState('');

    const show = useCallback(({ type, text, shouldClose = false }: { type: ToastType; text: string, shouldClose?: boolean }) => {
        setToastText(text);
        setToastType(type);
        setShowing(true);
        setClose(shouldClose)
        setTimeout(() => {
            setShowing(false);
        }, 10000);
    }, []);

    useImperativeHandle(ref, () => ({
        show,
    }));

    return (
        <>
            {showing && (
                <View
                    className={`absolute z-50 ${position === 'up' ? 'top-0' : 'top-14'} w-[90%] border rounded-[28px] overflow-hidden self-center bg-background-light dark:bg-background-dark`}
                    style={{
                        borderColor:
                            toastType === 'success'
                                ? colors.success[colorScheme]
                                : toastType === 'danger'
                                    ? colors.danger[colorScheme]
                                    : toastType === 'warning'
                                        ? colors.warning[colorScheme]
                                        : `${colors.foreground[colorScheme]}50`,
                    }}
                >
                    <View
                        className="rounded-xl flex-row items-center justify-between gap-1 w-full h-full px-3 py-4"
                        style={{
                            backgroundColor:
                                toastType === 'success'
                                    ? `${colors.success[colorScheme]}20`
                                    : toastType === 'danger'
                                        ? `${colors.danger[colorScheme]}20`
                                        : toastType === 'warning'
                                            ? `${colors.warning[colorScheme]}20`
                                            : `${colors.background[colorScheme]}20`,
                        }}
                    >
                        <Text
                            className={`text-foreground-light dark:text-foreground-dark`}
                            style={close ? { width: '90%' } : { width: '100%' }}>
                            {toastText}
                        </Text>
                        {close ? <TouchableOpacity onPress={() => setShowing(false)}>
                            <MaterialIcons size={16} name="close" color={colors.foreground[colorScheme]} />
                        </TouchableOpacity> : null}
                    </View>
                </View>
            )}
        </>
    );
});

Toast.displayName = 'Toast';

export default Toast;