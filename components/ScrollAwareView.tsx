import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    type ScrollViewProps
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LegendList, type LegendListProps } from '@legendapp/list';
import { useNavigation } from 'expo-router';
import { useRef, useEffect } from 'react';
import { useHideState } from '@/lib/zustand/useHideState';

export function ScrollAwareLegendList<T>(props: LegendListProps<T>) {
    const scrollY = useRef(0);
    const navigation = useNavigation();
    const tabBarHeight = useBottomTabBarHeight();
    const tabBarOffset = useRef(new Animated.Value(0)).current;
    const { hide, setHide } = useHideState()

    useEffect(() => {
        const listener = tabBarOffset.addListener(({ value }) => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    position: 'absolute',
                    bottom: value,
                    opacity: 0.98,
                    height: tabBarHeight,
                }
            });
        });

        return () => {
            tabBarOffset.removeListener(listener);
        };
    }, [navigation, tabBarHeight, tabBarOffset]);

    let lastDirection: 'up' | 'down' | null = null;

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = e.nativeEvent.contentOffset.y;
        const diff = currentOffset - scrollY.current;

        if (diff > 10 && lastDirection !== 'down') {
            lastDirection = 'down';
            Animated.timing(tabBarOffset, {
                toValue: -tabBarHeight,
                duration: 200,
                useNativeDriver: false,
            }).start();
            if (!hide) setHide(true)
        } else if (diff < -10 && lastDirection !== 'up') {
            lastDirection = 'up';
            Animated.timing(tabBarOffset, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
            if (hide) setHide(false)
        }

        scrollY.current = currentOffset;
    };

    return (
        <LegendList
            onScroll={handleScroll}
            {...props}
        />
    );
}

export function ScrollAwareView(props: ScrollViewProps) {
    const scrollY = useRef(0);
    const navigation = useNavigation();
    const tabBarHeight = useBottomTabBarHeight();
    const tabBarOffset = useRef(new Animated.Value(0)).current; // 0 = visible

    useEffect(() => {
        const listener = tabBarOffset.addListener(({ value }) => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    position: 'absolute',
                    bottom: value,
                    opacity: 0.98,
                    height: tabBarHeight,
                }
            });
        });

        return () => {
            tabBarOffset.removeListener(listener);
        };
    }, [navigation, tabBarHeight, tabBarOffset]);

    let lastDirection: 'up' | 'down' | null = null;

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = e.nativeEvent.contentOffset.y;
        const diff = currentOffset - scrollY.current;

        if (diff > 10 && lastDirection !== 'down') {
            lastDirection = 'down';
            Animated.timing(tabBarOffset, {
                toValue: -tabBarHeight,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else if (diff < -10 && lastDirection !== 'up') {
            lastDirection = 'up';
            Animated.timing(tabBarOffset, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }

        scrollY.current = currentOffset;
    };

    return (
        <ScrollView
            onScroll={handleScroll}
            {...props}
        >
            {props.children}
        </ScrollView>
    );
}
