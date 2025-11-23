import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, FlatList, Alert } from "react-native"
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"

interface Contact {
    id: string;
    firstName: string;
    fullName: string;
    phone: string;
}

export default function Exercicio5(){
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    
    const allContacts: Contact[] = [
        { id: '1', firstName: 'Camila', fullName: 'Camila Souza', phone: '(12) 99999-9111' },
        { id: '2', firstName: 'Ana', fullName: 'Ana Machado', phone: '(12) 88888-2282' },
        { id: '3', firstName: 'Carla', fullName: 'Carla Courinho', phone: '(12) 77777-3335' },
        { id: '4', firstName: 'Bruno', fullName: 'Bruno Santos', phone: '(12) 66666-4449' },
        { id: '5', firstName: 'Carol', fullName: 'Carol Silva', phone: '(12) 55555-5545' },
        { id: '6', firstName: 'Diego', fullName: 'Diego Alameda', phone: '(12) 44444-6633' },
        { id: '7', firstName: 'Cristina', fullName: 'Cristina Oliveira', phone: '(12) 33333-7754' },
        { id: '8', firstName: 'Eduardo', fullName: 'Eduardo Deivid', phone: '(12) 22222-8859' },
        { id: '9', firstName: 'Fernando', fullName: 'Fernando Pereira', phone: '(12) 11111-9996' }
    ];
    
    const getContacts = () => {
        setLoading(true);
        
        setTimeout(() => {
            const data = allContacts;
            setContacts(data);
            Alert.alert("Sucesso", `Carregados ${data.length} contatos (somente primeiro nome)`);
            setLoading(false);
        }, 1000);
    };
    
    const renderContact = ({ item }: { item: Contact }) => (
        <View style={styles.contactItem}>
            <View style={styles.contactHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.firstName.charAt(0)}</Text>
                </View>
                <View style={styles.contactInfo}>
                    <Text style={styles.firstName}>{item.firstName}</Text>
                    <Text style={styles.fullName}>{item.fullName}</Text>
                </View>
            </View>
            <View style={styles.contactDetails}>
                <Ionicons name="call-outline" size={16} color="#64748b" />
                <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
        </View>
    );
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="person" size={32} color="#8b5cf6" />
                    </View>
                    <Text style={styles.title}>Primeiros Nomes</Text>
                    <Text style={styles.subtitle}>
                        Listando contatos usando Contacts.Fields.FirstName
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={getContacts}
                    disabled={loading}
                >
                    {loading ? (
                        <Ionicons name="refresh" size={20} color="white" />
                    ) : (
                        <Ionicons name="people" size={20} color="white" />
                    )}
                    <Text style={styles.buttonText}>
                        {loading ? "Carregando..." : "Listar Primeiros Nomes"}
                    </Text>
                </TouchableOpacity>
                
                {contacts.length > 0 && (
                    <View style={styles.listContainer}>
                        <View style={styles.resultsHeader}>
                            <Text style={styles.resultText}>
                                {contacts.length} contato(s) carregado(s)
                            </Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>FirstName</Text>
                            </View>
                        </View>
                        <FlatList
                            data={contacts}
                            keyExtractor={(item) => item.id}
                            renderItem={renderContact}
                            style={styles.list}
                            showsVerticalScrollIndicator={false}
                        />
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
        backgroundColor: "#ede9fe",
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
        backgroundColor: "#8b5cf6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#8b5cf6",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        gap: 8,
        marginBottom: 24
    },
    buttonDisabled: {
        opacity: 0.6
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center"
    },
    listContainer: {
        flex: 1
    },
    resultsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 4
    },
    resultText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b"
    },
    badge: {
        backgroundColor: "#ddd6fe",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    badgeText: {
        fontSize: 12,
        color: "#7c3aed",
        fontWeight: "600"
    },
    list: {
        flex: 1
    },
    contactItem: {
        backgroundColor: "white",
        padding: 16,
        marginVertical: 4,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contactHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },
    avatar: {
        backgroundColor: "#8b5cf6",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    avatarText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    },
    contactInfo: {
        flex: 1
    },
    firstName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: 2
    },
    fullName: {
        fontSize: 14,
        color: "#64748b",
        fontStyle: "italic"
    },
    contactDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingLeft: 4
    },
    contactPhone: {
        fontSize: 14,
        color: "#64748b"
    }
})