import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FlatListModalComponent = ({color, item}) => {
    let title = item.title != null ? item.title : item.courseTitle;
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerStyle}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.table}>
                    <View style={styles.courseCode}>
                        <Text style={styles.headingText}>COURSE CODE</Text>
                        <Text style={styles.normalText}>{item.courseCode}</Text>
                    </View>
                    <View style={styles.selectedDate}>
                        <Text style={styles.headingText}>DAY</Text>
                        <Text style={styles.normalText}>{item.selectedDate}</Text>
                    </View>
                    <View style={styles.startTime}>
                        <Text style={styles.headingText}>START TIME</Text>
                        <Text style={styles.normalText}>{item.startTimeHour + ":"+item.startTimeMin}</Text>
                    </View>
                    <View style={styles.endTime}>
                        <Text style={styles.headingText}>END TIME</Text>
                        <Text style={styles.normalText}>{item.endTimeHour + ":"+item.endTimeMin}</Text>
                    </View>
                </View>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        backgroundColor: "white",
        width: "80%",
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 50,
        borderRadius: 50
    },
    headerStyle: {
        backgroundColor: 'yellow',
        width: '100%',
        height: 60,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    headingText:{
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9b63f8'
    },
    normalText: {
        fontSize: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },  
    table: {
        width: '100%',
        height: 280,
        marginBottom: 60
    },

    courseCode:{flex:1, justifyContent: 'center', alignItems: 'center'},
    startTime:{flex:1, justifyContent: 'center', alignItems: 'center'},
    endTime:{flex:1, justifyContent: 'center', alignItems: 'center'},
    selectedDate:{flex:1, justifyContent: 'center', alignItems: 'center'},

})

export default FlatListModalComponent;