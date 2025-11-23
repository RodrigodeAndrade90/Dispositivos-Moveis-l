import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function Exercicio1(){
    
    const abrirYouTube = async () => {
        const youtubeUrl = "https://www.youtube.com/watch?v=E1xLoYsI5ek";
        
        try {
            const supported = await Linking.canOpenURL(youtubeUrl);
            
            if (supported) {
                await Linking.openURL(youtubeUrl);
            } else {
                Alert.alert("Erro", "Não é possível abrir o YouTube neste dispositivo");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o YouTube");
        }
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="play-circle" size={32} color="#6366f1" />
                    </View>
                    <Text style={styles.title}>Abrir YouTube</Text>
                    <Text style={styles.subtitle}>
                        Clique no botão abaixo para abrir um vídeo específico no aplicativo do YouTube
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={abrirYouTube}
                >
                    <Ionicons name="logo-youtube" size={24} color="white" />
                    <Text style={styles.buttonText}>Abrir no YouTube</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24
    },
    header: {
        alignItems: "center",
        marginBottom: 48
    },
    iconContainer: {
        backgroundColor: "#e0e7ff",
        padding: 16,
        borderRadius: 50,
        marginBottom: 16
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: 8,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
        lineHeight: 24
    },
    button: {
        backgroundColor: "#6366f1",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#6366f1",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        gap: 8
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center"
    }
})