import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { 
  User, 
  Settings, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Target,
  Zap,
  Award,
  Users,
  Heart,
  Brain,
  Clock,
  Activity
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

interface InsightCard {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Streak Master',
    description: 'Complete tasks for 7 days straight',
    icon: 'fire',
    color: '#EF4444',
    unlocked: true
  },
  {
    id: '2',
    title: 'Fitness Fanatic',
    description: 'Complete 50 fitness tasks',
    icon: 'dumbbell',
    color: '#10B981',
    unlocked: true
  },
  {
    id: '3',
    title: 'Learning Legend',
    description: 'Complete 100 learning tasks',
    icon: 'book',
    color: '#3B82F6',
    unlocked: false
  },
  {
    id: '4',
    title: 'Social Star',
    description: 'Get 100 likes on your posts',
    icon: 'heart',
    color: '#EC4899',
    unlocked: true
  }
];

const taskDNAInsights: InsightCard[] = [
  {
    title: 'Peak Performance',
    value: '9:00 AM',
    description: 'You\'re most productive in the morning',
    icon: <Clock size={24} color="#F59E0B" />,
    color: '#FEF3C7'
  },
  {
    title: 'Favorite Category',
    value: 'Fitness',
    description: 'Your top completed category this month',
    icon: <Activity size={24} color="#10B981" />,
    color: '#D1FAE5'
  },
  {
    title: 'Consistency Score',
    value: '85%',
    description: 'Above average task completion rate',
    icon: <TrendingUp size={24} color="#8B5CF6" />,
    color: '#EDE9FE'
  },
  {
    title: 'Challenge Level',
    value: 'Medium',
    description: 'You prefer balanced difficulty tasks',
    icon: <Target size={24} color="#3B82F6" />,
    color: '#DBEAFE'
  }
];

export default function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'insights'>('overview');

  const renderAchievements = () => (
    <View style={styles.achievementsGrid}>
      {mockAchievements.map((achievement) => (
        <View 
          key={achievement.id} 
          style={[
            styles.achievementCard,
            achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
          ]}
        >
          <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
            <Trophy size={24} color="#FFFFFF" />
          </View>
          <Text style={[
            styles.achievementTitle,
            !achievement.unlocked && styles.lockedText
          ]}>
            {achievement.title}
          </Text>
          <Text style={[
            styles.achievementDescription,
            !achievement.unlocked && styles.lockedText
          ]}>
            {achievement.description}
          </Text>
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Award size={16} color="#10B981" />
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Your Task DNA 🧬</Text>
      <Text style={styles.sectionSubtitle}>
        AI-powered insights about your productivity patterns
      </Text>
      
      <View style={styles.insightCards}>
        {taskDNAInsights.map((insight, index) => (
          <View key={index} style={[styles.insightCard, { backgroundColor: insight.color }]}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                {insight.icon}
              </View>
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightValue}>{insight.value}</Text>
            <Text style={styles.insightDescription}>{insight.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.monthlyWrapContainer}>
        <Text style={styles.sectionTitle}>Monthly Wrap 📊</Text>
        <View style={styles.wrapCard}>
          <Text style={styles.wrapTitle}>December 2024 Highlights</Text>
          <View style={styles.wrapStats}>
            <View style={styles.wrapStat}>
              <Text style={styles.wrapStatValue}>Sarah</Text>
              <Text style={styles.wrapStatLabel}>Most Active Friend</Text>
            </View>
            <View style={styles.wrapStat}>
              <Text style={styles.wrapStatValue}>Alex</Text>
              <Text style={styles.wrapStatLabel}>Fitness Champion</Text>
            </View>
            <View style={styles.wrapStat}>
              <Text style={styles.wrapStatValue}>Marcus</Text>
              <Text style={styles.wrapStatLabel}>Cooking Master</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Calendar size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.statValue}>23</Text>
          <Text style={styles.statLabel}>Perfect Days</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Target size={24} color="#10B981" />
          </View>
          <Text style={styles.statValue}>347</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Zap size={24} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>1,250</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Users size={24} color="#EC4899" />
          </View>
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      <View style={styles.categoryBreakdown}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        <View style={styles.categoryList}>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: '#10B981' }]} />
            <Text style={styles.categoryName}>Fitness</Text>
            <Text style={styles.categoryCount}>89 tasks</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.categoryName}>Learning</Text>
            <Text style={styles.categoryCount}>67 tasks</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.categoryName}>Work</Text>
            <Text style={styles.categoryCount}>112 tasks</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.categoryName}>Lifestyle</Text>
            <Text style={styles.categoryCount}>79 tasks</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
              style={styles.avatar}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>Jordan Smith</Text>
              <Text style={styles.profileUsername}>@jordansmith</Text>
              <View style={styles.followStats}>
                <Text style={styles.followStat}>125 Following</Text>
                <Text style={styles.followStat}>• 342 Followers</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'achievements' && styles.activeTab]}
          onPress={() => setSelectedTab('achievements')}
        >
          <Text style={[styles.tabText, selectedTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'insights' && styles.activeTab]}
          onPress={() => setSelectedTab('insights')}
        >
          <Text style={[styles.tabText, selectedTab === 'insights' && styles.activeTabText]}>
            Insights
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'achievements' && renderAchievements()}
        {selectedTab === 'insights' && renderInsights()}
      </ScrollView>
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
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileDetails: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  profileUsername: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  followStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  followStat: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  overviewContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 44) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryBreakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 44) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  achievementUnlocked: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 4,
  },
  insightsContainer: {
    padding: 16,
  },
  insightCards: {
    gap: 12,
    marginBottom: 24,
  },
  insightCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIconContainer: {
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  insightValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  monthlyWrapContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wrapCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  wrapTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  wrapStats: {
    gap: 12,
  },
  wrapStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  wrapStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  wrapStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});