import React from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { useAuth } from '../../app/context/AuthContext'
import { Colors } from '../../constants/Colors'
import { useProduct } from "./../../app/context/ProductContext"
import CategoryItem from './CategoryItem'

export default function Category({ onCategoryPress, showSelected = false, style = {} }) {
    const { categories, selectedCategory, isLoadingCategories } = useProduct();
    const {authState} = useAuth();

    const handleCategoryPress = (categoryName) => {
        if (onCategoryPress) {
            onCategoryPress(categoryName);
        }
    };

    if (!authState.authenticated) {
        return (
            <View style={[{
                paddingHorizontal: 20,
                paddingVertical: 15
            }, style]}>
                <Text style={{
                    fontSize: 16,
                    color: "#2C2C2C",
                    marginBottom: 10,
                }}>Categories</Text>
                <Text style={{
                    color: "#666",
                    textAlign: 'center',
                    paddingVertical: 20,
                }}>Log in to watch categories</Text>
            </View>
        )
    }

    if (isLoadingCategories) {
        return (
            <View style={[{
                paddingHorizontal: 20,
                paddingVertical: 15,
            }, style]}>
                <Text style={{
                    fontFamily: 'nunito-bold',
                    fontSize: 16,
                    color: "#2C2C2C",
                    marginBottom: 10,
                }}>Categories</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 20,
                }}>
                    <ActivityIndicator size="small" color={Colors.PRIMARY} />
                    <Text style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                    }}>Loading categories...</Text>
                </View>
            </View>
        );
    }

    if (categories.length === 0) {
        return (
            <View style={[{
                paddingHorizontal: 20,
                paddingVertical: 15,
            }, style]}>
                <Text style={{
                    fontFamily: 'nunito-bold',
                    fontSize: 16,
                    color: "#2C2C2C",
                    marginBottom: 10,
                }}>Categories</Text>
                <Text style={{
                    fontFamily: 'nunito-medium',
                    color: '#666',
                    textAlign: 'center',
                    paddingVertical: 20,
                }}>Categories wasn't found</Text>
            </View>
        );
    }

    return (
        <View style={[{
            paddingVertical: 25
        }, style]}>
            <Text style={{
                fontFamily: 'nunito-bold',
                fontSize: 20,
                color: "#2C2C2C",
                marginBottom: 10,
                paddingHorizontal: 20,
            }}>Categories</Text>
            <FlatList
                data={categories}
                keyExtractor={(item, index) => `category-${index}-${item.name}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                }}
                renderItem={({ item }) => (
                    <CategoryItem
                        category={item}
                        onPress={handleCategoryPress}
                        isSelected={showSelected && selectedCategory === item.name} />
                )} />
        </View>
    );
}