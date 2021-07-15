import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, FlatList, Pressable, Modal, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

import * as Commands from '../functions/functions';
import FlatListModalComponent from '../components/FlatListModalComponent';

const Home = ({navigation}) => {

    const[text, setText] = useState('');
    const[result, setResult] = useState('Hi there!! ')
    const[data, setData] = useState([]);

    const[listening, setListening] = useState(false);

    const[microphoneColor, setMicrophoneColor] = useState("#809ffc");

    const[filteredData, setFilteredData] = useState([]);

    const[modalVisible, setModalVisible] = useState(false);

    const[item, setItem] = useState([]);

    // this method will be triggered when the speech is begin
    const _onSpeechStart = () => {
        setText('');
    };


    // this method works after the speech is over
    const _onSpeechEnd = () => {

    };
    
    // this is the function that is used to identify the commands
    const checkVoiceCommands = (said) => {
        if(said === "edit" || said === "timetable"){
            setResult("Okay wait");
            navigation.navigate('timetable');
        }

        let date = new Date();

        let today = currentDay(date);
        let currentHour = date.getHours();
        let currentMin = date.getMinutes();
        
        let filteredData = "";


        if(said.includes("next")){
            //command = what is the next lecture
            filteredData = Commands.what_is_next_lecturer(data, today, currentHour, currentMin);
            
            if(filteredData.length != 0){
                setFilteredData(filteredData);
                setResult("These are the lectures you have next");
            }else{ 
                setResult("You do not have anything next");
                setFilteredData([]);
            }

        }else if(said.includes("p.m") || said.includes("a.m")){
            //command = do I have a lecture at 8 pm thursday
            let words = said.split(' ');
            let time = words[words.length - 3].split(":");
            let morningOrEvening = words[words.length - 2];
            let day = words[words.length - 1];

            let hour = time[0];
            let min = time[1] != null? time[1] : 0;
            
            if(morningOrEvening == "a.m."){
                filteredData = Commands.do_i_have_lectures_at_time(data, day, hour, min);
            }else{
                filteredData = Commands.do_i_have_lectures_at_time(data, day.toLowerCase(), parseInt(hour)+12, min, today);
            }
            
            if(filteredData.length != 0){
                setResult("Yes, you have the following lecture");
                setFilteredData(filteredData)
            }else{
                setResult("Horray, you don't have anything at "+hour+":"+min+" "+morningOrEvening);
                setFilteredData([])
            }
            

        }else if(said.includes("times") || said.includes("timings")){
            // command = what are the times of software engineering
            let words = said.split(" of ")

            filteredData = Commands.what_are_the_lecture_times_of_subject(data, words[1].toLowerCase());

            let actualData = []

            filteredData.forEach((i) => {
                let data = {
                    courseCode: i.courseCode,
                    courseTitle: i.selectedDate+" at "+i.startTimeHour+":"+i.startTimeMin,
                    endTimeHour: i.endTimeHour,
                    endTimeMin: i.endTimeMin,
                    selectedDate: i.selectedDate,
                    startTimeHour: i.startTimeHour,
                    startTimeMin: i.startTimeMin,
                    title: i.courseTitle,
                    id: i.id
                }
                actualData.push(data);
            })

            if(filteredData.length != 0){
                setFilteredData(actualData);
                setResult("You have the following times");
            }else{
                setResult("Sorry I did not found anything for "+words[1]);
                setFilteredData([]);
            }

        }else if(said.includes('lectures on')){
            let words = said.split(" lectures on ");

            filteredData = Commands.what_are_the_lectures_on_day(data, words[1].toLowerCase(), today);
            
            if(filteredData != null && filteredData.length != 0){
                setResult("You have the following lectures on "+ words[1]);
                setFilteredData(filteredData);
            }else{
                setResult("Oopz, you don't have any lectures on "+words[1]);
                setFilteredData([]);
            }
            
        }else{
            setResult("Sorry, I beg your pardon")
            setFilteredData([]);
        }   

    }


    // this is the final method of speech recognition
    const _onSpeechResults = (event) => {
        setText(event.value[0]);

        let said = event.value[0];

        checkVoiceCommands(said);
    };


    const _onSpeechError = (event) => {
        console.log(event.error);
    };

    // using this, we can get the intermediate results of the speech
    const _onSpeechPartialResults = (event) => {
        setText(event.value[0]);
    }

    // this is the funtion that is triggered when the microphone is pressed
    const voiceStart = () => {
        Voice.start();
        setMicrophoneColor("#f07da8");
        setListening(true);
    }

    // this is the functio that is triggered when the microphone is released
    const voiceStop = () => {
        Voice.stop();
        setMicrophoneColor("#809ffc");
        setListening(false);
    }

    const currentDay = (date) => {
        let day = date.getDay();

        switch(day){
            case 0:
                return "SUN";
            case 1:
                return "MON";
            case 2:
                return "TUE";
            case 3: 
                return "WED";
            case 4:
                return "THU";
            case 5:
                return "FRI";
            case 6: 
                return "SAT";                        
        }
    }

    const modalReturned = (item) => {

        setModalVisible(true);
        setItem(item);

    }
    
    const retrieveData = async () => {
        let data = await AsyncStorage.getItem('data');
        data =  data != null ? JSON.parse(data) : [];
        setData(data);
    }


    useEffect(async () => {

        retrieveData();

        Voice.onSpeechStart = _onSpeechStart;
        Voice.onSpeechEnd = _onSpeechEnd;
        Voice.onSpeechPartialResults = _onSpeechPartialResults;
        Voice.onSpeechResults = _onSpeechResults;
        Voice.onSpeechError = _onSpeechError;
        
    
        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        };

    },[data])


    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        },
        microphone: {
            backgroundColor: microphoneColor,
            marginBottom: 10,
            borderRadius: 60,
            width: 120,
            height: 120,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 10
        },
        microphoneContainer: {
            // alignSelf: 'flex-start'
            flex: 1,
            backgroundColor: 'white',
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center'
        },
        resultsContainer: {
            backgroundColor: 'white',
            flex: 4,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        microphoneBackground: {
            width: '100%',
            height: 75,
            position: 'absolute',
            zIndex: -1,
        },
        lottieOne: {
            width: "80%",
            marginBottom: -10
        },
        lottieTwo: {
            marginTop: -100,
        },
        inputText: {
            fontSize: 18,
        },
        resultText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10
        },
        outputTextContainer:{
            width: "90%",
            backgroundColor: '#FFE3F3',
            height: 200,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            borderRadius: 25,
            elevation: 10
        },
        inputTextContainer: {
            backgroundColor: '#E9EFFF',
            marginBottom: 50,
            width: "90%",
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8,
            borderRadius: 25,
            elevation: 10
        },
        item: {
            backgroundColor: '#f9c2ff',
            padding: 20,
            width: "100%",
            marginVertical: 3,
            borderRadius: 10
        },
        title: {
            fontSize: 16,
        },
        flatList: {
            width: "90%",
        }
    })





    return (
        <View style={styles.container}>

            <Modal

            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose = {() => setModalVisible(!modalVisible)}>
                <FlatListModalComponent item={item} color="" />
            </Modal>

            <View style={styles.resultsContainer}>
                <LottieView style={styles.lottieOne} source={require('../lotties/lottie1.json')} autoPlay loop />
                {listening && <LottieView style={styles.lottieTwo} source={require('../lotties/lottie2.json')} autoPlay loop />}
                <View style={styles.outputTextContainer}>

                    <Text style={styles.resultText}>{result}</Text>
                    <FlatList
                        data={filteredData}
                        renderItem = {({item}) => (
                            <TouchableNativeFeedback onPress={() => modalReturned(item)}>
                                <View style={styles.item}>
                                    <Text style={styles.title}>{item.courseTitle}</Text>
                                </View>
                            </TouchableNativeFeedback>  
                        )} 
                        keyExtractor = {item => item.id}
                        style={styles.flatList} />
                        
                </View>
                
                <View style={styles.inputTextContainer}>
                    <Text style={styles.inputText}>{text}</Text>
                </View>
            </View>
            <View style={styles.microphoneContainer}>
                <Pressable style={styles.microphone} 
                onPressIn={voiceStart}
                onPressOut={voiceStop}>
                    <Icon name="microphone" size={45} color={"white"}/>
                </Pressable>
                <LinearGradient
                 start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
                 colors={['#9b63f8', '#809ffc', '#9b63f8']} 
                 style={styles.microphoneBackground}>

                </LinearGradient>
            </View>
            
        </View>
    );

    
}



export default Home;