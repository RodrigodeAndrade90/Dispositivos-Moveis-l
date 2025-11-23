import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function Exercicio2(){
    
    const abrirDiscador = async () => {
        const numeroTelefone = "11994889966";
        const telUrl = `tel:${numeroTelefone}`;
        
        try {
            const supported = await Linking.canOpenURL(telUrl);
            
            if (supported) {
                await Linking.openURL(telUrl);
            } else {
                Alert.alert("Erro", "Este dispositivo não suporta chamadas telefônicas");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao tentar abrir o discador");
        }
    };
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="call" size={32} color="#10b981" />
                    </View>
                    <Text style={styles.title}>Discador Telefônico</Text>
                    <Text style={styles.subtitle}>
                        Abra a interface de discagem com um número pré-definido
                    </Text>
                </View>

                <View style={styles.phoneCard}>
                    <Ionicons name="call-outline" size={24} color="#10b981" />
                    <Text style={styles.phoneNumber}>(12) 99712-3518</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={abrirDiscador}
                >
                    <Ionicons name="call" size={20} color="white" />
                    <Text style={styles.buttonText}>Fazer Chamada</Text>
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
        backgroundColor: "#d1fae5",
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
    phoneCard: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderRadius: 12,
        marginBottom: 32,
        gap: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    phoneNumber: {
        fontSize: 20,
        fontWeight: "600",
        color: "#059669",
        letterSpacing: 0.5
    },
    button: {
        backgroundColor: "#10b981",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#10b981",
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