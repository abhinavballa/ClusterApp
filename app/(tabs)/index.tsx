import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Heart, MessageCircle, Share, Flame, Trophy, X } from 'lucide-react-native';

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
  tasksCompleted?: number;
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
    caption: 'Jordan finished their to-do list for the day, wish them congratulations! 🎉',
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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  const openPostModal = (post: Post) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <View style={styles.streakContainer}>
          <Flame size={16} color="#8B5CF6" />
          <Text style={styles.streakText}>5</Text>
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
            <View key={post.id}>
              {post.type === 'celebration' ? (
                <TouchableOpacity
                  style={styles.celebrationCard}
                  onPress={() => openPostModal(post)}
                  activeOpacity={0.9}
                >
                  <View style={styles.celebrationIcon}>
                    <Trophy size={16} color="#F59E0B" />
                  </View>
                  <Text style={styles.celebrationText}>
                    <Text style={styles.celebrationName}>{post.user.name}</Text> finished their to-do list for the day, wish them congratulations!
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.postCard}
                  onPress={() => openPostModal(post)}
                  activeOpacity={0.95}
                >
                  <View style={styles.postHeader}>
                    <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{post.user.name}</Text>
                      <Text style={styles.taskTitle}>{post.task.title}</Text>
                    </View>
                    <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(post.task.difficulty) }]} />
                  </View>

                  <Image source={{ uri: post.image }} style={styles.postImage} />

                  <View style={styles.captionContainer}>
                    <Text style={styles.caption} numberOfLines={2}>
                      {post.caption}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Post Detail Modal */}
      <Modal
        visible={!!selectedPost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedPost && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closePostModal}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTime}>{selectedPost.time}</Text>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalPostHeader}>
                <Image source={{ uri: selectedPost.user.avatar }} style={styles.modalAvatar} />
                <View style={styles.modalUserInfo}>
                  <Text style={styles.modalUserName}>{selectedPost.user.name}</Text>
                  <Text style={styles.modalUsername}>{selectedPost.user.username}</Text>
                  <View style={styles.modalTaskRow}>
                    <Text style={styles.modalTaskTitle}>{selectedPost.task.title}</Text>
                    <View style={[styles.modalDifficultyBadge, { backgroundColor: getDifficultyColor(selectedPost.task.difficulty) }]}>
                      <Text style={styles.modalDifficultyText}>{selectedPost.task.difficulty}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Image source={{ uri: selectedPost.image }} style={styles.modalImage} />

              <View style={styles.modalFooter}>
                <Text style={styles.modalCaption}>{selectedPost.caption}</Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => toggleLike(selectedPost.id)}
                  >
                    <Heart 
                      size={24} 
                      color={selectedPost.isLiked ? '#EF4444' : '#6B7280'} 
                      fill={selectedPost.isLiked ? '#EF4444' : 'none'}
                    />
                    <Text style={[styles.modalActionText, selectedPost.isLiked && styles.modalLikedText]}>
                      {selectedPost.likes}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.modalActionButton}>
                    <MessageCircle size={24} color="#6B7280" />
                    <Text style={styles.modalActionText}>{selectedPost.comments}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.modalShareButton}>
                    <Share size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.commentsSection}>
                  <Text style={styles.commentsTitle}>Comments</Text>
                  <Text style={styles.commentsPlaceholder}>No comments yet. Be the first to comment!</Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#E8E1D9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    letterSpacing: -0.5,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DADADA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  feedContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: '#E8E1D9',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  celebrationCard: {
    backgroundColor: '#E8E1D9',
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  celebrationIcon: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
  },
  celebrationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    lineHeight: 20,
  },
  celebrationName: {
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    opacity: 0.7,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  postImage: {
    width: '100%',
    height: 240,
  },
  captionContainer: {
    padding: 16,
    paddingTop: 12,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
    lineHeight: 20,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    backgroundColor: '#E8E1D9',
  },
  modalTime: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    opacity: 0.7,
  },
  modalContent: {
    flex: 1,
  },
  modalPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#E8E1D9',
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  modalUserInfo: {
    flex: 1,
  },
  modalUserName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  modalUsername: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    opacity: 0.7,
    marginBottom: 8,
  },
  modalTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTaskTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginRight: 12,
  },
  modalDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalDifficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F5F5F5',
  },
  modalImage: {
    width: '100%',
    height: 320,
  },
  modalFooter: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  modalCaption: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    marginBottom: 20,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
  },
  modalActionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    opacity: 0.7,
    marginLeft: 8,
  },
  modalLikedText: {
    color: '#EF4444',
    opacity: 1,
  },
  modalShareButton: {
    marginLeft: 'auto',
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  commentsPlaceholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
    opacity: 0.5,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});