import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  TextInput,
  ScrollView,
  Modal,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { 
  Camera, 
  RotateCcw, 
  X, 
  Check, 
  Upload,
  Award,
  Zap
} from 'lucide-react-native';

interface CompletedTask {
  id: string;
  title: string;
  category: string;
  difficulty: 'Small' | 'Medium' | 'Large';
}

const mockCompletedTasks: CompletedTask[] = [
  {
    id: '1',
    title: 'Morning Run',
    category: 'Fitness',
    difficulty: 'Medium'
  },
  {
    id: '2',
    title: 'Work on presentation',
    category: 'Work',
    difficulty: 'Large'
  },
  {
    id: '3',
    title: 'Meal prep',
    category: 'Lifestyle',
    difficulty: 'Medium'
  }
];

export default function CaptureScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<CompletedTask | null>(null);
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={80} color="#8B5CF6" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to let you capture photos of your completed tasks.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo?.uri || null);
        setShowCamera(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const startCapture = (task: CompletedTask) => {
    setSelectedTask(task);
    setShowCamera(true);
  };

  const postToFeed = async () => {
    if (!selectedTask || !capturedImage) return;

    setIsPosting(true);
    
    // Simulate posting to feed
    setTimeout(() => {
      setIsPosting(false);
      setCapturedImage(null);
      setSelectedTask(null);
      setCaption('');
      Alert.alert('Success!', 'Your task completion has been posted to your feed! 🎉');
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Small': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Large': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case 'Small': return 10;
      case 'Medium': return 25;
      case 'Large': return 50;
      default: return 0;
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowCamera(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.taskOverlay}>
              <Text style={styles.taskOverlayText}>
                Capturing: {selectedTask?.title}
              </Text>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(selectedTask?.difficulty || '') }
              ]}>
                <Text style={styles.difficultyText}>
                  {selectedTask?.difficulty} • {getDifficultyPoints(selectedTask?.difficulty || '')} pts
                </Text>
              </View>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.flipButton} 
                onPress={toggleCameraFacing}
              >
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <View style={styles.flipButton} />
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Capture Progress</Text>
        <Text style={styles.headerSubtitle}>
          Share your task completions with friends
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Completed Tasks</Text>
          <Text style={styles.sectionSubtitle}>
            Capture photos of your completed tasks to share with friends
          </Text>
          
          {mockCompletedTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => startCapture(task)}
            >
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.taskMeta}>
                  <Text style={styles.categoryText}>{task.category}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(task.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>
                      {task.difficulty} • {getDifficultyPoints(task.difficulty)} pts
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.taskAction}>
                <Camera size={24} color="#8B5CF6" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Today's Achievements</Text>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Award size={24} color="#F59E0B" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Streak Master</Text>
              <Text style={styles.achievementText}>5 days in a row! 🔥</Text>
            </View>
          </View>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Zap size={24} color="#10B981" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Points Earned</Text>
              <Text style={styles.achievementText}>85 points today</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={!!capturedImage}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity 
              onPress={() => {
                setCapturedImage(null);
                setCaption('');
              }}
            >
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>Share Progress</Text>
            <TouchableOpacity 
              onPress={postToFeed}
              disabled={isPosting}
            >
              <Text style={[
                styles.shareButton,
                isPosting && styles.shareButtonDisabled
              ]}>
                {isPosting ? 'Posting...' : 'Share'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.previewContent}>
            {capturedImage && (
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
            )}
            
            {selectedTask && (
              <View style={styles.taskPreview}>
                <Text style={styles.taskPreviewTitle}>{selectedTask.title}</Text>
                <View style={styles.taskPreviewMeta}>
                  <Text style={styles.categoryText}>{selectedTask.category}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(selectedTask.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>
                      {selectedTask.difficulty} • {getDifficultyPoints(selectedTask.difficulty)} pts
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.captionContainer}>
              <Text style={styles.captionLabel}>Caption</Text>
              <TextInput
                style={styles.captionInput}
                value={caption}
                onChangeText={setCaption}
                placeholder="Share your thoughts about completing this task..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  tasksContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
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
  taskAction: {
    marginLeft: 12,
  },
  achievementsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'flex-end',
  },
  taskOverlayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  shareButton: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  shareButtonDisabled: {
    color: '#9CA3AF',
  },
  previewContent: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 400,
  },
  taskPreview: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  taskPreviewTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  taskPreviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captionContainer: {
    padding: 20,
  },
  captionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
});