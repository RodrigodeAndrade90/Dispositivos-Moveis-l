import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function Exercicio3(){
    
    const abrirInstagram = async () => {
        const instagramUrl = "https://www.instagram.com/fatec_jacarei";
        const instagramAppUrl = "https://www.instagram.com/fatec_jacarei";
        
        try {
            const appSupported = await Linking.canOpenURL(instagramAppUrl);
            
            if (appSupported) {
                await Linking.openURL(instagramAppUrl);
            } else {
                const webSupported = await Linking.canOpenURL(instagramUrl);
                
                if (webSupported) {
                    await Linking.openURL(instagramUrl);
                } else {
                    Alert.alert("Erro", "Não é possível abrir o Instagram neste dispositivo");
                }
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o Instagram");
        }
    };
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="logo-instagram" size={32} color="#ec4899" />
                    </View>
                    <Text style={styles.title}>Instagram Fatec</Text>
                    <Text style={styles.subtitle}>
                        Siga a Fatec Jacareí no Instagram para ficar por dentro das novidades
                    </Text>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="school" size={32} color="#ec4899" />
                    </View>
                    <Text style={styles.username}>@fatec_jacarei</Text>
                    <Text style={styles.institution}>Fatec Jacareí</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={abrirInstagram}
                >
                    <Ionicons name="logo-instagram" size={20} color="white" />
                    <Text style={styles.buttonText}>Abrir Instagram</Text>
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
        marginBottom: 32
    },
    iconContainer: {
        backgroundColor: "#fce7f3",
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
        lineHeight: 24,
        maxWidth: 300
    },
    profileCard: {
        backgroundColor: "white",
        alignItems: "center",
        padding: 24,
        borderRadius: 16,
        marginBottom: 32,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        width: 200
    },
    avatar: {
        backgroundColor: "#fce7f3",
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12
    },
    username: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 4
    },
    institution: {
        fontSize: 14,
        color: "#64748b"
    },
    button: {
        backgroundColor: "#ec4899",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#ec4899",
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