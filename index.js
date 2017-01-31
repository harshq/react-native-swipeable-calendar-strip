import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';
import moment from 'moment';

const width = Dimensions.get('window').width;
export class Calendar extends Component {
    constructor() {
        super()
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            ds: ds,
            loadedDays: [],
            firstVisibleDay: moment()
        }
        this.onSelectDate = this.onSelectDate.bind(this)
    }

    componentDidMount() {
        this.setState({
            ds: this.state.ds.cloneWithRows([...this.getInitialDates()]),
        })

        Platform.OS === 'ios' ? this._calendar.scrollTo({ x: width * 2, y: 0, animated: false }) : setTimeout(() => {
            this._calendar.scrollTo({ x: width * 2, y: 0, animated: false })
        }, 100)
    }

    getInitialDates() {
        const firstDay = moment().subtract(Math.round(this.props.daysInRow * 2 + this.props.daysInRow / 2), 'd');
        let days = [];
        for (let i = 1; i < this.props.daysInRow * 5; i++) {
            days.push({ day: moment(firstDay).add(i, 'days') });
        }
        this.setState({
            loadedDays: [...days]
        });
        return days;
    }

    loadNextWeek(nextDay) {
        let days = [];
        for (let i = 1; i <= this.props.daysInRow; i++) {
            days.push({ day: nextDay.day.clone().add(i, 'days') });
        }
        this.setState({
            ds: this.state.ds.cloneWithRows([...this.state.loadedDays, ...days]),
            loadedDays: [...this.state.loadedDays, ...days]
        });
    }

    loadPreviousWeek(nextDay) {
        let days = [];
        for (let i = this.props.daysInRow; i >= 1; i--) {
            days.push({ day: nextDay.day.clone().subtract(i, 'days') });
        }

        this.setState(() => {
            return {
                ds: this.state.ds.cloneWithRows([...days, ...this.state.loadedDays]),
                loadedDays: [...days, ...this.state.loadedDays]
            }
        },
            () => {
                this._calendar.scrollTo({ x: width * 2, y: 0, animated: false })
            });
    }

    onSelectDate(rowData, sectionID, rowID) {
        // _loadedDates = [...this.state.loadedDays]
        // this.setState({
        //     ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows([...this.state.loadedDays]),
        // })
    }


    render() {
        return (
            <View style={styles.container}>
                {this.props.renderCalendarHeader(this.state.firstVisibleDay)}
                <ListView
                    ref={calendar => this._calendar = calendar}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    automaticallyAdjustContentInsets
                    onMomentumScrollEnd={(event) => this.scrollEnded(event)}
                    scrollEventThrottle={500}
                    onChangeVisibleRows={(event) => { this.onChangeVisibleRows(event) } }
                    onEndReached={() => { this.onEndReached() } }
                    onEndReachedThreshold={width}
                    dataSource={this.state.ds}
                    renderRow={this.props.renderCalendarCell}
                    />
            </View>
        );
    }

    scrollEnded(event) {
        //console.log(event.nativeEvent.contentOffset.x);
        if (event.nativeEvent.contentOffset.x <= width) {
            this.loadPreviousWeek(this.state.loadedDays[0]);
        }
    }

    onEndReached() {
        const lastDayInList = this.state.loadedDays[this.state.loadedDays.length - 1];
        this.loadNextWeek(lastDayInList);
    }

    onChangeVisibleRows(event) {
        const firstVisibleRowId = Number(Object.keys(event.s1)[0]) + 1;
        this.setState({
            firstVisibleDay: this.state.loadedDays[firstVisibleRowId].day
        })
    }
}

const styles = StyleSheet.create({
    container: {
        height: 110
    }
});
