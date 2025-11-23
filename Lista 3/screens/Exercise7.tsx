import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons"

export default function Exercicio7(){
    const [imageUris, setImageUris] = useState<string[]>([]);
    
    const adicionarImagemDaGaleria = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Permissão Negada", "Permissão necessária para acessar a galeria");
                return;
            }
            
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                setImageUris(prev => [...prev, result.assets[0].uri]);
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a galeria");
        }
    };
    
    const adicionarImagemDaCamera = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Permissão Negada", "Permissão necessária para usar a câmera");
                return;
            }
            
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                setImageUris(prev => [...prev, result.assets[0].uri]);
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a câmera");
        }
    };
    
    const limparImagens = () => {
        setImageUris([]);
        Alert.alert("Limpo", "Todas as imagens foram removidas");
    };
    
    const renderImage = (uri: string, index: number) => (
        <View key={index} style={styles.imageCard}>
            <Image 
                source={{ uri }} 
                style={styles.image}
                onError={() => console.log(`Erro ao carregar imagem ${index + 1}`)}
            />
            <View style={styles.imageFooter}>
                <Text style={styles.imageLabel}>Imagem {index + 1}</Text>
                <View style={styles.imageBadge}>
                    <Text style={styles.imageBadgeText}>{index + 1}</Text>
                </View>
            </View>
        </View>
    );
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="images" size={32} color="#f59e0b" />
                    </View>
                    <Text style={styles.title}>Galeria de Imagens</Text>
                    <Text style={styles.subtitle}>
                        Adicione imagens da câmera ou galeria e visualize todas em um scroll
                    </Text>
                </View>
                
                <View style={styles.controls}>
                    <TouchableOpacity 
                        style={styles.controlButton}
                        onPress={adicionarImagemDaGaleria}
                    >
                        <Ionicons name="image" size={20} color="white" />
                        <Text style={styles.controlButtonText}>Galeria</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.controlButton, styles.cameraButton]}
                        onPress={adicionarImagemDaCamera}
                    >
                        <Ionicons name="camera" size={20} color="white" />
                        <Text style={styles.controlButtonText}>Câmera</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.controlButton, styles.clearButton]}
                        onPress={limparImagens}
                    >
                        <Ionicons name="trash" size={20} color="white" />
                        <Text style={styles.controlButtonText}>Limpar</Text>
                    </TouchableOpacity>
                </View>
                
                {imageUris.length > 0 ? (
                    <View style={styles.gallerySection}>
                        <View style={styles.galleryHeader}>
                            <Text style={styles.galleryTitle}>
                                {imageUris.length} Imagem(ns) Carregada(s)
                            </Text>
                            <View style={styles.imageCount}>
                                <Text style={styles.imageCountText}>{imageUris.length}</Text>
                            </View>
                        </View>
                        
                        <ScrollView 
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <View style={styles.imagesGrid}>
                                {imageUris.map((uri, index) => renderImage(uri, index))}
                            </View>
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="image-outline" size={48} color="#cbd5e1" />
                        </View>
                        <Text style={styles.emptyTitle}>Galeria Vazia</Text>
                        <Text style={styles.emptyText}>
                            Use os botões acima para adicionar imagens da câmera ou galeria
                        </Text>
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
    content: {
        flex: 1,
        padding: 24
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
        paddingTop: 16
    },
    iconContainer: {
        backgroundColor: "#fef3c7",
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
    controls: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
        gap: 12
    },
    controlButton: {
        flex: 1,
        backgroundColor: "#3b82f6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
        elevation: 2,
        shadowColor: "#3b82f6",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cameraButton: {
        backgroundColor: "#10b981"
    },
    clearButton: {
        backgroundColor: "#ef4444"
    },
    controlButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600"
    },
    gallerySection: {
        flex: 1
    },
    galleryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    galleryTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1e293b"
    },
    imageCount: {
        backgroundColor: "#f59e0b",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center"
    },
    imageCountText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600"
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 20
    },
    imagesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12
    },
    imageCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: "48%"
    },
    image: {
        width: "100%",
        height: 120,
        borderRadius: 8,
        marginBottom: 8
    },
    imageFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    imageLabel: {
        fontSize: 12,
        color: "#64748b",
        fontWeight: "500"
    },
    imageBadge: {
        backgroundColor: "#e2e8f0",
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    imageBadgeText: {
        fontSize: 10,
        color: "#475569",
        fontWeight: "600"
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    emptyIcon: {
        backgroundColor: "#f1f5f9",
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#475569",
        marginBottom: 8
    },
    emptyText: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
        lineHeight: 24
    }
})