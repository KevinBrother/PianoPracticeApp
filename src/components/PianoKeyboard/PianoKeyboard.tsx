import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import { generatePianoKeys } from "../../utils/musicUtils";
import { PianoKey } from "../../types/music.types";

interface PianoKeyboardProps {
  onNotePress: (note: string, octave: number) => void;
}

// 根据音符和八度返回显示名称（传统记谱法）
const getNoteName = (note: string, octave: number): string => {
  // 传统音名标记系统映射：
  // 科学记谱 octave 0 (A0, B0) = 传统记谱 A2, B2 (大字二组)
  // 科学记谱 octave 1 (C1-B1) = 传统记谱 C1-B1 (大字一组)
  // 科学记谱 octave 2 (C2-B2) = 传统记谱 C-B (大字组)
  // 科学记谱 octave 3 (C3-B3) = 传统记谱 c-b (小字组)
  // 科学记谱 octave 4 (C4-B4) = 传统记谱 c1-b1 (小字一组，中央C)
  // 科学记谱 octave 5 (C5-B5) = 传统记谱 c2-b2 (小字二组)
  // 科学记谱 octave 6 (C6-B6) = 传统记谱 c3-b3 (小字三组)
  // 科学记谱 octave 7 (C7-B7) = 传统记谱 c4-b4 (小字四组)
  // 科学记谱 octave 8 (C8) = 传统记谱 c5 (小字五组)

  const baseNote = note.replace("#", "♯"); // 使用音乐符号

  if (octave === 0) {
    // A0, B0 = A2, B2 (大字二组)
    return `${baseNote}₂`;
  } else if (octave === 1) {
    // C1-B1 = C1-B1 (大字一组)
    return `${baseNote}₁`;
  } else if (octave === 2) {
    // C2-B2 = C-B (大字组，大写无标记)
    return baseNote.toUpperCase();
  } else if (octave === 3) {
    // C3-B3 = c-b (小字组，小写无标记)
    return baseNote.toLowerCase();
  } else if (octave >= 4 && octave <= 8) {
    // C4-B4 = c1-b1 (小字一组)
    // C5-B5 = c2-b2 (小字二组)
    // C6-B6 = c3-b3 (小字三组)
    // C7-B7 = c4-b4 (小字四组)
    // C8 = c5 (小字五组)
    const superscriptNumber = octave - 3; // 4->1, 5->2, 6->3, 7->4, 8->5
    return `${baseNote.toLowerCase()}${superscriptNumber}`;
  }

  return baseNote;
};

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ onNotePress }) => {
  const keys = generatePianoKeys(); // 生成标准88键钢琴布局

  // 分离白键和黑键
  const whiteKeys = keys.filter((key) => !key.isBlack);
  const blackKeys = keys.filter((key) => key.isBlack);

  const screenWidth = Dimensions.get("window").width;
  const whiteKeyWidth = screenWidth / 7; // 每个八度有7个白键，屏幕显示7个白键

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // 中央C (C4) 是标准88键钢琴的第40个键（从A0开始数）
    // 白键顺序：A0(1), B0(2), C1(3), D1(4)... 到 C4
    // 计算C4前面有多少个白键：A0, B0 (2个) + C1到B3 (7*3=21个) = 23个白键
    const c4WhiteKeyIndex = 23;
    const c4Position = c4WhiteKeyIndex * whiteKeyWidth;
    // 居中：减去半屏宽度
    const initialX = c4Position - screenWidth / 2;
    scrollViewRef.current?.scrollTo({
      x: Math.max(0, initialX),
      animated: false,
    });
  }, [whiteKeyWidth, screenWidth]);

  const handlePress = (key: PianoKey) => {
    onNotePress(key.note, key.octave);
  };

  // 计算黑键的位置
  const getBlackKeyPosition = (key: PianoKey): number => {
    // 计算该黑键前面有多少个白键
    let whiteKeysBefore = 0;

    // 标准顺序：A0, B0, C1-B1, C2-B2, ..., C8
    // 每个八度（C-B）的黑键相对于该八度第一个白键(C)的位置
    const blackKeyOffsets: { [key: string]: number } = {
      "C#": 0.7, // C 和 D 之间
      "D#": 1.7, // D 和 E 之间
      "F#": 3.7, // F 和 G 之间
      "G#": 4.7, // G 和 A 之间
      "A#": 5.7, // A 和 B 之间
    };

    // 特殊处理 A0 和 B0（大字二组）
    if (key.octave === 0) {
      if (key.note === "A#") {
        return 0.7 * whiteKeyWidth; // A0 和 B0 之间
      }
    }

    // 计算完整八度之前的白键
    if (key.octave === 0) {
      whiteKeysBefore = 0; // A0, B0 没有前置八度
    } else {
      whiteKeysBefore = 2 + (key.octave - 1) * 7; // A0, B0 = 2个，然后每个完整八度7个
    }

    // 添加当前八度内的偏移
    const offset = blackKeyOffsets[key.note] ?? 0;
    return (whiteKeysBefore + offset) * whiteKeyWidth;
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
    >
      <View
        style={[
          styles.keyboardContainer,
          { width: whiteKeys.length * whiteKeyWidth },
        ]}
      >
        {/* 白键 */}
        <View style={styles.whiteKeysContainer}>
          {whiteKeys.map((key, index) => (
            <TouchableOpacity
              key={key.id}
              style={[styles.whiteKey, { width: whiteKeyWidth }]}
              onPress={() => handlePress(key)}
              activeOpacity={0.7}
            >
              <Text style={styles.whiteKeyLabel}>
                {getNoteName(key.note, key.octave)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 黑键 */}
        <View style={styles.blackKeysContainer}>
          {blackKeys.map((key) => (
            <TouchableOpacity
              key={key.id}
              style={[
                styles.blackKey,
                {
                  left: getBlackKeyPosition(key),
                  width: whiteKeyWidth * 0.6,
                },
              ]}
              onPress={() => handlePress(key)}
              activeOpacity={0.7}
            >
              <Text style={styles.blackKeyLabel}>
                {getNoteName(key.note, key.octave)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: 180,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  keyboardContainer: {
    position: "relative",
    height: "100%",
  },
  whiteKeysContainer: {
    flexDirection: "row",
    height: "100%",
  },
  whiteKey: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  whiteKeyLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  blackKeysContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  blackKey: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  blackKeyLabel: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
});

export default PianoKeyboard;
