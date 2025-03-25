import React from 'react';
import { Button, Image, View, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerExampleProps {
  setImageURI: (uri: string | null) => void;
  imageURI: string | null;
}

export default function ImagePickerExample({ setImageURI, imageURI }: ImagePickerExampleProps) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageURI(result.assets[0].uri);
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Selecionar imagem" onPress={pickImage} />
      {imageURI && <Image source={{ uri: imageURI }} style={{ width: 200, height: 200, marginTop: 10 }} />}
    </View>
  );
}