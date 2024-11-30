import React, { useState, useEffect, memo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Calendar, CalendarList, LocaleConfig, Agenda } from "react-native-calendars";
import useThemeStyles from "../hooks/useThemeStyles";
import { useThemeContext } from '../hooks/useThemeContext';
import globalStyles from "../styles/globalStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toastHelpers";
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from '../services/firebaseConfig';

// FIXME:  (NOBRIDGE) LOG  VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 36360, "dt": 54096, "prevDt": 8280}
// IDEA use onRefresh prop to fetch new data from the server here and in TaskWidget too

// Local config for the calendar
LocaleConfig.locales['ro'] = {
  monthNames: [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombrie',
    'Noiembrie',
    'Decembrie'
  ],
  monthNamesShort: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'],
  dayNamesShort: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
  today: 'Astăzi'
};
LocaleConfig.defaultLocale = 'ro';

export default function EventsWidget() {
  const { themeStyles, colors } = useThemeStyles();
  const { theme, toggleTheme } = useThemeContext();

  const navigation = useNavigation();

  const [events, setEvents] = useState([]);
  const [transformedEvents, setTransformedEvents] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]  // Get the current date in 'YYYY-MM-DD' format
  );
  const [currentMonth, setCurrentMonth] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    // console.log('Listening to events from Firebase.');

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      // console.log('Raw snapshot data:', data);
      const eventsList = [];

      if (data) {
        // Assuming data structure: events > userId > eventId > eventDetails
        Object.values(data).forEach((userEvents) => {
          Object.values(userEvents).forEach((event) => {
            eventsList.push(event);
          });
        });
      }

      setEvents(eventsList);
      // console.log('Fetched events:', eventsList);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const { transformedEvents, markedDates } = transformEvents(events);
    setTransformedEvents(transformedEvents);
    setMarkedDates(markedDates);
  }, [events]);

  // Transform events data to the format Agenda expects
  const transformEvents = (events) => {
    const transformedEvents = {};
    const markedDates = {};

    // Helper function to get the next date in 'YYYY-MM-DD' format
    const getNextDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + 1);
      const nextYear = date.getFullYear();
      const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
      const nextDay = String(date.getDate()).padStart(2, '0');
      return `${nextYear}-${nextMonth}-${nextDay}`;
    };

    // Helper function to format date to 'DD/MM/YYYY'
    const formatDisplayDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    events.forEach((event) => {
      let startDate = event.startDate;  // Use 'let' for the start date of the event because it's changing when getNextDate is called
      const endDate = event.endDate;

      while (startDate <= endDate) {
        const uniqueId = `${event.id}-${startDate}`;

        // Use 'YYYY-MM-DD' format (Agenda expects this format)
        if (!transformedEvents[startDate]) {
          transformedEvents[startDate] = [];
        }

        transformedEvents[startDate].push({
          ...event,
          height: 50, // Required by Agenda
          day: startDate,
          id: uniqueId,
          // Add formatted dates for display
          formattedStartDate: formatDisplayDate(event.startDate),
          formattedEndDate: formatDisplayDate(event.endDate),
        });

        // Prepare periods for markedDates
        if (!markedDates[startDate]) {
          markedDates[startDate] = { periods: [] };
        }

        markedDates[startDate].periods.push({
          color: event.color.replace(/['"]+/g, ''),
          startingDay: startDate === event.startDate,
          endingDay: startDate === event.endDate,
        });

        // Move to the next date
        startDate = getNextDate(startDate);

        // Prevent infinite loops
        const nextDate = new Date(startDate);
        if (isNaN(nextDate) || nextDate > endDate) {
          break;
        }
      }
    });

    return { transformedEvents, markedDates };
  };


  // Handle initial month on mount and month changes
  useEffect(() => {
    const today = new Date();
    const initialMonth = LocaleConfig.locales['ro'].monthNames[today.getMonth()];
    setCurrentMonth(initialMonth);
  }, []);

  // Get month and year from the Calendar component with onMonthChange prop
  const handleMonthChange = (monthData) => {
    setSelectedMonthYear({
      month: monthData.month - 1, // Convert to 0-based month
      year: monthData.year
    });
    setCurrentMonth(LocaleConfig.locales['ro'].monthNames[monthData.month - 1]);
  };

  // TODO add params when backend done
  // Navigate to TaskShowPage
  const navigateToEventShowPage = (event) => {
    navigation.navigate('Evenimente', {
      screen: 'EventShowPage',
      params: { eventId: event.id, uid: event.uid },
    });
  };

  // Render item component
  const EventItem = React.memo(({ item }) => {
    return (
      <View style={[styles.eventItem, themeStyles.container]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigateToEventShowPage(item)}
        >
          <Text style={[styles.eventTitle, themeStyles.text]}>
            {item.name}
          </Text>
          <Text style={[styles.eventText, themeStyles.textGray]}>
            Responsabili:
            <Text style={[styles.eventText, themeStyles.text]}> {item.responsiblePerson}</Text>
          </Text>
          <Text style={[styles.eventText, themeStyles.textGray]}>
            Perioada:
            <Text style={[styles.eventText, themeStyles.text]}> {item.formattedStartDate} - {item.formattedEndDate}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const renderItem = (item) => {
    if (!item) return null;
    return <EventItem item={item} />;
  };

  // Render empty data
  const renderEmptyData = () => (
    <View style={styles.noEventsContainer}>
      <Text style={[styles.noEventsText, themeStyles.text]}>
        Nu există evenimente pentru această zi.
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Agenda
        firstDay={1}
        items={transformedEvents}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
        onMonthChange={handleMonthChange}
        // onDayPress={(day) => {
        //   setSelectedDate(day.dateString);
        // }}
        markedDates={markedDates}
        markingType={"multi-period"}
        theme={{
          ...themeStyles.calendar,
          'stylesheet.agenda.list': {
            // This makes the day bold in the Agenda list
            dayNum: {
              fontSize: 28,
              fontWeight: 'bold',
              color: colors.text,
            },
            // This hides the day part in the list view
            // day: {
            //   display: 'none',
            // }
          },
        }}
        showClosingKnob={true}
        showOnlySelectedDayItems={true}
        showScrollIndicator={true}
        animateScroll={true}
        current={`${selectedMonthYear.year}-${String(selectedMonthYear.month + 1).padStart(2, '0')}-01`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventItem: {
    flex: 1,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 14,
    marginLeft: 10,
    marginRight: 15,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  eventText: {
    flex: 1,
    fontSize: 16,
    paddingBottom: 4,
  },
  eventInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
