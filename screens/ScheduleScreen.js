import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { realtimeDb } from '../firebase';
import {ref, onValue, query,orderByChild,equalTo} from 'firebase/database'

const generateDates = (centerDate, daysBefore, daysAfter) => {
  let dates = [];
  for (let i = -daysBefore; i <= daysAfter; i++) {
    dates.push(moment(centerDate).add(i, 'days').format('YYYY-MM-DD'));
  }
  return dates;
};

const teamLogos = {
  "Ulsan": "https://www.kleague.com/assets/images/emblem/emblem_K01.png",
  "Jeonbuk Motors": "https://www.kleague.com/assets/images/emblem/emblem_K05.png",
  "FC Seoul":"https://www.kleague.com/assets/images/emblem/emblem_K09.png",
  "Incheon United":"https://www.kleague.com/assets/images/emblem/emblem_K18.png",
  "Suwon Bluewings":"https://www.kleague.com/assets/images/emblem/emblem_K02.png",
  "Gwangju":"https://www.kleague.com/assets/images/emblem/emblem_K22.png",
  "Jeju United":"https://www.kleague.com/assets/images/emblem/emblem_K04.png",
  "Suwon":"https://www.kleague.com/assets/images/emblem/emblem_K29.png",
  "Daegu":"https://www.kleague.com/assets/images/emblem/emblem_K17.png",
  "Daejeon Citizen":"https://www.kleague.com/assets/images/emblem/emblem_K10.png",
  "Pohang Steelers":"https://www.kleague.com/assets/images/emblem/emblem_K03.png",
  "Gangwon":"https://www.kleague.com/assets/images/emblem/emblem_K21.png",
};

const ScheduleScreen = () => {
  const today = moment().startOf('day');
  const [dates, setDates] = useState(generateDates(today, 3, 3));
  const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
  const [matches, setMatches] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const scrollViewRef = React.createRef();

  useEffect(() => {
    fetchMatches(selectedDate);
  }, []);

  const fetchMatches = async (date) => {
    try {
      const matchesRef = ref(realtimeDb)
      const matchesQuery = query(matchesRef, orderByChild('date'), equalTo(date));
      onValue(matchesQuery,(snapshot) =>{
        console.log("Snapshot exists: ", snapshot.exists());
        console.log("Snapshot data: ", snapshot.val());
        if (snapshot.exists()) {
          let data = snapshot.val();
          console.log(data);
          let matchesArray = Object.keys(data).map(key => data[key]);
          setMatches({ [date]: matchesArray })
      } else {
        setMatches({ [date]: [] });
      }
    });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const onDateSelect = (date) => {
    setSelectedDate(date);
    setDates(generateDates(moment(date), 3, 3));
    fetchMatches(date);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: dates.indexOf(date) * 70,
        animated: true,
      });
    }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setDates(generateDates(moment(day.dateString), 3, 3));
    setIsCalendarVisible(false);
    fetchMatches(day.dateString);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: dates.indexOf(day.dateString) * 70,
        animated: true,
      });
    }
  };

  const renderDateTabs = () => {
    return dates.map((date, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.dateTab, selectedDate === date && styles.selectedDateTab]}
        onPress={() => onDateSelect(date)}
      >
        <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
          {moment(date).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'MM/DD',
            lastDay: '[Yesterday]',
            lastWeek: 'MM/DD',
            sameElse: 'MM/DD'
          })}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderMatchesForDate = () => {
    return (matches[selectedDate] || []).map((match, index) => (
      <View key={index} style={styles.matchItem}>
        <View style={styles.teamSection}>
          <Image source={{ uri: teamLogos[match.home_team_name] }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.home_team_name}</Text>
        </View>
  
        <View style={styles.matchDetails}>
          {match.status === 'complete' ? (
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{match.home_team_goal_count}</Text>
              <Text style={styles.vsText}>vs</Text>
              <Text style={styles.scoreText}>{match.away_team_goal_count}</Text>
            </View>
          ) : (
            <Text style={styles.vsText}>vs</Text>
          )}
          <Text style={styles.matchTime}>{match.time}</Text>
        </View>
  
        <View style={styles.teamSection}>
          <Image source={{ uri: teamLogos[match.away_team_name] }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.away_team_name}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView
          horizontal
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {renderDateTabs()}
        </ScrollView>
        <TouchableOpacity
          onPress={() => setIsCalendarVisible(!isCalendarVisible)}
          style={styles.calendarButton}
        >
          <Ionicons name="calendar" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {isCalendarVisible && (
        <Calendar
          onDayPress={onDayPress}
          current={selectedDate}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
        />
      )}
      <ScrollView style={styles.matchList}>
        {renderMatchesForDate()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButton: {
    marginLeft: 'auto',
  },
  dateTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
    borderRadius: 18,
  },
  selectedDateTab: {
    backgroundColor: '#000000',
  },
  dateText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: '#fff',
  },
  matchList: {
    flex: 1,
  },
  matchItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  matchText: {
    fontSize: 16,
  },
  matchTime: {
    fontSize: 16,
    color: '#888',
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  teamName: {
    fontSize: 12,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  matchDetails: {
    flex: 1,
    alignItems: 'center',
  },
  matchText: {
    fontSize: 16,
  },
  matchTime: {
    fontSize: 14,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  vsText: {
    fontSize: 16,
  },
});

export default ScheduleScreen;