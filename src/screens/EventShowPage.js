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

// TODO finish this

const EventShowPage = (route) => {

  const { themeStyles, colors } = useThemeStyles();

  const { eventId } = route.params;

  const [event, setEvent] = useState({});
  const [transformedEvents, setTransformedEvents] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const navigation = useNavigation();

  // Get user ID from Firebase Auth
  const uid = auth.currentUser.uid;

  useEffect(() => {
    const eventRef = ref(db, `events/${uid}/${eventId}`);
    const unsubscribe = onValue(taskRef, (snapshot) => {
      const data = snapshot.val();
      setTask(data);
    });

    return () => unsubscribe();
  }, [eventId, uid]);

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#093A3E" />
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

  return (
    <ScrollView
      style={[globalStyles.container, themeStyles.container]}>
      <Calendar
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
        }}
        showClosingKnob={true}
        showOnlySelectedDayItems={true}
        showScrollIndicator={true}
        animateScroll={true}
        headerStyle={colors.teal}

        current={`${selectedMonthYear.year}-${String(selectedMonthYear.month + 1).padStart(2, '0')}-01`}
      />
      <View style={[themeStyles.container]}>
        {/* Event Description */}
        <View style={styles.row}>
          <View style={styles.eventDetails}>
            <Text style={[styles.label, themeStyles.textGray]}>
              Descriere:
            </Text>
            <Text style={[styles.value, themeStyles.text]}>
              {event.description}
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
          <Text style={[styles.label, themeStyles.textGray]}>Tag-uri:</Text>
          <View style={styles.chipContainer}>
            {/* {event.responsible.map((tag, index) => ( */}
            <View style={[styles.chip, themeStyles.chip]}>
              <Text style={[styles.chipText, themeStyles.buttonText]}>
                {event.voluntari}
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