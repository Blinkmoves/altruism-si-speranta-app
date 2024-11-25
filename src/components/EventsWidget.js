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

// TODO when declaring events in firebase: add an optional field for the color of the event (that the dots will use or use a fallback color if no color specified)

// FIXME: use the other props such as loadItemsForMonth, onRefresh, onEndReached, etc. for the Agenda component
// HACK: docs: https://wix.github.io/react-native-calendars/docs/Components/Agenda
// HACK: docs: https://www.npmjs.com/package/react-native-calendars/v/1.1286.0

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

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  // Sample events data
  const events = [
    {
      id: '1',
      title: 'Multi-Day Event 1',
      startDate: '2024-12-10',
      endDate: '2024-12-12',
      color: '#50cebb',
      responsible: 'Sara Cosarba',
    },
    {
      id: '2',
      title: 'Multi-Day Event 2',
      startDate: '2024-11-01',
      endDate: '2024-11-10',
      color: 'magenta',
      responsible: 'Paula Redes',
    },
    {
      id: '3',
      title: 'Event 14343',
      startDate: '2024-11-23',
      endDate: '2024-11-23',
      color: 'yellow',
      responsible: 'Clementina Mandarina',
    },
    {
      id: '4',
      title: 'Multi-Day Event 3',
      startDate: '2024-11-15',
      endDate: '2024-11-20',
      color: 'orange',
      responsible: 'Jonas Brothers',
    }
  ];

  
  // Transform events data to the format Agenda expects
  const transformEvents = () => {
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
      let currentDate = event.startDate;
      const endDate = event.endDate;

      while (currentDate <= endDate) {
        // Use 'YYYY-MM-DD' format (Agenda expects this format)
        if (!transformedEvents[currentDate]) {
          transformedEvents[currentDate] = [];
        }
        
        transformedEvents[currentDate].push({
          ...event,
          height: 50, // Required by Agenda
          day: currentDate,
          // Add formatted dates for display
          formattedStartDate: formatDisplayDate(event.startDate),
          formattedEndDate: formatDisplayDate(event.endDate),
        });
        
        if (!markedDates[currentDate]) {
          markedDates[currentDate] = {
            periods: [],
          };
        }

        markedDates[currentDate].periods.push({
          color: event.color,
          startingDay: currentDate === event.startDate,
          endingDay: currentDate === event.endDate,
        });
        
        currentDate = getNextDate(currentDate);
      }
    });

    return { transformedEvents, markedDates };
  };

  const { transformedEvents, markedDates } = transformEvents(events);
  
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
      // params: { eventId: event.id, uid: event.uid },
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
            {item.title}
          </Text>
          <Text style={[styles.eventText, themeStyles.textGray]}>
            Responsabil:
            <Text style={[styles.eventText, themeStyles.text]}> {item.responsible}</Text>
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
        markedDates={markedDates}
        markingType={"multi-period"}
        theme={{
          ...themeStyles.calendar,
          'stylesheet.calendar.header': {
            dayTextAtIndex5: {
              color: '#c83030'
            },
            dayTextAtIndex6: {
              color: '#c83030'
            }
          },
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
          // TODO adjust knob Container (currently it cuts off the dates) to account for the multi period marking type or change to period marking type
          // 'stylesheet.agenda.main': {
          //   knobContainer: {
          //     flex: 1,
          //     position: 'absolute',
          //     left: 0,
          //     right: 0,
          //     height: 24,
          //     bottom: 0,
          //     alignItems: 'center',
          //   },
          // },
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
