import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";


const url = {
    1: 'https://breakingmuscle.com/bench-press-arch/',
    2: 'https://www.bornfitness.com/weekend-only-workout-plan/',
    3: 'https://www.acefitness.org/resources/everyone/blog/7839/how-to-make-exercise-a-regular-habit-in-6-steps/'
}

export default function Tips () {
    const { id } = useLocalSearchParams();

    const matchedUrl = url[Number(id) as keyof typeof url]


    return (
        <SafeAreaView style={{ flex: 1 }}>
           <WebView source={{ uri: matchedUrl }} style={{ flex: 1 }}/>
        </SafeAreaView>
    )
}