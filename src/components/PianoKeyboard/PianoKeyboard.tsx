import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { generatePianoKeys } from '../../utils/musicUtils';
import { PianoKey } from '../../types/music.types';

interface PianoKeyboardProps {
  onNotePress: (note: string, octave: number) => void;
  octaves?: number;
  startOctave?: number;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  onNotePress,
  octaves = 2,
  startOctave = 4,
}) => {
  const keys = generatePianoKeys(octaves, startOctave);

  // 分离白键和黑键
  const whiteKeys = keys.filter(key => !key.isBlack);
  const blackKeys = keys.filter(key => key.isBlack);

  const screenWidth = Dimensions.get('window').width;
  const whiteKeyWidth = screenWidth / (7 * octaves); // 每个八度有7个白键

  const handlePress = (key: PianoKey) => {
    onNotePress(key.note, key.octave);
  };

  // 计算黑键的位置
  const getBlackKeyPosition = (key: PianoKey): number => {
    const notePattern = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octaveOffset = (key.octave - startOctave) * 7;
    const noteInOctave = notePattern.indexOf(key.note);

    // 黑键位置映射到白键之间
    const blackKeyPositions: { [key: string]: number } = {
      'C#': 0.7,
      'D#': 1.7,
      'F#': 3.7,
      'G#': 4.7,
      'A#': 5.7,
    };

    const position = blackKeyPositions[key.note] ?? 0;
    return (octaveOffset + position) * whiteKeyWidth;
  };

  return (
    <View style={styles.container}>
      {/* 白键 */}
      <View style={styles.whiteKeysContainer}>
        {whiteKeys.map((key, index) => (
          <TouchableOpacity
            key={key.id}
            style={[styles.whiteKey, { width: whiteKeyWidth }]}
            onPress={() => handlePress(key)}
            activeOpacity={0.7}
          >
            <Text style={styles.whiteKeyLabel}>{key.note}</Text>
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
            <Text style={styles.blackKeyLabel}>{key.note}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    backgroundColor: '#f5f5f5',
    position: 'relative',
    borderTopWidth: 2,
    borderTopColor: '#333',
  },
  whiteKeysContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  whiteKey: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  whiteKeyLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  blackKeysContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  blackKey: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  blackKeyLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
});

export default PianoKeyboard;
