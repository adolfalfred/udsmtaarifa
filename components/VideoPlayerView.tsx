import { useVideoPlayer, VideoView } from 'expo-video';
import { View, StyleSheet } from 'react-native';

export default function VidePlayerView({ media, maxMediaHeight, screenWidth }: {
    maxMediaHeight: number,
    screenWidth: number;
    media: {
        url: string;
        blur: string | null;
        width: number | null;
        height: number | null;
        duration: number | null;
    }
}) {
    const player = useVideoPlayer(media.url, (player) => {
        player.pause()
        player.loop = true;
        player.staysActiveInBackground = false;
        player.allowsExternalPlayback = false
        player.generateThumbnailsAsync(1)
    });

    return (
        <View
            className='overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5'
            style={{ width: screenWidth, height: maxMediaHeight }}
        >
            <VideoView
                player={player}
                style={StyleSheet.absoluteFill}
                allowsFullscreen
            />
        </View>
    )
}