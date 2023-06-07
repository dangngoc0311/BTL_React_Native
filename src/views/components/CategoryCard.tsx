import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import COLORS from "../../consts/colors";
import ApiManager from "./ApiManager";
import { Category } from "../../consts/models";


const CategoryCard = ({ onChange }: any) => {
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const handlePress = (id: any) => {
        setActiveCategoryId(id);
        onChange(id);
    };
    useEffect(() => {
        ApiManager.get('categories')
            .then(response => {
                console.log(response.data);
                setCategories(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    })

    return (
        <FlatList
            horizontal={true}
            data={categories}
            keyExtractor={(item) => item.name}
            contentContainerStyle={{ marginVertical: COLORS.SPACING }}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => handlePress(item.id)}
                    style={{ marginRight: COLORS.SPACING * 2, alignItems: "center" }}
                >
                    <Text
                        style={[
                            { color: COLORS.secondary, fontSize: COLORS.SPACING * 2 },
                            activeCategoryId === item.id && { color: COLORS.primary },
                        ]}
                    >
                        {item.name}
                    </Text>
                    {activeCategoryId === item.id && (
                        <View
                            style={{
                                height: COLORS.SPACING,
                                width: COLORS.SPACING,
                                backgroundColor: COLORS.primary,
                                borderRadius: COLORS.SPACING / 2,
                                marginTop: COLORS.SPACING / 2,
                            }}
                        />
                    )}
                </TouchableOpacity>
            )}
        />
    );
};

export default CategoryCard;

const styles = StyleSheet.create({});