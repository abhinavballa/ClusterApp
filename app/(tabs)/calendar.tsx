import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CircleCheck as CheckCircle, Circle, Target, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CalendarDay {
  date: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  tasksCompleted: number;
  totalTasks: number;
  isPerfectDay: boolean;
}

interface MonthData {
  month: string;
  year: number;
  days: CalendarDay[];
}

const mockMonthData: MonthData = {
  month: 'January',
  year: 2025,
  days: [
    // Previous month days
    { date: 29, isToday: false, isCurrentMonth: false, tasksCompleted: 0, totalTasks: 0, isPerfectDay: false },
    { date: 30, isToday: false, isCurrentMonth: false, tasksCompleted: 0, totalTasks: 0, isPerfectDay: false },
    { date: 31, isToday: false, isCurrentMonth: false, tasksCompleted: 0, totalTasks: 0, isPerfectDay: false },
    
    // Current month days
    { date: 1, isToday: false, isCurrentMonth: true, tasksCompleted: 4, totalTasks: 4, isPerfectDay: true },
    { date: 2, isToday: false, isCurrentMonth: true, tasksCompleted: 3, totalTasks: 5, isPerfectDay: false },
    { date: 3, isToday: false, isCurrentMonth: true, tasksCompleted: 5, totalTasks: 5, isPerfectDay: true },
    { date: 4, isToday: false, isCurrentMonth: true, tasksCompleted: 2, totalTasks: 4, isPerfectDay: false },
    { date: 5, isToday: false, isCurrentMonth: true, tasksCompleted: 6, totalTasks: 6, isPerfectDay: true },
    { date: 6, isToday: false, isCurrentMonth: true, tasksCompleted: 4, totalTasks: 4, isPerfectDay: true },
    { date: 7, isToday: false, isCurrentMonth: true, tasksCompleted: 3, totalTasks: 5, isPerfectDay: false },
    { date: 8, isToday: false, isCurrentMonth: true, tasksCompleted: 5, totalTasks: 5, isPerfectDay: true },
    { date: 9, isToday: false, isCurrentMonth: true, tasksCompleted: 4, totalTasks: 4, isPerfectDay: true },
    { date: 10, isToday: false, isCurrentMonth: true, tasksCompleted: 3, totalTasks: 6, isPerfectDay: false },
    { date: 11, isToday: false, isCurrentMonth: true, tasksCompleted: 5, totalTasks: 5, isPerfectDay: true },
    { date: 12, isToday: false, isCurrentMonth: true, tasksCompleted: 4, totalTasks: 4, isPerfectDay: true },
    { date: 13, isToday: false, isCurrentMonth: true, tasksCompleted: 6, totalTasks: 6, isPerfectDay: true },
    { date: 14, isToday: false, isCurrentMonth: true, tasksCompleted: 3, totalTasks: 5, isPerfectDay: false },
    { date: 15, isToday: true, isCurrentMonth: true, tasksCompleted: 2, totalTasks: 4, isPerfectDay: false },
    
    // Future days (no data)
    ...Array.from({ length: 16 }, (_, i) => ({
      date: i + 16,
      isToday: false,
      isCurrentMonth: true,
      tasksCompleted: 0,
      totalTasks: 0,
      isPerfectDay: false
    })),
    
    // Next month days
    { date: 1, isToday: false, isCurrentMonth: false, tasksCompleted: 0, totalTasks: 0, isPerfectDay: false },
    { date: 2, isToday: false, isCurrentMonth: false, tasksCompleted: 0, totalTasks: 0, isPerfectDay: false },
  ]
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(mockMonthData);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const perfectDays = currentMonth.days.filter(day => day.isPerfectDay && day.isCurrentMonth).length;
  const totalActiveDays = currentMonth.days.filter(day => day.totalTasks > 0 && day.isCurrentMonth).length;
  const completionRate = totalActiveDays > 0 ? Math.round((perfectDays / totalActiveDays) * 100) : 0;

  const getDayColor = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return '#F3F4F6';
    if (day.isToday) return '#8B5CF6';
    if (day.isPerfectDay) return '#10B981';
    if (day.totalTasks > 0) return '#F59E0B';
    return '#E5E7EB';
  };

  const getDayTextColor = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return '#9CA3AF';
    if (day.isToday || day.isPerfectDay) return '#FFFFFF';
    if (day.totalTasks > 0) return '#FFFFFF';
    return '#6B7280';
  };

  const getCompletionPercentage = (day: CalendarDay) => {
    if (day.totalTasks === 0) return 0;
    return (day.tasksCompleted / day.totalTasks) * 100;
  };

  const renderCalendarGrid = () => {
    const weeks = [];
    for (let i = 0; i < currentMonth.days.length; i += 7) {
      weeks.push(currentMonth.days.slice(i, i + 7));
    }

    return weeks.map((week, weekIndex) => (
      <View key={weekIndex} style={styles.weekRow}>
        {week.map((day, dayIndex) => (
          <TouchableOpacity
            key={dayIndex}
            style={[
              styles.dayCell,
              { backgroundColor: getDayColor(day) }
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[
              styles.dayText,
              { color: getDayTextColor(day) }
            ]}>
              {day.date}
            </Text>
            {day.totalTasks > 0 && day.isCurrentMonth && (
              <View style={styles.progressIndicator}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${getCompletionPercentage(day)}%` }
                  ]} 
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.monthSelector}>
            <TouchableOpacity style={styles.monthButton}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {currentMonth.month} {currentMonth.year}
            </Text>
            <TouchableOpacity style={styles.monthButton}>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{perfectDays}</Text>
              <Text style={styles.statLabel}>Perfect Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.calendarContainer}>
          <View style={styles.weekHeader}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {renderCalendarGrid()}
          </View>
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Perfect Day (100%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Partial Progress</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#E5E7EB' }]} />
              <Text style={styles.legendText}>No Tasks</Text>
            </View>
          </View>
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>This Month's Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <TrendingUp size={24} color="#10B981" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Best Streak</Text>
              <Text style={styles.insightValue}>7 days</Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Target size={24} color="#8B5CF6" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Most Productive Day</Text>
              <Text style={styles.insightValue}>Monday</Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <CheckCircle size={24} color="#F59E0B" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Total Tasks Completed</Text>
              <Text style={styles.insightValue}>127</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {selectedDay && (
        <View style={styles.dayDetailModal}>
          <View style={styles.dayDetailContent}>
            <Text style={styles.dayDetailTitle}>
              {currentMonth.month} {selectedDay.date}, {currentMonth.year}
            </Text>
            <View style={styles.dayDetailStats}>
              <View style={styles.dayDetailStat}>
                <Text style={styles.dayDetailStatNumber}>{selectedDay.tasksCompleted}</Text>
                <Text style={styles.dayDetailStatLabel}>Completed</Text>
              </View>
              <View style={styles.dayDetailStat}>
                <Text style={styles.dayDetailStatNumber}>{selectedDay.totalTasks}</Text>
                <Text style={styles.dayDetailStatLabel}>Total</Text>
              </View>
              <View style={styles.dayDetailStat}>
                <Text style={styles.dayDetailStatNumber}>
                  {selectedDay.totalTasks > 0 ? Math.round(getCompletionPercentage(selectedDay)) : 0}%
                </Text>
                <Text style={styles.dayDetailStatLabel}>Success</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeDetailButton}
              onPress={() => setSelectedDay(null)}
            >
              <Text style={styles.closeDetailText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    gap: 20,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekDayText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
    width: (width - 64) / 7,
  },
  calendarGrid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayCell: {
    width: (width - 64) / 7 - 4,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  legendContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  insightsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  insightValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 2,
  },
  dayDetailModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dayDetailContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  dayDetailTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  dayDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayDetailStat: {
    alignItems: 'center',
  },
  dayDetailStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  dayDetailStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  closeDetailButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeDetailText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});