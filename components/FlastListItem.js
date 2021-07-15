import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const FlatListItem = ({title}) => {
    const styles = StyleSheet.create({
        item: {
            backgroundColor: '#f9c2ff',
            padding: 20,
            width: "100%",
            marginVertical: 3,
            borderRadius: 10
        },
        title: {
            fontSize: 16,
        }
    });

    return (
        <TouchableOpacity onPress={() => console.log("clicked")}>
            <View style={styles.item}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}


export default FlatListItem;