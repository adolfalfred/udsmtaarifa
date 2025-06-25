import { type ExternalPathString, type RelativePathString } from 'expo-router';
import { View, Text, Dimensions, FlatList } from 'react-native';
import ImagePlayerView from './ImagePlayerView';
import VideoPlayerView from './VideoPlayerView';
import { useMemo, useState } from 'react';
import { isVideo } from '@/lib/utils';

const screenWidth = Dimensions.get('window').width;

export default function MediaSlider({ mediaArray, href }: {
    href?: RelativePathString | ExternalPathString | any,
    mediaArray: {
        url: string;
        blur: string | null;
        width: number | null;
        height: number | null;
        duration: number | null;
    }[]
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const maxMediaHeight = useMemo(() => {
        return Math.max(
            ...mediaArray.map(img =>
                img.height && img.width ? (img.height / img.width) * screenWidth : href ? screenWidth : 720
            )
        );
    }, [mediaArray, href]);

    const maxDots = 5;
    const half = Math.floor(maxDots / 2);

    const start = Math.max(0, activeIndex - half);
    const end = Math.min(mediaArray.length, start + maxDots);
    const visibleDots = mediaArray.slice(start, end);

    return (
        <View className="my-2">
            <FlatList
                data={mediaArray}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                    setActiveIndex(index);
                }}
                renderItem={({ item, index }) => (
                    <>
                        {mediaArray.length > 1 && (
                            <View
                                className='absolute top-2 right-2 rounded-full flex-col items-center justify-center w-10 h-10 bg-black/50'
                                style={{ zIndex: 1 }}>
                                <Text className='text-foreground-dark dark:text-foreground-dark text-xs font-semibold'>{index + 1}/{mediaArray.length}</Text>
                            </View>
                        )}
                        {isVideo(item.url) ? (
                            <VideoPlayerView
                                maxMediaHeight={maxMediaHeight}
                                screenWidth={screenWidth}
                                media={item}
                            />
                        ) : (
                            <ImagePlayerView
                                maxMediaHeight={maxMediaHeight}
                                screenWidth={screenWidth}
                                media={item}
                                href={href}
                            />
                        )}
                    </>
                )}
            />

            {mediaArray.length > 1 && (
                <View className="flex-row justify-center -mt-4 pb-2 gap-1">
                    {visibleDots.map((_, i) => {
                        const dotIndex = start + i;
                        return (
                            <View
                                key={dotIndex}
                                className={`w-2 h-2 rounded-full ${i === activeIndex ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300/50 dark:bg-gray-600/30'}`}
                            />
                        )
                    })}
                </View>)}
        </View>
    )
}