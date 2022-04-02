import {useEffect , useState} from 'react';

export const DatePicker = (props) => {
    const language = props.language || 'default';

    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Day(true, new Date()));

    const update = (e) => {
        const target = e.target;

        if(target.id === "backwards") {
            setDate(new Date(date.getFullYear(), date.getMonth() -1, 1));
        } else {
            setDate(new Date(date.getFullYear(), date.getMonth() +1, 1));
        }
    }

    const selectDate = (e) => {
        e.stopPropagation();
        const target = e.target;
        const date = target.getAttribute("value").split("-");
        setSelectedDate(new Day(true, new Date(date[2], (date[1] -1), date[0])));
        target.parentNode.querySelectorAll(".selected").forEach((child) => {
            child.classList.remove("selected");
        });
        target.classList.add("selected");

       target.parentNode.parentNode.classList.remove("open");
    }

    const click = (e) => {
        e.stopPropagation();

        if(!e.currentTarget.classList.contains("open")) {
            const element = e.currentTarget;
            element.classList.add("open");
        }
    }

    return (
                <div className="date-picker" onClick={click} value={selectedDate.getFormatedDate()}>
                    <div className="date-picker__month-switch" >
                         <button className="date-picker__backwards" id="backwards" onClick={(e) => {update(e)}}>&#60;</button>    
                         <p className="date-picker__month">{date.toLocaleDateString(language, {month: 'long'})}</p>
                         <button className="date-picker__forwards" id="forwards" onClick={(e) => {update(e)}}>&#62;</button>
         
                    </div>
                    <p className="date-picker__selected-date">selected date: {selectedDate.date.toLocaleDateString(language)}</p>
                        <Calender language={language} date={date} selectDate={selectDate}/>
                </div>
            );
}

class Day {
    constructor(inMonth = false, date = undefined) {
        this.inMonth = inMonth;
        this.date = date;
    }

    dayIsInCalenderMonth() {
        return this.inMonth;
    }

    getFormatedDate() {
        return this.date.getDate() + "-" + (this.date.getMonth() + 1) + "-" + this.date.getFullYear();
    }

    getDate() {
        return this.date.getDate();
    }

    getWeekDay() {
        return this.date.getDay();
    }

    isToday() {
        this.toDay = new Date();

        if(this.toDay.getDate() === this.date.getDate() &&
           this.toDay.getMonth() === this.date.getMonth() &&
           this.toDay.getFullYear() === this.date.getFullYear()) {
            
           return true;
        } else {
            return false;
        }
    }
}

const Calender = (props) => {
    var date = props.date || new Date();
    const lang = props.language;

    const toDay = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const order = [1,2,3,4,5,6,0];

    

    const getDaysBefore = () => {
        const dayOfTheWeek = firstDayOfMonth.getDay();
        const daysLeft = dayOfTheWeek -1;
        const days = [];

        // jan 6 feb 2 maa 2 apr 5 
        // jan 5 feb 1 maa 1 apr 4

        if(daysLeft > -1) {
            for(var i = 1; i <= daysLeft; i++) {
                const currentDay = new Date(date.getFullYear(), date.getMonth(), -daysLeft + i);
                days.push(new Day(false, currentDay));
            }
        } else {
            for(var sun = 6; sun >= 1; sun--) {
                const currentDay = new Date(date.getFullYear(), date.getMonth(), 0 - sun + 1);
                days.push(new Day(false, currentDay));
            }
        }
        return days;
    }

    const getMonthDays = () => {
        const days = [];
        for(var i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const currentDay = new Date(date.getFullYear(), date.getMonth(), i);
            days.push(new Day(true, currentDay));
        }

        return days;
    }

    const getDaysAfter = () => {
        const dayOfTheWeek = lastDayOfMonth.getDay();
        const daysAfter = 7 - dayOfTheWeek;
    
        const days = [];

        if(lastDayOfMonth.getDay() > 1) {
            for(var i = 0; i < daysAfter; i++) {
                const currentDay = new Date(date.getFullYear(), date.getMonth() + 1, i + 1);
                days.push(new Day(false, currentDay));
            }
        }
        
        return days;
    }

    const weekDays = () => {
        const dayOfTheWeek = firstDayOfMonth.getDay();
        const days = [];

        if(dayOfTheWeek > 0) {
            getDaysBefore().forEach((day, i) => {
                days.push(day.date.toLocaleString(lang, {weekday: 'short'}));
            });
    
            for(var i = 0; i <= (7 - dayOfTheWeek); i++) {
                const currentDay = new Date(date.getFullYear(), date.getMonth(), i + 1);
                days.push(currentDay.toLocaleString(lang, {weekday: 'short'}));
            }
        } else {
            for(var sun = 6; sun >= 0; sun--) {
                const currentDay = new Date(date.getFullYear(), date.getMonth(), 0 - sun + 1);
                days.push(currentDay.toLocaleString(lang, {weekday: 'short'}));
            }
        }
       

        return days;
    }

    const calenderDays = () => {
        const days = [];
        getDaysBefore().forEach((day) => {days.push(day)});
        getMonthDays().forEach((day) => {days.push(day)});
        getDaysAfter().forEach((day) => {days.push(day)});

        return days;
    };

    

    return (<div className="calendar">
                {
                    weekDays().map((day, key) => {
                         return  <span className="calendar__weekday" key={key}>{day}</span>;
                    })

                    
                }

                {calenderDays().map((day, key) => {
                    if(day.dayIsInCalenderMonth() === true) {
                        return <span className="calendar__day" onClick={(e) => {props.selectDate(e)}} key={key} value={day.getFormatedDate()}>{day.getDate()}</span>
                    } else {
                        return <span className="calendar__day other-month" key={key} value={day.getFormatedDate()}>{day.getDate()}</span>
                    }
                   
                })}
    </div>);
}

