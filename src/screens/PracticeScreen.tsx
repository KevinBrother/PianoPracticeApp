import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import StaffRenderer from "../components/Staff/StaffRenderer";
import PianoKeyboard from "../components/PianoKeyboard/PianoKeyboard";
import { usePracticeStore } from "../store/practiceStore";
import { generateSimpleSheet } from "../utils/musicUtils";
import AudioManager from "../services/AudioManager";

const PracticeScreen: React.FC = () => {
  const {
    currentSheet,
    currentNoteIndex,
    noteStates,
    stats,
    feedbackMessage,
    showFeedback,
    setCurrentSheet,
    handleNoteInput,
    resetPractice,
  } = usePracticeStore();

  const feedbackOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 初始化音频
    AudioManager.initialize();

    // 加载练习乐谱
    const sheet = generateSimpleSheet();
    setCurrentSheet(sheet);

    return () => {
      AudioManager.cleanup();
    };
  }, []);

  useEffect(() => {
    // 反馈动画
    if (showFeedback) {
      Animated.sequence([
        Animated.timing(feedbackOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showFeedback]);

  const handleKeyPress = (note: string, octave: number) => {
    handleNoteInput(note, octave);
  };

  const handleReset = () => {
    resetPractice();
  };

  const allNotes = currentSheet?.measures.flatMap((m) => m.notes) || [];
  const progress =
    allNotes.length > 0 ? (currentNoteIndex / allNotes.length) * 100 : 0;
  const accuracy =
    stats.correctCount + stats.incorrectCount > 0
      ? (stats.correctCount / (stats.correctCount + stats.incorrectCount)) * 100
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.title}>钢琴练习</Text>
        <Text style={styles.subtitle}>
          {currentSheet?.title || "加载中..."}
        </Text>
      </View>

      {/* 统计信息 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.correctCount}</Text>
          <Text style={styles.statLabel}>正确</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.incorrectCount}</Text>
          <Text style={styles.statLabel}>错误</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{accuracy.toFixed(0)}%</Text>
          <Text style={styles.statLabel}>准确率</Text>
        </View>
      </View>

      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentNoteIndex} / {allNotes.length}
        </Text>
      </View>

      {/* 五线谱 */}
      <View style={styles.staffContainer}>
        {currentSheet && (
          <StaffRenderer
            notes={allNotes}
            noteStates={noteStates}
            clef={currentSheet.config.clef}
            highlightIndex={currentNoteIndex}
          />
        )}
      </View>

      {/* 反馈消息 */}
      {showFeedback && (
        <Animated.View
          style={[styles.feedbackContainer, { opacity: feedbackOpacity }]}
        >
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </Animated.View>
      )}

      {/* 控制按钮 */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>重新开始</Text>
        </TouchableOpacity>
      </View>

      {/* 钢琴键盘 */}
      <PianoKeyboard onNotePress={handleKeyPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 1,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  progressContainer: {
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  staffContainer: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  feedbackContainer: {
    position: "absolute",
    top: "45%",
    left: "10%",
    right: "10%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 1000,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  controlsContainer: {
    padding: 15,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PracticeScreen;
