import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    textClassName?: string;
}

export default function Button({
    children,
    onPress,
    style,
    textStyle,
    icon,
    loading = false,
    disabled = false,
    className,
    textClassName
}: ButtonProps) {

    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && { opacity: 0.6 },
                style
            ]}
            className={className}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="white" size="small" />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.buttonText, textStyle]} className={textClassName}>
                        {children}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
    }
});