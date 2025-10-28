import React from "react";
import { View, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import Svg, { Line, Circle, Text as SvgText, G, Path } from "react-native-svg";
import { Note, NoteState } from "../../types/music.types";
import { calculateNoteYPosition } from "../../utils/musicUtils";

interface StaffRendererProps {
  notes: Note[];
  noteStates: NoteState[];
  clef?: "treble" | "bass";
  highlightIndex?: number;
}

const StaffRenderer: React.FC<StaffRendererProps> = ({
  notes,
  noteStates,
  clef = "treble",
  highlightIndex = 0,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const staffHeight = 200;
  const lineSpacing = 12;
  const staffCenterY = staffHeight / 2;
  const noteSpacing = 80;
  const startX = 60;

  // 五线谱的五条线
  const staffLines = [0, 1, 2, 3, 4].map(
    (i) => staffCenterY - lineSpacing * 2 + i * lineSpacing
  );

  // 根据状态获取音符颜色
  const getNoteColor = (state: NoteState): string => {
    switch (state) {
      case NoteState.WAITING:
        return "#FF9800"; // 橙色
      case NoteState.CORRECT:
        return "#4CAF50"; // 绿色
      case NoteState.INCORRECT:
        return "#F44336"; // 红色
      case NoteState.COMPLETED:
        return "#9E9E9E"; // 灰色
      default:
        return "#000";
    }
  };

  // 绘制高音谱号
  const renderTrebleClef = () => {
    return (
      <SvgText
        x="20"
        y={staffCenterY + 15}
        fontSize="60"
        fill="#000"
        fontFamily="Arial"
      >
        𝄞
      </SvgText>
    );
  };

  // 绘制低音谱号
  const renderBassClef = () => {
    return (
      <SvgText
        x="20"
        y={staffCenterY + 10}
        fontSize="50"
        fill="#000"
        fontFamily="Arial"
      >
        𝄢
      </SvgText>
    );
  };

  // 获取音符符号根据时值
  const getNoteSymbol = (duration: number): string => {
    if (duration >= 1) return "𝅝"; // 全音符
    if (duration >= 0.5) return "𝅗𝅥"; // 二分音符
    if (duration >= 0.25) return "𝅘𝅥"; // 四分音符
    return "𝅘𝅥𝅮"; // 八分音符
  };

  // 渲染音符
  const renderNote = (note: Note, index: number, state: NoteState) => {
    const x = startX + index * noteSpacing;
    const y = calculateNoteYPosition(note, { clef }, staffCenterY, lineSpacing);
    const color = getNoteColor(state);
    const isHighlighted = index === highlightIndex;
    const symbol = getNoteSymbol(note.duration);

    return (
      <G key={note.id}>
        {/* 音符符号 */}
        <SvgText
          x={x}
          y={y + 5} // 调整位置使符号居中
          fontSize={isHighlighted ? 24 : 20}
          fill={color}
          textAnchor="middle"
          opacity={state === NoteState.COMPLETED ? 0.5 : 1}
          fontFamily="Arial"
        >
          {symbol}
        </SvgText>

        {/* 如果音符超出五线谱范围，添加辅助线 */}
        {(y < staffLines[0] - lineSpacing ||
          y > staffLines[4] + lineSpacing) && (
          <Line
            x1={x - 12}
            y1={y}
            x2={x + 12}
            y2={y}
            stroke="#000"
            strokeWidth="1"
          />
        )}

        {/* 音符标签 (显示在下方) */}
        <SvgText
          x={x}
          y={staffLines[4] + 30}
          fontSize="12"
          fill={color}
          textAnchor="middle"
          fontWeight="bold"
        >
          {note.pitch}
          {note.octave}
        </SvgText>
      </G>
    );
  };

  const svgWidth = Math.max(
    screenWidth,
    startX + notes.length * noteSpacing + 50
  );

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={svgWidth} height={staffHeight}>
          {/* 绘制五线谱的五条线 */}
          {staffLines.map((y, index) => (
            <Line
              key={`line-${index}`}
              x1="0"
              y1={y}
              x2={svgWidth}
              y2={y}
              stroke="#000"
              strokeWidth="1.5"
            />
          ))}

          {/* 绘制谱号 */}
          {clef === "treble" ? renderTrebleClef() : renderBassClef()}

          {/* 绘制音符 */}
          {notes.map((note, index) =>
            renderNote(note, index, noteStates[index] || NoteState.COMPLETED)
          )}
        </Svg>
      </ScrollView>

      {/* 图例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FF9800" }]} />
          <Text style={styles.legendText}>待弹奏</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.legendText}>正确</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F44336" }]} />
          <Text style={styles.legendText}>错误</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
});

export default StaffRenderer;
