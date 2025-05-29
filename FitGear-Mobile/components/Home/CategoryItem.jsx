import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Colors } from '../../constants/Colors'

export default function CategoryItem({category, onPress, isSelected = true}) {
  return (
    <TouchableOpacity
    style={{
        backgroundColor: isSelected ? Colors.PRIMARY : '#FFF4B7', 
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20,
        marginRight: 10,
        marginVertical: 5,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? Colors.PRIMARY : '#E6D15A',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    }}
    onPress={() => onPress(category.name)}
    activeOpacity={0.7}>
        <Text
        style={{
            fontFamily: 'nunito-medium',
            fontSize: 14,
            color: isSelected ? "#fff" : '#2C2C2C',
            textAlign: 'center'
        }}>
            {category.name}
        </Text>
    </TouchableOpacity>
  )
}