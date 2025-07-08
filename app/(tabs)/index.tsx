import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Heart, MessageCircle, Share, Flame, CircleCheck as CheckCircle, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  type: 'task' | 'celebration';
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  task: {
    title: string;
    category: string;
    difficulty: 'Small' | 'Medium' | 'Large';
  };
  image: string;
  likes: number;
  comments: number;
  caption: string;
  time: string;
  isLiked: boolean;
  tasksCompleted?: number; // For celebration posts
}

const mockPosts: Post[] = [
  {
    id: '1',
    type: 'task',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      username: '@alexj'
    },
    task: {
      title: 'Morning Run',
      category: 'Fitness',
      difficulty: 'Medium'
    },
    image: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 24,
    comments: 8,
    caption: 'Started my day with a 5K run! The sunrise was incredible today 🌅',
    time: '2h ago',
    isLiked: false
  },
  {
    id: '1.5',
    type: 'celebration',
    user: {
      name: 'Jordan Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      username: '@jordansmith'
    },
    task: {
      title: 'All Tasks Completed',
      category: 'Achievement',
      difficulty: 'Large'
    },
    image: 'https://images.pexels.com/photos/1068523/pexels-photo-1068523.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 47,
    comments: 15,
    caption: '🎉 Jordan finished their to-do list for the day, wish them congratulations!',
    time: '3h ago',
    isLiked: true,
    tasksCompleted: 6
  },
  {
    id: '2',
    type: 'task',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      username: '@sarahc'
    },
    task: {
      title: 'Read 30 pages',
      category: 'Learning',
      difficulty: 'Small'
    },
    image: 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 15,
    comments: 3,
    caption: 'Diving into "Atomic Habits" - loving the insights so far! 📚',
    time: '4h ago',
    isLiked: true
  },
  {
    id: '3',
    type: 'task',
    user: {
      name: 'Marcus Rivera',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      username: '@marcusr'
    },
    task: {
      title: 'Cook dinner',
      category: 'Lifestyle',
      difficulty: 'Large'
    },
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: 32,
    comments: 12,
    caption: 'Homemade pasta night! Nothing beats cooking from scratch 🍝',
    time: '6h ago',
    isLiked: false
  },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState(mockPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Small': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Large': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Today</Text>
          <View style={styles.streakContainer}>
            <Flame size={16} color="#8B5CF6" />
            <Text style={styles.streakText}>5</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.feedContainer}>
          {posts.map((post) => (
            <View key={post.id} style={[
              styles.postCard,
              post.type === 'celebration' && styles.celebrationCard
            ]}>
              {post.type === 'celebration' && (
                <View style={styles.celebrationBanner}>
                  <Trophy size={16} color="#F59E0B" />
                  <Text style={styles.celebrationBannerText}>Perfect Day</Text>
                </View>
              )}

              <View style={styles.postHeader}>
                <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <View style={styles.taskRow}>
                    <Text style={styles.taskTitle}>{post.task.title}</Text>
                    <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(post.task.difficulty) }]} />
                  </View>
                </View>
                <Text style={styles.timeStamp}>{post.time}</Text>
              </View>

              <Image source={{ uri: post.image }} style={styles.postImage} />

              <View style={styles.postFooter}>
                <Text style={styles.caption}>{post.caption}</Text>
                
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Heart 
                      size={18} 
                      color={post.isLiked ? '#EF4444' : '#9CA3AF'} 
                      fill={post.isLiked ? '#EF4444' : 'none'}
                    />
                    <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={18} color="#9CA3AF" />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.shareButton}>
                    <Share size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  feedContainer: {
    paddingVertical: 8,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  celebrationCard: {
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  celebrationBanner: {
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  celebrationBannerText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 8,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timeStamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  postImage: {
    width: '100%',
    height: 280,
  },
  postFooter: {
    padding: 16,
    paddingTop: 12,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginLeft: 6,
  },
  likedText: {
    color: '#EF4444',
  },
  shareButton: {
    marginLeft: 'auto',
  },
});