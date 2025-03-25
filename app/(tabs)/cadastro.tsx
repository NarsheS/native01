import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, Alert, Platform } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CategorySelector from "../../components/CategorySelector";
import { ThemedText } from "@/components/ThemedText";
import Persona from "@/components/classes/Persona";
import ImagePickerExample from "@/components/ImagePicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function Cadastro() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<{ id: number; name: string }[]>([]);
  const [imageURI, setImageURI] = useState<string | null>(null);

  const categories = [
    { id: 1, name: 'Alimentos' },
    { id: 2, name: 'Eletrônicos' },
    { id: 3, name: 'Roupas' },
    { id: 4, name: 'Ferramentas' },
    { id: 5, name: 'Livros' },
    { id: 6, name: 'Outros' },
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Desculpe, precisamos de permissões para acessar sua galeria!');
        }
      }
    })();
  }, []);

  async function submitForm() {
    if (name !== "" && address !== "" && contact !== "") {
      const id = Date.now().toString(); // Generate a unique ID
      const user = new Persona(id, name, address, contact, selectedCategories, imageURI);
      try {
        await AsyncStorage.setItem(`persona_${id}`, JSON.stringify(user));
        console.log("Persona salva:", user);
        setName("");
        setAddress("");
        setContact("");
        setSelectedCategories([]);
        setImageURI(null);
      } catch (error) {
        console.error("Erro ao salvar persona:", error);
      }
    }
  }

  return (
    <SafeAreaProvider style={{backgroundColor:"white"}}>
      <SafeAreaView>
        <ThemedText style={styles.title}>Cadastro de Fornecedor:</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="nome"
        />
        <TextInput
          style={styles.input}
          onChangeText={setAddress}
          value={address}
          placeholder="endereço"
        />
        <TextInput
          style={styles.input}
          onChangeText={setContact}
          value={contact}
          placeholder="contato"
        />
        <View style={styles.categoryContainer}>
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onSelect={setSelectedCategories}
          />
        </View>
        <View style={styles.container}>
          <ImagePickerExample setImageURI={setImageURI} imageURI={imageURI} />
          <View style={styles.buttonContainer}>
            <Button
              onPress={submitForm}
              title="Cadastrar"
              color="#008080"
              accessibilityLabel="Cadastrar"
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    marginHorizontal: 15,
    color: "black",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    color: 'black',
  },
  container: {
    alignItems: "center",
    flexDirection: "column",
  },
  buttonContainer: {
    marginTop: 20,
  },
  categoryContainer: {
    margin: 12,
  },
});