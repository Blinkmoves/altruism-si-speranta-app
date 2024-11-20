import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Calendar, CalendarList, LocaleConfig, Agenda } from "react-native-calendars";
import useThemeStyles from "../hooks/useThemeStyles";
import { useThemeContext } from '../hooks/useThemeContext';
import globalStyles from "../styles/globalStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showSuccessToast, showErrorToast, showInfoToast } from "../utils/toastHelpers";

// TODO when declaring events in firebase: add an optional field for the color of the event (that the dots will use or use a fallback color if no color specified)

// FIXME: fix Agenda because it's not always working (works well when reloaded, until mount changes)
// FIXME: make day bolder in Agenda list, check the padding/margin for events in the list
// FIXME: use the other props such as loadItemsForMonth, onRefresh, onEndReached, etc. for the Agenda component
// HACK: docs: https://wix.github.io/react-native-calendars/docs/Components/Agenda
// HACK: docs: https://www.npmjs.com/package/react-native-calendars/v/1.1286.0

// TODO: use multi-period marking instead and add option for events that span more days (and marked accordingly)

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
  const [themeVersion, setThemeVersion] = useState(0);  // Used to force re-render of the Calendar component

  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'list' view
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    setThemeVersion((prevVersion) => prevVersion + 1);
  }, [theme]);

  // Sample events data
  const events = {
    "2024-11-10": [
      { id: 1, title: "Event 1", color: "magenta" },
      { id: 2, title: "Event 2", color: "red" },
      { id: 4, title: "Event 4", color: "blue" },
      { id: 5, title: "Event 5", color: "cyan" },
    ],
    "2024-11-12": [
      { id: 3, title: "Event 3", color: "yellow" },
      { id: 6, title: "Event 6", color: "turquoise" },
    ],
  };


  // Transform your events data to the format Agenda expects
  const transformEvents = () => {
    const transformedEvents = {};

    Object.keys(events).forEach(date => {
      transformedEvents[date] = events[date].map(event => ({
        ...event,
        height: 50, // Required by Agenda
        day: date,
      }));
    });

    return transformedEvents;
  };

  // Handle initial month on mount and month changes
  useEffect(() => {
    const today = new Date();
    const initialMonth = LocaleConfig.locales['ro'].monthNames[today.getMonth()];
    setCurrentMonth(initialMonth);
  }, []); // Empty dependency array - runs once on mount

  // Get month and year from the Calendar component with onMonthChange prop
  const handleMonthChange = (monthData) => {
    setSelectedMonthYear({
      month: monthData.month - 1, // Convert to 0-based month
      year: monthData.year
    });
    setCurrentMonth(LocaleConfig.locales['ro'].monthNames[monthData.month - 1]);
  };

  // Get filtered events based on selected date or month (for list view)
  const getFilteredEvents = () => {
    if (selectedDate) {
      return events[selectedDate] || [];
    }
    return Object.keys(events)
      .filter((date) => {
        const eventDate = new Date(date);
        return (
          eventDate.getMonth() === selectedMonthYear.month &&
          eventDate.getFullYear() === selectedMonthYear.year
        );
      })
      .flatMap((date) => events[date]);
  };

  // Prepare marked dates for the calendar
  const markedDates = {};
  Object.keys(events).forEach((date) => {
    const dots = events[date].map((event, index) => ({
      key: `event_${event.id}_${index}`,
      color: event.color || "#60908C",
      selectedDotColor: event.color || "#60908C",
    }));
    markedDates[date] = { dots };
  });

  // Handle date selection
  const onDayPress = (day) => {
    const dateEvents = events[day.dateString];
    if (dateEvents) {
      setSelectedDate(day.dateString);
      setViewMode('list');
    } else {
      showInfoToast('Nu există evenimente pentru această dată.');
    }
  };

  // Toggle view functions
  const switchToCalendarView = () => {
    setViewMode('calendar');
    setSelectedDate(null);
  };

  const switchToListView = () => {
    if (selectedDate) {
      setViewMode('list');
    } else {
      // Show events for the current month
      setViewMode('list');
    }
  };

  // Render the component
  const renderItem = (item) => (
    <View style={[styles.eventItem, themeStyles.container]}>
      <Text style={[styles.eventText, themeStyles.text]}>
        {item.title}
      </Text>
      <Text>this</Text>
    </View>
  );

  // Render empty data
  const renderEmptyData = () => (
    <View style={styles.noEventsContainer}>
      <Text style={[styles.noEventsText, themeStyles.text]}>
        Nu există evenimente pentru această zi.
      </Text>
    </View>
  )

  return (
    <View style={globalStyles.container}>
      <Agenda
        // key={`agenda-${themeVersion}`} // Force re-render when theme changes
        items={transformEvents()}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
        onDayPress={onDayPress}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={themeStyles.calendar}
        showClosingKnob={true}
        current={`${selectedMonthYear.year}-${String(selectedMonthYear.month + 1).padStart(2, '0')}-01`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    marginBottom: 10,
  },
  toggleInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    marginLeft: 16,
  },
  eventItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  eventText: {
    fontSize: 16,
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#60908C",
    padding: 12,
    alignItems: "center",
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    alignItems: "center",
    alignContent: "center",
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
  },
});
