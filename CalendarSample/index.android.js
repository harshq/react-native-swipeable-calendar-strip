import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Calendar } from './Calendar'

const width = Dimensions.get('window').width;
export default class CalendarSample extends Component {

  constructor() {
    super()
    this.state = {
      selectedDate: new Date().toISOString()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Calendar
          daysInRow={7}
          renderCalendarHeader={(firstVisibleDay) => {
            return (
              <View style={{ height: 50, justifyContent: 'center', backgroundColor: '#1F508A', paddingLeft: 20 }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>{firstVisibleDay.format('MMMM YYYY')}</Text>
              </View>
            )
          } }

          renderCalendarCell={(rowData, sectionID, rowID, onSelectDate) => {
            return (
              <View key={rowData.day.format("DDMMYYYY")} style={{ width: width / 7, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: 'rgba(100,100,100,0.1)' }}>
            <TouchableOpacity underlayColor='#008b8b' style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: rowData.day.isSame(this.state.selectedDate, "day") ?  'rgba(255, 184, 42,.3)' : (rowData.day.isSame(new Date(), "day") ? 'rgba(141, 196, 61,.1)' : null) , alignItems: 'center', paddingBottom: 10 }}
                  onPress={() => { onSelectDate(rowData, sectionID, rowID); this.setState({ selectedDate: rowData.day.toISOString() }) }}
                  >
                  <Text style={{ fontSize: 12, marginBottom: 2, color: 'rgba(0,0,0,0.6)', fontWeight: '400' }}>{rowData.day.format('ddd')}</Text>
                  <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.9)', fontWeight: '400' }}>{rowData.day.format('D')}</Text>
                </TouchableOpacity>
              </View>
            )
          } }
          
          />

  <Text style={{marginTop: 100, fontSize: 18}}>Selected Date : {this.state.selectedDate.substring(0,10)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#f8f8f8'
  }
});

AppRegistry.registerComponent('CalendarSample', () => CalendarSample);