// export const DatePicker = () => {
//     const language = 'default';
//     const [date, setDate] = useState(new Date());
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [days ,setDays] = useState([]);

//     useEffect(() => {
//         update(null);
//     }, []);

//     function update(e) {
//         var newDate = date;
//        if(e) {
//            if(e.target.id === "backwards") {
//                 newDate = new Date(date.getFullYear(), (date.getMonth() -1), 1);
//            } else {
//                 newDate = new Date(date.getFullYear(), (date.getMonth() +1), 1);
//            }
//        }

//        setDate(newDate);
//        generateDays(newDate);
//     }

//     function selectDate(e) {
//         let value = e.target.getAttribute("value");
//         const dateString = (value + "").split("-");
//         const newDate = new Date(dateString[2], dateString[1], dateString[0]);
//         setSelectedDate(newDate);

//         e.target.parentNode.querySelector(".selected")? e.target.parentNode.querySelector(".selected").classList.remove("selected"): value = null;
//         e.target.classList.add("selected");
//     }

//     function generateDays(newDate) {
//         const firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
//         const daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth()+1, 0).getDate();
//         const daysBefore = (1 - firstDay.getUTCDay()) -1;
//         const toDay = new Date();

//         let newDays = [];
        
//         for(let i = daysBefore; i < 0; i++) {
//             const currentDate = new Date(newDate.getFullYear(),newDate.getMonth(), (i + 2));
//             newDays.push(
//                 {
//                     day: (currentDate.getUTCDate()),
//                     month: currentDate.getMonth() +1,
//                     year: currentDate.getFullYear(),
//                     dayOfWeek: currentDate.getUTCDay(),
//                     inMonth: false,
//                     isToday: false
//                 }
//              );
//         }

//         for(let i = 1; i < (daysInMonth + 1); i++) {
//             const currentDate = new Date(newDate.getFullYear(),newDate.getMonth(), (i + 1));
         
//             if(toDay.getFullYear() === currentDate.getFullYear() && toDay.getMonth() === currentDate.getMonth()&& toDay.getDate() === currentDate.getDate()) {
//                 newDays.push(
//                     {
//                         day: (currentDate.getUTCDate()),
//                         month: currentDate.getMonth() +1,
//                         year: currentDate.getFullYear(),
//                         dayOfWeek: currentDate.getUTCDay(),
//                         inMonth: true,
//                         isToday: false
//                     }
//                  );
//             } else {
//                 newDays.push(
//                     {
//                         day: (currentDate.getUTCDate()),
//                         month: currentDate.getMonth() +1,
//                         year: currentDate.getFullYear(),
//                         dayOfWeek: currentDate.getUTCDay(),
//                         inMonth: true,
//                         isToday: false
//                     }
//                 );
//             }
        
//         }
        
//         const left = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDay() - 7;
//         for(let i = (-1 * left); i > 0; i--) {
//             const currentDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0 - (i + left -2));
//             newDays.push(
//                 {
//                     day: (currentDate.getUTCDate()),
//                     month: currentDate.getMonth() +1,
//                     year: currentDate.getFullYear(),
//                     dayOfWeek: currentDate.getUTCDay(),
//                     inMonth: false,
//                     isToday: false
//                 }
//             );
//         }


//         setDays(newDays);
//     }

//     return (
//         <div className="date-picker" value={date}>
//             <div className="date-picker__month-switch">
//                 <button className="date-picker__backwards" id="backwards" onClick={(e) => {update(e)}}>&#60;</button>
//                  <p className="date-picker__month">{date.toLocaleDateString(language, {month: 'long'})}</p>
//                 <button className="date-picker__forwards" id="forwards" onClick={(e) => {update(e)}}>&#62;</button>
//             </div>
//             <p className="date-picker__selected-date">{date.toLocaleDateString(language)}</p>

//             <div className="calender">

//                 <div className="calender__days">
//                     <span className="calender__weekday" key="1">{new Date(2022, 3, 4).toLocaleDateString(language, {weekday: 'short'})}</span>
//                     <span className="calender__weekday" key="2">{new Date(2022, 3, 5).toLocaleDateString(language, {weekday: 'short'})}</span>
//                     <span className="calender__weekday" key="3">{new Date(2022, 3, 6).toLocaleDateString(language, {weekday: 'short'})}</span>
//                     <span className="calender__weekday" key="4">{new Date(2022, 3, 7).toLocaleDateString(language, {weekday: 'short'})}</span>
//                     <span className="calender__weekday" key="5">{new Date(2022, 3, 8).toLocaleDateString(language, {weekday: 'short'})}</span>
//                     <span className="calender__weekday" key="6">{new Date(2022, 3, 9).toLocaleDateString(language, {weekday: 'short'})}</span>
//                     <span className="calender__weekday" key="7">{new Date(2022, 3, 10).toLocaleDateString(language, {weekday: 'short'})}</span>
//                     {
//                         days.map((day, i) => {
//                             if(day.inMonth === true) {
//                                 return day.isToday? <span className="calender__day today" onClick={(e) => {selectDate(e)}} key={i} value={day.day + "-" + day.month + "-" + day.year}>{day.day}</span> : 
//                                                     <span className="calender__day" onClick={(e) => {selectDate(e)}} key={i} value={day.day + "-" + day.month + "-" + day.year}>{day.day}</span>;
//                             } else {
//                                 return <span className="calender__day other-month" onClick={(e) => {selectDate(e)}} key={i} value={day.day + "-" + day.month + "-" + day.year}>{day.day}</span>
//                             }
//                         })
//                     }
//                 </div>
//             </div>
        
//         </div>
//     );
// }

