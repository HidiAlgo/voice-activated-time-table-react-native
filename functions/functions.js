import { transform } from "@babel/core";

export const what_is_next_lecturer = (data, day, hour, min) => {
    let filteredData = data.filter(d => {
        if(d.selectedDate == day){
            if(d.startTimeHour >= hour){
                if(d.startTimeHour == hour){
                    if(d.startTimeMin >= min){
                        return d;
                    }
                }else{
                    return d;
                }
            }
        }
    });

    // sort the filtered data and return the most near lecture
    return filteredData;
}

const getRealDay = (day, currentDay) => {
    console.log(day)
    switch(day){
        case "today":
            realDay = currentDay;
            break;
        case "monday":
            realDay = "MON";
            break;
        case "tuesday":
            realDay = "TUE";
            break;
        case "wednesday":
            realDay = "WED";
            break;
        case "thursday":
            realDay = "THU";
            break;
        case "friday":
            realDay = "FRI";
            break;
        case "saturday":
            realDay = "SAT";
            break;
        default:
            return null;                             
    }

    return realDay;
}

export const do_i_have_lectures_at_time = (data, day, hour, min, currentDay) => {
    let realDay = getRealDay(day.trim(), currentDay);
    if (realDay == null) return null;
    
    
    let filteredData = data.filter(d => {
        if(d.selectedDate == realDay){
            if(d.startTimeHour == hour && d.startTimeMin == min){
                return d;
            }
        }
    })

    return filteredData;
}

export const what_are_the_lectures_on_day = (data, day, currentDay) => {
    // console.log("this is the day = ",day)
    let realDay = getRealDay(day.trim(), currentDay);
    console.log("this is the real day = ",realDay)

    if (realDay == null) return null;

    let filteredData = data.filter(d => {
        if(d.selectedDate == realDay){
            return d;
        }
    })

    return filteredData;
}

export const what_are_the_lecture_times_of_subject = (data, subject) => {
    let filteredData = data.filter(d => {
        if(d.courseTitle.trim() === subject){
            return d;
        }
    })

    return filteredData;
}