import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, FlatList, Alert } from "react-native"
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"

interface Contact {
    id: string;
    name: string;
    phone: string;
}

export default function Exercicio4(){
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    
    const allContacts: Contact[] = [
        { id: '1', name: 'Camila Souza', phone: '(12) 99999-9111' },
        { id: '2', name: 'Ana Machado', phone: '(12) 88888-2282' },
        { id: '3', name: 'Carla Coutinho', phone: '(12) 77777-3335' },
        { id: '4', name: 'Bruno Santos', phone: '(12) 66666-4449' },
        { id: '5', name: 'Carol Silva', phone: '(12) 55555-5545' },
        { id: '6', name: 'Diego Alameda', phone: '(12) 44444-6633' },
        { id: '7', name: 'Cristina Oliveira', phone: '(12) 33333-7754' },
        { id: '8', name: 'Eduardo Deivid', phone: '(12) 22222-8859' },
        { id: '9', name: 'Fernando Pereira', phone: '(12) 11111-9996' }
    ];
    
    const getContacts = () => {
        setLoading(true);
        
        setTimeout(() => {
            const data = allContacts.filter(contact => 
                contact.name.toLowerCase().startsWith('c')
            );
            
            if (data.length > 0) {
                setContacts(data);
                Alert.alert("Sucesso", `Encontrados ${data.length} contatos que começam com "C"`);
            } else {
                Alert.alert("Aviso", "Nenhum contato encontrado que comece com a letra C");
            }
            
            setLoading(false);
        }, 1000);
    };
    
    const renderContact = ({ item }: { item: Contact }) => (
        <View style={styles.contactItem}>
            <View style={styles.contactAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
            <Ionicons name="call-outline" size={20} color="#6366f1" />
        </View>
    );
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="people" size={32} color="#6366f1" />
                    </View>
                    <Text style={styles.title}>Contatos com "C"</Text>
                    <Text style={styles.subtitle}>
                        Lista de contatos cujos nomes começam com a letra C
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
                        <Ionicons name="search" size={20} color="white" />
                    )}
                    <Text style={styles.buttonText}>
                        {loading ? "Buscando..." : "Buscar Contatos"}
                    </Text>
                </TouchableOpacity>
                
                {contacts.length > 0 && (
                    <View style={styles.listContainer}>
                        <View style={styles.resultsHeader}>
                            <Text style={styles.resultText}>
                                {contacts.length} contato(s) encontrado(s)
                            </Text>
                            <Text style={styles.filterText}>Filtro: Letra C</Text>
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
        justifyContent: "center",
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
    filterText: {
        fontSize: 14,
        color: "#64748b",
        backgroundColor: "#e2e8f0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    list: {
        flex: 1
    },
    contactItem: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
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
    contactAvatar: {
        backgroundColor: "#6366f1",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    avatarText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
    contactInfo: {
        flex: 1
    },
    contactName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: 2
    },
    contactPhone: {
        fontSize: 14,
        color: "#64748b"
    }
})