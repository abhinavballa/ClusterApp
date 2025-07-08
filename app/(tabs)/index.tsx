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
import { Heart, MessageCircle, Share, MoveHorizontal as MoreHorizontal, Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
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
}

const mockPosts: Post[] = [
  {
    id: '1',
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
    id: '2',
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
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Today's Feed</Text>
          <View style={styles.streakContainer}>
            <Flame size={20} color="#FFF" />
            <Text style={styles.streakText}>5</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <Text style={styles.userHandle}>{post.user.username}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <MoreHorizontal size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.taskInfo}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{post.task.title}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(post.task.difficulty) }]}>
                  <Text style={styles.difficultyText}>{post.task.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.taskCategory}>{post.task.category}</Text>
            </View>

            <Image source={{ uri: post.image }} style={styles.postImage} />

            <View style={styles.postActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleLike(post.id)}
              >
                <Heart 
                  size={24} 
                  color={post.isLiked ? '#EF4444' : '#6B7280'} 
                  fill={post.isLiked ? '#EF4444' : 'none'}
                />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={24} color="#6B7280" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.postContent}>
              <Text style={styles.caption}>{post.caption}</Text>
              <Text style={styles.timeStamp}>{post.time}</Text>
            </View>
          </View>
        ))}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  userHandle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  taskInfo: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  taskCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  timeStamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});