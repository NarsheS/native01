import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Persona from '@/components/classes/Persona';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from '@react-navigation/native';

const ListaFornecedores = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersona, setEditedPersona] = useState<Persona | null>(null);

  const categories = [
    { id: 1, name: 'Alimentos' },
    { id: 2, name: 'Eletrônicos' },
    { id: 3, name: 'Roupas' },
    { id: 4, name: 'Ferramentas' },
    { id: 5, name: 'Livros' },
    { id: 6, name: 'Outros' },
  ];

  useFocusEffect(
    useCallback(() => {
      carregarPersonas();
    }, [])
  );

  const carregarPersonas = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const personaKeys = keys.filter(key => key.startsWith('persona_'));
      const results = await AsyncStorage.multiGet(personaKeys);
      const loadedPersonas = results.map(result => JSON.parse(result[1]!)) as Persona[];
      setPersonas(loadedPersonas);
    } catch (error) {
      console.error('Erro ao carregar personas:', error);
    }
  };

  const salvarPersonas = async (updatedPersonas: Persona[]) => {
    try {
      const personaPairs = updatedPersonas.map(persona => [`persona_${persona.id}`, JSON.stringify(persona)]);
      await AsyncStorage.multiSet(personaPairs);
      setPersonas(updatedPersonas);
    } catch (error) {
      console.error('Erro ao salvar personas:', error);
    }
  };

  const filtrarPersonas = () => {
    let filteredPersonas = personas;

    if (searchTerm) {
      filteredPersonas = filteredPersonas.filter(persona =>
        persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.contact.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredPersonas = filteredPersonas.filter(persona =>
        persona.category.some(cat => cat.id === selectedCategory)
      );
    }

    return filteredPersonas;
  };

  const memoizedFiltrarPersonas = useMemo(() => filtrarPersonas(), [personas, searchTerm, selectedCategory]);

  const renderPersonaItem = ({ item }: { item: Persona }) => (
    <TouchableOpacity style={styles.personaItem} onPress={() => {
      setSelectedPersona(item);
      setModalVisible(true);
      setImageLoaded(false);
      setImageError(false);
    }}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleEditPersona = () => {
    if (selectedPersona) {
      setEditedPersona({ ...selectedPersona });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (editedPersona) {
      const updatedPersonas = personas.map(persona =>
        persona.id === editedPersona.id ? editedPersona : persona
      );
      await salvarPersonas(updatedPersonas);
      setIsEditing(false);
      setModalVisible(false);
    }
  };

  const handleDeletePersona = async () => {
    if (selectedPersona) {
      Alert.alert(
        'Excluir Fornecedor',
        'Tem certeza que deseja excluir este fornecedor?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              const updatedPersonas = personas.filter(persona => persona.id !== selectedPersona.id);
              await AsyncStorage.removeItem(`persona_${selectedPersona.id}`);
              setPersonas(updatedPersonas);
              setModalVisible(false);
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ThemedText style={styles.title}>Lista de Fornecedores:</ThemedText>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={styles.categoryFilter}>
          <TouchableOpacity style={[styles.categoryButton, !selectedCategory && styles.selectedCategory]} onPress={() => setSelectedCategory(null)}>
            <Text>Todos</Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton, selectedCategory === category.id && styles.selectedCategory]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={memoizedFiltrarPersonas}
          renderItem={renderPersonaItem}
          keyExtractor={item => item.id}
        />
        <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {selectedPersona && (
              <>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.modalInput}
                      value={editedPersona.name}
                      onChangeText={(text) => setEditedPersona({ ...editedPersona, name: text })}
                    />
                    <TextInput
                      style={styles.modalInput}
                      value={editedPersona.address}
                      onChangeText={(text) => setEditedPersona({ ...editedPersona, address: text })}
                    />
                    <TextInput
                      style={styles.modalInput}
                      value={editedPersona.contact}
                      onChangeText={(text) => setEditedPersona({ ...editedPersona, contact: text })}
                    />
                    <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
                      <Text>Salvar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {selectedPersona.imageURI ? (
                      imageError ? (
                        <Text>Erro ao carregar imagem</Text>
                      ) : imageLoaded ? (
                        <Image source={{ uri: selectedPersona.imageURI }} style={styles.modalImage} />
                      ) : (
                        <View style={styles.modalImagePlaceholder}>
                          <ActivityIndicator size="large" color="#008080" />
                          <Image
                            source={{ uri: selectedPersona.imageURI }}
                            style={styles.modalImage}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                          />
                        </View>
                      )
                    ) : (
                      <View style={styles.modalImagePlaceholder}>
                        <Text>Sem imagem</Text>
                      </View>
                    )}
                    <Text style={styles.modalTitle}>{selectedPersona.name}</Text>
                    <Text>Endereço: {selectedPersona.address}</Text>
                    <Text>Contato: {selectedPersona.contact}</Text>
                    <Text>Categorias: {selectedPersona.category.map(cat => cat.name).join(', ')}</Text>
                    
                      <TouchableOpacity style={styles.modalButton} onPress={handleEditPersona}>
                        <Text>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButton} onPress={handleDeletePersona}>
                        <Text>Excluir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                        <Text>Fechar</Text>
                      </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    marginHorizontal: 15,
    color: "black"
  },
  searchInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  categoryFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  selectedCategory: {
    backgroundColor: '#008080',
    borderColor: '#008080',
  },
  personaItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  personaImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalCloseButton: {
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  modalImagePlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  modalInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    width: '80%'
  }
});

export default ListaFornecedores;