import { Image, StyleSheet, Platform, View } from 'react-native';
import ListaFornecedores from '@/components/ListaFornecedores';

export default function HomeScreen() {
  return (
      <View style={styles.bodyBg}>
        <ListaFornecedores />
      </View>
  );
}

const styles = StyleSheet.create({
  bodyBg: {
    flex: 1,
    backgroundColor: "white"
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
