import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert, Image } from "react-native"
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons"

export default function Exercicio6(){
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const abrirGaleria = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Permissão Negada", "É necessária permissão para acessar a galeria");
                return;
            }
            
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                Alert.alert("Sucesso", "Foto selecionada da galeria!");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a galeria");
        }
    };
    
    const abrirCamera = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Permissão Negada", "É necessária permissão para usar a câmera");
                return;
            }
            
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                Alert.alert("Sucesso", "Foto tirada com a câmera!");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a câmera");
        }
    };
    
    return(
        <SafeAreaView style={styles.container}>
            {/* Floating Action Buttons */}
            <View style={styles.floatingButtons}>
                <TouchableOpacity 
                    style={[styles.floatingButton, styles.galleryButton]} 
                    onPress={abrirGaleria}
                >
                    <Ionicons name="images" size={24} color="deepskyblue" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.floatingButton, styles.cameraButton]} 
                    onPress={abrirCamera}
                >
                    <Ionicons name="camera" size={24} color="deepskyblue" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="camera" size={32} color="#0ea5e9" />
                    </View>
                    <Text style={styles.title}>Câmera & Galeria</Text>
                    <Text style={styles.subtitle}>
                        Use os botões flutuantes para acessar a câmera ou galeria do dispositivo
                    </Text>
                </View>
                
                {selectedImage ? (
                    <View style={styles.imageSection}>
                        <Text style={styles.sectionTitle}>Imagem Selecionada</Text>
                        <View style={styles.imageCard}>
                            <Image 
                                source={{ uri: selectedImage }} 
                                style={styles.selectedImage} 
                                resizeMode="cover"
                            />
                            <TouchableOpacity 
                                style={styles.clearButton}
                                onPress={() => setSelectedImage(null)}
                            >
                                <Ionicons name="trash-outline" size={18} color="white" />
                                <Text style={styles.clearButtonText}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.placeholderSection}>
                        <View style={styles.placeholderIcon}>
                            <Ionicons name="image-outline" size={48} color="#cbd5e1" />
                        </View>
                        <Text style={styles.placeholderTitle}>Nenhuma Imagem</Text>
                        <Text style={styles.placeholderText}>
                            Toque nos botões no canto superior direito para adicionar uma imagem da galeria ou câmera
                        </Text>
                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                                <Text style={styles.featureText}>MaterialIcons com name "photo"</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                                <Text style={styles.featureText}>MaterialIcons com name "photo-camera"</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                                <Text style={styles.featureText}>Color "deepskyblue"</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    floatingButtons: {
        position: "absolute",
        top: 60,
        right: 20,
        zIndex: 10,
        gap: 12
    },
    floatingButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        borderWidth: 2,
        borderColor: "deepskyblue"
    },
    galleryButton: {
        // Estilo específico se necessário
    },
    cameraButton: {
        // Estilo específico se necessário
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 100
    },
    header: {
        alignItems: "center",
        marginBottom: 32
    },
    iconContainer: {
        backgroundColor: "#e0f2fe",
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
    imageSection: {
        flex: 1,
        alignItems: "center"
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 16
    },
    imageCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        alignItems: "center",
        width: "100%",
        maxWidth: 300
    },
    selectedImage: {
        width: 250,
        height: 250,
        borderRadius: 12,
        marginBottom: 16
    },
    clearButton: {
        backgroundColor: "#ef4444",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6
    },
    clearButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600"
    },
    placeholderSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    placeholderIcon: {
        backgroundColor: "#f1f5f9",
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },
    placeholderTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#475569",
        marginBottom: 8
    },
    placeholderText: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 24
    },
    featuresList: {
        gap: 8
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    featureText: {
        fontSize: 14,
        color: "#475569"
    }
})