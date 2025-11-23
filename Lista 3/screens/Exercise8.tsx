import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons"

interface ImageItem {
    uri: string;
    id: string;
}

export default function Exercicio8(){
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);
    
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
                const newImage: ImageItem = {
                    uri: result.assets[0].uri,
                    id: Date.now().toString() + Math.random().toString()
                };
                setImageItems(prev => [...prev, newImage]);
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
                const newImage: ImageItem = {
                    uri: result.assets[0].uri,
                    id: Date.now().toString() + Math.random().toString()
                };
                setImageItems(prev => [...prev, newImage]);
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao abrir a câmera");
        }
    };
    
    const limparTodasImagens = () => {
        setImageItems([]);
        Alert.alert("Limpo", "Todas as imagens foram removidas");
    };
    
    const removerImagem = (id: string) => {
        setImageItems(prev => prev.filter(item => item.id !== id));
    };
    
    const renderImage = (item: ImageItem, index: number) => (
        <View key={item.id} style={styles.imageCard}>
            <View style={styles.imageHeader}>
                <Text style={styles.imageNumber}>#{index + 1}</Text>
                <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removerImagem(item.id)}
                >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>
            
            <Image 
                source={{ uri: item.uri }} 
                style={styles.image}
                onError={() => console.log(`Erro ao carregar imagem ${index + 1}`)}
            />
            
            <View style={styles.imageActions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert("Info", `Imagem ${index + 1}`)}
                >
                    <Ionicons name="information-circle" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Info</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteAction]}
                    onPress={() => removerImagem(item.id)}
                >
                    <Ionicons name="trash" size={16} color="#ef4444" />
                    <Text style={[styles.actionText, styles.deleteActionText]}>Remover</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="trash" size={32} color="#ef4444" />
                    </View>
                    <Text style={styles.title}>Remoção Individual</Text>
                    <Text style={styles.subtitle}>
                        Gerencie suas imagens com remoção individual de cada uma
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
                        onPress={limparTodasImagens}
                    >
                        <Ionicons name="trash" size={20} color="white" />
                        <Text style={styles.controlButtonText}>Limpar Todas</Text>
                    </TouchableOpacity>
                </View>
                
                {imageItems.length > 0 ? (
                    <View style={styles.gallerySection}>
                        <View style={styles.galleryHeader}>
                            <View>
                                <Text style={styles.galleryTitle}>Minhas Imagens</Text>
                                <Text style={styles.gallerySubtitle}>
                                    Toque no ícone ❌ para remover individualmente
                                </Text>
                            </View>
                            <View style={styles.stats}>
                                <Text style={styles.statsText}>{imageItems.length} itens</Text>
                            </View>
                        </View>
                        
                        <ScrollView 
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <View style={styles.imagesGrid}>
                                {imageItems.map((item, index) => renderImage(item, index))}
                            </View>
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="images-outline" size={48} color="#cbd5e1" />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma Imagem</Text>
                        <Text style={styles.emptyText}>
                            Adicione imagens usando os botões acima{'\n'}
                            Cada imagem terá um botão de remoção individual
                        </Text>
                        <View style={styles.featureHint}>
                            <Ionicons name="close-circle" size={20} color="#ef4444" />
                            <Text style={styles.featureHintText}>Botão de remoção individual</Text>
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
        backgroundColor: "#fee2e2",
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
        alignItems: "flex-start",
        marginBottom: 16
    },
    galleryTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 4
    },
    gallerySubtitle: {
        fontSize: 14,
        color: "#64748b",
        maxWidth: 200
    },
    stats: {
        backgroundColor: "#e2e8f0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    statsText: {
        fontSize: 12,
        color: "#475569",
        fontWeight: "600"
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 20
    },
    imagesGrid: {
        gap: 16
    },
    imageCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    imageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    imageNumber: {
        fontSize: 14,
        fontWeight: "600",
        color: "#3b82f6",
        backgroundColor: "#dbeafe",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4
    },
    deleteButton: {
        padding: 4
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 12
    },
    imageActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        backgroundColor: "#f1f5f9",
        borderRadius: 6,
        gap: 6
    },
    deleteAction: {
        backgroundColor: "#fef2f2"
    },
    actionText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#3b82f6"
    },
    deleteActionText: {
        color: "#ef4444"
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
        lineHeight: 24,
        marginBottom: 16
    },
    featureHint: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#f8fafc",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e2e8f0"
    },
    featureHintText: {
        fontSize: 14,
        color: "#64748b"
    }
})