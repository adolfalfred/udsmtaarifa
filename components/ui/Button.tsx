import {
    ActivityIndicator,
    StyleProp,
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
    px?: string;
    py?: string;
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
    textClassName,
    px,
    py,
}: ButtonProps) {

    return (
        <TouchableOpacity
            style={[
                disabled && { opacity: 0.6 },
                style
            ]}
            className={`flex-row items-center justify-center ${py ? py : 'py-4'} ${px ? px : 'px-6'} ${className}`}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="white" size="small" />
            ) : (
                <>
                    {icon}
                    <Text style={[{ fontSize: 16 }, textStyle]} className={`${textClassName}`}>
                        {children}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}