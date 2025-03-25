import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface CategorySelectorProps {
  categories: { id: number; name: string }[];
  selectedCategories: { id: number; name: string }[];
  onSelect: (categories: { id: number; name: string }[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategories, onSelect }) => {
  const handleCategoryPress = (category: { id: number; name: string }) => {
    if (selectedCategories.some((c) => c.id === category.id)) {
      onSelect(selectedCategories.filter((c) => c.id !== category.id));
    } else {
      onSelect([...selectedCategories, category]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id.toString()}
            style={[
              styles.categoryButton,
              selectedCategories.some((c) => c.id === category.id) && styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategoryPress(category)}
            accessibilityLabel={category.name}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategories.some((c) => c.id === category.id) && styles.selectedCategoryButtonText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCategoryButton: {
    backgroundColor: '#008080',
    borderColor: '#008080',
  },
  categoryButtonText: {
    color: '#fff',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
});

export default CategorySelector;