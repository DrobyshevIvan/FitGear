import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import Category from '../../components/Home/Category'
import Header from '../../components/Home/Header'

export default function home() {
  const navigation = useNavigation();
  
  const handleCategoryPress = (categoryName) => {
    console.log('Chosen category on home page:', categoryName);
    navigation.navigate('explore', { selectedCategory: categoryName });
  };

  return (
    <View>
      <Header />

      <Category
        onCategoryPress={handleCategoryPress}
        showSelected={false} />
    </View>
  )
}