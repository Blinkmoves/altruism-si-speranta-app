// TODO Sara

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { themeStyles } from '../styles/themeStyles';
import useThemeStyles from "../hooks/useThemeStyles";
import { useThemeContext } from '../hooks/useThemeContext';
import globalStyles from '../styles/globalStyles';
import { Calendar } from 'react-native-calendars';

const EventShowPage = () => {

  const events = [
    {
      id: '1',
      title: 'Multi-Day Event 1',
      startDate: '2024-12-10',
      endDate: '2024-12-12',
      color: '#50cebb',
      responsiblePerson: ['Sara Cosarba', 'Ion Popescu'],
      description: 'Evenimentul va avea loc in Bucuresti, incepand cu ora 10:00.',
      voluntari: ['Maria Ionescu'],
    }
  ];

  // Access the first event from the array
  const event = events[0];

  const { themeStyles, colors } = useThemeStyles();

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