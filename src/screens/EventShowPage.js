import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { db } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { auth } from '../services/firebaseConfig';
import globalStyles from '../styles/globalStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, CommonActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useThemeStyles from '../hooks/useThemeStyles';
import { Calendar } from 'react-native-calendars';

const EventShowPage = ({ route }) => {

  const { themeStyles, colors } = useThemeStyles();

  const { eventId, uid } = route.params;

  const [event, setEvent] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {

    if (!eventId) {
      console.warn('Missing eventId in route params.');
      return;
    }
    if (!uid) {
      console.warn('Missing uid in route params.');
      return;
    }

    const eventRef = ref(db, `events/${uid}/${eventId}`);
    const unsubscribe = onValue(eventRef, (snapshot) => {
      const data = snapshot.val();
      setEvent(data);

      // Prepare markedDates for the Calendar
      if (data) {
        const { startDate, endDate, color } = data;
        const marked = {};
        let start = new Date(startDate);
        const end = new Date(endDate);

        while (start <= end) {
          const dateKey = start.toISOString().split('T')[0];

          // Initialize periods array for this date if it doesn't exist
          if (!marked[dateKey]) {
            marked[dateKey] = {
              periods: []
            };
          }

          marked[dateKey].periods.push({
            startingDay: dateKey === startDate.split('T')[0],
            endingDay: dateKey === endDate.split('T')[0],
            color: color || '#093A3E', // Fallback color if none provided
          });

          start.setDate(start.getDate() + 1);
        }

        setMarkedDates(marked);
      } else {
        setError('Evenimentul nu a fost găsit.');
      }
      setLoading(false); // Set loading to false after data is fetched
    }, (err) => {
      setError('Eroare la încărcarea datelor.');
      setLoading(false);
      console.error(err);
    });

    return () => unsubscribe();
  }, [eventId, uid]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#093A3E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, themeStyles.container]}>
        <Text style={[styles.errorText, themeStyles.text]}>{error}</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  // Navigate to EditEventPage
  const handleEditEvent = (eventId, uid) => {
    navigation.navigate('EditEventPage', {
      eventId,
      uid,
    });
  };

  const goToEventsPage = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'AuthenticatedStack',
            state: {
              routes: [
                {
                  name: 'Evenimente',
                  state: {
                    routes: [
                      {
                        name: 'EventsPage',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      })
    );
  };

  // TODO add other info about the event such as name

  return (
    <ScrollView
      style={[globalStyles.container, themeStyles.container]}>
      <Text style={[globalStyles.title, themeStyles.text, { marginBottom: 30 }]}>{event.name}</Text>
      <Calendar
        firstDay={1}
        markedDates={markedDates}
        markingType={"multi-period"}
        theme={themeStyles.calendar}
        hideArrows={true}
      />
      <View style={[themeStyles.container]}>
        {/* Event Description */}
        <View style={styles.row}>
          <View style={styles.eventDetails}>
            <Text style={[styles.label, themeStyles.textGray]}>
              Descriere:
            </Text>
            <Text style={[styles.value, themeStyles.text]}>
              {event.description || 'Fără descriere'}
            </Text>
          </View>
        </View>


        {/* Responsible Person */}
        <View style={styles.row}>
          <View style={styles.eventDetails}>
            <Text style={[styles.label, themeStyles.textGray]}>
              Responsabil:
            </Text>
            <Text style={[styles.value, themeStyles.text]}>
              {event.responsiblePerson}
            </Text>
          </View>
        </View>
      </View>
      {/* Tags */}
      {/* {event.responsible && event.responsible.length > 0 && ( */}
      <View style={styles.row}>
        <View style={styles.eventDetails}>
          <Text style={[styles.label, themeStyles.textGray]}>Voluntari:</Text>
          <View style={styles.chipContainer}>
            {/* {event.responsible.map((tag, index) => ( */}
            <View style={[styles.chip, themeStyles.chip]}>
              <Text style={[styles.chipText, themeStyles.buttonText]}>
                {event.volunteers}
              </Text>
            </View>
            {/* ))} */}
          </View>
        </View>
      </View>
      {/* )} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  eventDetails: {
    flex: 1,
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  chip: {
    backgroundColor: '#976E9E',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 4,
    marginTop: 4,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
  },
  eventText: {
    fontSize: 24,
  },
});

export default EventShowPage;