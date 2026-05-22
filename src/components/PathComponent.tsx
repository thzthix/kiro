import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PathCoordinates } from '../types';

interface PathComponentProps {
  pathCoordinates: PathCoordinates;
}

// Color constants from design palette
const COLORS = {
  oliveGreen: '#8B9556',
  beige: '#F5F1E8',
  darkGray: '#4A4A4A',
};

// Minimum path height for visibility
const MIN_PATH_HEIGHT = 50;

/**
 * PathComponent renders a curved path from START to GOAL
 * Uses olive green color for the path and waypoint indicators
 * Displays START and GOAL labels at the respective positions
 */
const PathComponent: React.FC<PathComponentProps> = ({ pathCoordinates }) => {
  const { start, goal, waypoints } = pathCoordinates;

  // Calculate bounding box for the path
  const allXCoords = [start.x, goal.x, ...waypoints.map((p) => p.x)];
  const allYCoords = [start.y, goal.y, ...waypoints.map((p) => p.y)];
  
  const minX = Math.min(...allXCoords);
  const maxX = Math.max(...allXCoords);
  const minY = Math.min(...allYCoords);
  const maxY = Math.max(...allYCoords);

  const pathWidth = maxX - minX;
  const pathHeight = Math.max(maxY - minY, MIN_PATH_HEIGHT);

  return (
    <View
      testID="path-component"
      style={[
        styles.container,
        {
          left: minX,
          top: minY,
          width: pathWidth,
          height: pathHeight,
        },
      ]}
    >
      {/* START label at the beginning of the path */}
      <View
        style={[
          styles.labelContainer,
          {
            left: start.x - minX - 25,
            top: start.y - minY - 10,
          },
        ]}
      >
        <Text style={styles.labelText}>START</Text>
      </View>

      {/* Path line visualization */}
      <View
        testID="path-element"
        style={[
          styles.pathLine,
          {
            left: 0,
            top: start.y - minY,
            width: pathWidth,
          },
        ]}
      />

      {/* Waypoint indicators for visual enhancement */}
      {waypoints.map((waypoint, index) => (
        <View
          key={`waypoint-${index}`}
          style={[
            styles.waypoint,
            {
              left: waypoint.x - minX - 2,
              top: waypoint.y - minY - 2,
            },
          ]}
        />
      ))}

      {/* GOAL label at the end of the path */}
      <View
        style={[
          styles.labelContainer,
          {
            left: goal.x - minX - 20,
            top: goal.y - minY - 10,
          },
        ]}
      >
        <Text style={styles.labelText}>GOAL</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  pathLine: {
    position: 'absolute',
    height: 4,
    backgroundColor: COLORS.oliveGreen,
    borderRadius: 2,
  },
  waypoint: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.oliveGreen,
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: COLORS.beige,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.oliveGreen,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkGray,
    fontFamily: 'Inter',
  },
});

export default PathComponent;
