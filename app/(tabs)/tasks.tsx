import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Plus, SquareCheck as CheckSquare, Square, CreditCard as Edit3, Trash2, Calendar, Clock, Target, Zap } from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  category: string;
  difficulty: 'Small' | 'Medium' | 'Large';
  completed: boolean;
  timeEstimate: string;
  description?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Run',
    category: 'Fitness',
    difficulty: 'Medium',
    completed: false,
    timeEstimate: '30 min',
    description: '5K run around the neighborhood'
  },
  {
    id: '2',
    title: 'Read 30 pages',
    category: 'Learning',
    difficulty: 'Small',
    completed: true,
    timeEstimate: '45 min',
    description: 'Continue reading "Atomic Habits"'
  },
  {
    id: '3',
    title: 'Work on presentation',
    category: 'Work',
    difficulty: 'Large',
    completed: false,
    timeEstimate: '2 hours',
    description: 'Prepare slides for Monday meeting'
  },
  {
    id: '4',
    title: 'Meal prep',
    category: 'Lifestyle',
    difficulty: 'Medium',
    completed: false,
    timeEstimate: '1 hour',
    description: 'Prepare lunches for the week'
  },
];

const categories = ['Fitness', 'Learning', 'Work', 'Lifestyle', 'Creative', 'Social'];
const difficulties = ['Small', 'Medium', 'Large'];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(mockTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: categories[0],
    difficulty: difficulties[0] as 'Small' | 'Medium' | 'Large',
    timeEstimate: '',
    description: ''
  });
  const [canAddTasks, setCanAddTasks] = useState(true);

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Check if all tasks are now completed
    const allCompleted = updatedTasks.every(task => task.completed);
    const wasAllCompleted = tasks.every(task => task.completed);
    
    if (allCompleted && !wasAllCompleted && updatedTasks.length > 0) {
      // User just completed all tasks - create celebration post
      createCelebrationPost();
    }

    // Check if any task is completed today (simulating the rule)
    const hasCompletedTask = updatedTasks.some(task => task.completed);
    if (hasCompletedTask) {
      setCanAddTasks(false);
    }
  };

  const createCelebrationPost = () => {
    // In a real app, this would make an API call to create the celebration post
    Alert.alert(
      '🎉 Congratulations!',
      'You\'ve completed all your tasks for today! Your achievement has been shared with your friends.',
      [{ text: 'Amazing!', style: 'default' }]
    );
  };

  const addTask = () => {
    if (!canAddTasks) {
      Alert.alert(
        'Cannot Add Tasks',
        'You\'ve completed a task today! Plan your tasks the day before.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (newTask.title.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category,
      difficulty: newTask.difficulty,
      completed: false,
      timeEstimate: newTask.timeEstimate || '30 min',
      description: newTask.description
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      category: categories[0],
      difficulty: difficulties[0] as 'Small' | 'Medium' | 'Large',
      timeEstimate: '',
      description: ''
    });
    setShowAddModal(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Small': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Large': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fitness': return <Zap size={16} color="#8B5CF6" />;
      case 'Learning': return <Target size={16} color="#8B5CF6" />;
      case 'Work': return <Edit3 size={16} color="#8B5CF6" />;
      default: return <Calendar size={16} color="#8B5CF6" />;
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Today's Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {completedTasks} of {totalTasks} completed
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.tasksContainer}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => toggleTask(task.id)}
                >
                  {task.completed ? (
                    <CheckSquare size={24} color="#10B981" />
                  ) : (
                    <Square size={24} color="#6B7280" />
                  )}
                </TouchableOpacity>
                <View style={styles.taskInfo}>
                  <Text style={[
                    styles.taskTitle,
                    task.completed && styles.completedTask
                  ]}>
                    {task.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View style={styles.categoryContainer}>
                      {getCategoryIcon(task.category)}
                      <Text style={styles.categoryText}>{task.category}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.timeText}>{task.timeEstimate}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.taskActions}>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(task.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>{task.difficulty}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteTask(task.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              {task.description && (
                <Text style={styles.taskDescription}>{task.description}</Text>
              )}
            </View>
          ))}
        </View>

        {!canAddTasks && (
          <View style={styles.restrictionNotice}>
            <Text style={styles.restrictionText}>
              🎯 You've completed a task today! Plan tomorrow's tasks tonight.
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.addButton,
          !canAddTasks && styles.addButtonDisabled
        ]}
        onPress={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TouchableOpacity onPress={addTask}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Task Title</Text>
              <TextInput
                style={styles.textInput}
                value={newTask.title}
                onChangeText={(text) => setNewTask({...newTask, title: text})}
                placeholder="Enter task title..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categorySelector}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newTask.category === category && styles.categoryOptionSelected
                      ]}
                      onPress={() => setNewTask({...newTask, category})}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newTask.category === category && styles.categoryOptionTextSelected
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Difficulty</Text>
              <View style={styles.difficultySelector}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.difficultyOption,
                      { backgroundColor: getDifficultyColor(difficulty) },
                      newTask.difficulty === difficulty && styles.difficultyOptionSelected
                    ]}
                    onPress={() => setNewTask({...newTask, difficulty: difficulty as 'Small' | 'Medium' | 'Large'})}
                  >
                    <Text style={styles.difficultyOptionText}>{difficulty}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time Estimate</Text>
              <TextInput
                style={styles.textInput}
                value={newTask.timeEstimate}
                onChangeText={(text) => setNewTask({...newTask, timeEstimate: text})}
                placeholder="e.g., 30 min, 2 hours"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newTask.description}
                onChangeText={(text) => setNewTask({...newTask, description: text})}
                placeholder="Add more details..."
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  tasksContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
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
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  taskActions: {
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  deleteButton: {
    padding: 4,
  },
  taskDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    marginLeft: 36,
    lineHeight: 20,
  },
  restrictionNotice: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  restrictionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#D97706',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  modalSave: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  categoryOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    opacity: 0.7,
  },
  difficultyOptionSelected: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  difficultyOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});