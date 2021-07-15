import React, {useState, useEffect} from 'react'
import {
    Modal,  
    TouchableOpacity,
    StyleSheet, 
    View, 
    Text, 
    TextInput,
    Alert
} from 'react-native'

import TimeTableView, {genTimeBlock} from 'react-native-timetable';
// importing 3rd party component for a timetable view
// i have added the othermodules.d.ts file to include this module

import LinearGradient from 'react-native-linear-gradient';

import ActionButton from 'react-native-action-button';
// this is the bare minimum floating action button for react native

import AsyncStorage from '@react-native-async-storage/async-storage';
import TimeTableModalComponent from '../components/TimeTableModalComponent';
// this is the storage that we use to store time table data


const TimeTable = () => {

    const[modalVisible, setModalVisible] = useState(false); //this is the state variable for setting the visibuility of the modal
    const[deleteModal, setDeleteModal] = useState(false);

    const[courseCode, setCourseCode] = useState("");
    const[courseTitle, setCourseTitle] = useState("");

    const[startTimeHour, setStartTimeHour] = useState("");
    const[startTimeMin, setStartTimeMin] = useState("");
    const[endTimeHour, setEndTimeHour] = useState("");
    const[endTimeMin, setEndTimeMin] = useState("");

    const[selectedDateColor, setSelectedDateColor] = useState(["","","","","",""])
    const[selectedDate, setSelectedDate] = useState([""]);
    
    const[events_data, setEvents_data] = useState([]);


    const[selectedItem, setSelectedItem] = useState({});
    // this function is used to select the date
    const daySelected = (day, index) => {
        let colors = ["white","white","white","white","white","white"];
        colors[index] = "dodgerblue";

        setSelectedDateColor(colors);
        setSelectedDate(day);
    }
    
    // the entered data will be stored using this function
    const store = async () => {
        let data = await AsyncStorage.getItem('data');
        data =  data != null ? JSON.parse(data) : [];
        
        let id = data.length;
        
        let dataItem = {
            id,
            courseCode,
            courseTitle,
            startTimeHour,
            startTimeMin,
            endTimeHour,
            endTimeMin,
            selectedDate
        };

        data.push(dataItem);

        console.log(data)

        try {
            let jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem('data', jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    // this is the function that is triggered when a new item is saved
    const save = () => {
        if(startTimeHour >= 24 || startTimeHour<6){
            return (
                Alert.alert(
                    "Invalid input", 
                    "Start time hour should be between 6 to 24", 
                    [{text: "ok",style:{colo: "red"}}],
                    {cancelable: true})
            );
        }else if(startTimeMin > 59){
            return (
                Alert.alert(
                    "Invalid input", 
                    "Start time minute should be smaller than or equal to 59", 
                    [{text: "ok",style:{colo: "red"}}],
                    {cancelable: true})
            );
        }else if(endTimeHour >= 24 || endTimeHour<startTimeHour || endTimeHour < 6){
            return (
                Alert.alert(
                    "Invalid input", 
                    "End time hour shold be between 6 to 24, and it should be greater than start time hour", 
                    [{text: "ok",style:"cancel"}],
                    {cancelable: true})
            );
        }else if(endTimeMin > 59){
            return (
                Alert.alert(
                    "Invalid input", 
                    "Start time minute should be smaller than or equal to 59", 
                    [{text: "ok",style:{colo: "red"}}],
                    {cancelable: true})
            );
        }else if(courseCode == "" && courseTitle == ""){
            return (
                Alert.alert(
                    "Incomplete input", 
                    "You must provide values for both course code and course title", 
                    [{text: "ok",style:{colo: "red"}}],
                    {cancelable: true})
            );
        }else if(selectedDate == ""){
            return (
                Alert.alert(
                    "Incomplete input", 
                    "You must select a day of week", 
                    [{text: "ok",style:{colo: "red"}}],
                    {cancelable: true})
            );
        }
        let newItem = {
            title: courseCode,
            startTime: genTimeBlock(selectedDate, startTimeHour, startTimeMin),
            endTime: genTimeBlock(selectedDate, endTimeHour, endTimeMin),
        }

        store();
        events_data.push(newItem);

        setModalVisible(false);
        setCourseCode("");
        setCourseTitle("");
        setStartTimeHour("");
        setStartTimeMin("");
        setEndTimeHour("");
        setEndTimeMin("");

    }

    const deleteItem = async (item) => {
        let data = await AsyncStorage.getItem('data');
        data =  data != null ? JSON.parse(data) : [];
        
        let filteredData = data.filter(d => d.id !== item.id);
        let filteredEvents = events_data.filter(e => e.id !== item.id); 

        try {
            let jsonValue = JSON.stringify(filteredData);
            await AsyncStorage.setItem('data', jsonValue);
        } catch (e) {
            console.log(e);
        }

        setEvents_data(filteredEvents);
        setDeleteModal(false);
    }

    // function for the time table item clicked event
    const clickItem = async (item) => {
        let data = await AsyncStorage.getItem('data');
        data =  data != null ? JSON.parse(data) : [];

        let filteredData = data.filter(d => d.id == item.id);
        setSelectedItem(filteredData[0]);
        setDeleteModal(true);
    }

    const getStoredData = async () => {
        let data = await AsyncStorage.getItem('data');
        data =  data != null ? JSON.parse(data) : [];

        return data;
    }


    useEffect(async () => {
        let data = await getStoredData();
        let newdata = [];

        data.forEach(item => {
            let calanderItem = {
                id: item.id,
                title: item.courseCode,
                startTime: genTimeBlock(item.selectedDate, item.startTimeHour, item.startTimeMin),
                endTime: genTimeBlock(item.selectedDate, item.endTimeHour, item.endTimeMin)
            }

            newdata.push(calanderItem);
        });
        setEvents_data(newdata);
        
    }, []);


    return (
        <View style={styles.container}>
            <Modal

            visible={deleteModal}
            transparent={true}
            animationType="slide"
            onRequestClose = {() => setDeleteModal(!deleteModal)}>
                <TimeTableModalComponent item={selectedItem} color="" deleteItem={deleteItem}/>
            </Modal>

            <TimeTableView
                events={events_data}
                pivotDate={genTimeBlock('mon')}
                numberOfDays={6}
                formatDateHeader="ddd"
                onEventPress={clickItem}
                headerStyle={{backgroundColor: "#809ffc"}}
            />
            <ActionButton
                style={styles.fab}
                buttonColor="#809ffc"
                onPress={() => {setModalVisible(!modalVisible)}}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose = {() => setModalVisible(!modalVisible)}>

                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.courseCodeAndTitle}>
                                <TextInput
                                    onChangeText={setCourseCode}
                                    value={courseCode}
                                    placeholder="Course Code"
                                    maxLength={14} />
                            </View>
                            <View style={styles.courseCodeAndTitle}>
                                <TextInput
                                    onChangeText={setCourseTitle}
                                    value={courseTitle}
                                    placeholder="Course Title" 
                                    maxLength={25}/>    
                            </View>

                            <View style={styles.dayPicker}>
                
                                <View style={styles.days}>

                                    <TouchableOpacity onPress={() => daySelected("MON", 0)}>
                                        <View style={[styles.dayItem, {backgroundColor: selectedDateColor[0]}]}>
                                            <Text>MON</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => daySelected("TUE", 1)}>
                                        <View style={[styles.dayItem, {backgroundColor: selectedDateColor[1]}]}>
                                            <Text>TUE</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => daySelected("WED", 2)}>
                                        <View style={[styles.dayItem, {backgroundColor: selectedDateColor[2]}]}>
                                            <Text>WED</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => daySelected("THU", 3)}>
                                        <View style={[styles.dayItem, {backgroundColor: selectedDateColor[3]}]}>
                                            <Text>THU</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => daySelected("FRI", 4)}>
                                        <View style={[styles.dayItem, {backgroundColor: selectedDateColor[4]}]}>
                                            <Text>FRI</Text>
                                        </View>
                                    </TouchableOpacity> 
                                    <TouchableOpacity onPress={() => daySelected("SAT", 5)}>
                                        <View style={[styles.dayItem, {backgroundColor: selectedDateColor[5]}]}>
                                            <Text>SAT</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View>   
                            <View style={styles.timePickerContainer}>   
                                <View style={[styles.timePicker,{borderRightColor: '#ededed', borderRightWidth: 1}]}>  
                                    <Text >Start Time</Text>
                                    <View style={styles.timePickerHourAndMin}>
                                        <View style={styles.hours}>
                                            <TextInput
                                                onChangeText={setStartTimeHour}
                                                value={startTimeHour}
                                                placeholder="hour" 
                                                keyboardType="numeric"/> 
                                        </View>    
                                        <View style={styles.mins}>
                                            <TextInput
                                                onChangeText={setStartTimeMin}
                                                value={startTimeMin}
                                                placeholder="min" 
                                                keyboardType="numeric"
                                                maxLength={20}/>      
                                        </View>   
                                    </View>
                                </View>
                                <View style={styles.timePicker}>
                                    <Text>End Time</Text>
                                    <View style={styles.timePickerHourAndMin}>
                                        <View style={styles.hours}>
                                            <TextInput
                                                onChangeText={setEndTimeHour}
                                                value={endTimeHour}
                                                placeholder="hour" 
                                                keyboardType="numeric"/> 
                                        </View>
                                        <View style={styles.mins}>        
                                            <TextInput
                                                onChangeText={setEndTimeMin}
                                                value={endTimeMin}
                                                placeholder="min" 
                                                keyboardType="numeric"
                                                maxLength={20}/> 
                                        </View>           
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.saveButton} onPress={save}>
                                <View>
                                    <Text style={styles.saveText}>SAVE</Text>
                                </View>
                            </TouchableOpacity>
                            <LinearGradient
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                                colors={['#9b63f8', '#809ffc', '#9b63f8']} 
                                style={styles.modalBottom} />
                        </View>
                        
                    </View>

            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: "white",
        alignItems: "center",
        height: "60%",
        borderRadius: 40,
        elevation: 30,
        marginBottom:10,
        width: "95%"
    },
    modalBottom:{
        backgroundColor: 'yellow',
        width: '100%',
        height: 40,
        marginTop: 50,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40

    },
    dayPicker: {
        flexDirection: "row",
        marginTop: 20,
        borderBottomColor: '#ededed',
        borderBottomWidth:1,
        paddingBottom: 4,
        borderTopColor: '#ededed',
        borderTopWidth: 1,
        paddingTop: 4
    },
    days: {
        flexDirection: "row",
    },
    dayItem: {
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 20
    },
    timePickerHourAndMin: {
        flexDirection: "row",
        alignItems: 'center'
    },
    timePickerContainer: {
        flexDirection: "row",
        marginTop: 10,    
    },
    timePicker: {
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20
    },
    hours: {
        width: 60,
        borderRadius: 20,
        height: 40,
        marginRight: 8,
        borderColor: "dodgerblue",
        borderWidth:2,
        height: 40,
        backgroundColor: "#ebf0ff"

    },
    mins: {
        width: 60,
        borderRadius: 20,
        height: 40,
        borderColor: "dodgerblue",
        borderWidth:2,
        backgroundColor: "#ebf0ff"
    },
    courseCodeAndTitle:{
        flexDirection: "row",
        width: "80%",
        borderColor: "dodgerblue",
        borderWidth: 2,
        marginTop: 20,
        borderRadius: 20,
        height: 40,
        backgroundColor: "#ebf0ff"
    },
    saveButton: {
        marginTop: 60,
        backgroundColor: "yellow",
        width: "80%",
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        elevation: 5
    },
    saveText: {
        fontSize: 15
    },
    fab: {
        elevation: 30
    }

})

export default TimeTable;