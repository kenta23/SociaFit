// ProgressRings.tsx
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";

type RingData = {
  value: number; // 0 to 1
  color: string;
};

type Props = {
  rings: RingData[];
  size?: number;
  backgroundColor?: string; // background of ring path
  containerColor?: string;  // outer container bg
  startAngle?: number;      // default -90 (top)
};

export const ProgressRings: React.FC<Props> = ({
  rings,
  size = 150,
  backgroundColor = "#ddd",
  startAngle = -90,
}) => {
  const center = size / 2;
  const radius = [70, 50, 30];

  const drawArc = (cx: number, cy: number, r: number, startDeg: number, sweepDeg: number) => {
    const path = Skia.Path.Make();
    path.addArc(
      { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r },
      startDeg,
      sweepDeg
    );
    return path;
  };

  return (
    <View
      style={{
        borderRadius: size / 2,
        padding: 10,
        width: size,
        height: size,
      }}
    >
      <Canvas style={{ width: size, height: size, padding: 24 }}>
        {rings.map((ring, index) => {
          const stroke = 10;
          const bgPath = drawArc(center, center, radius[index], 0, 360);
          const fgPath = drawArc(center, center, radius[index], startAngle, ring.value * 360);

          return (
            <React.Fragment key={index}>
              <Path
                path={bgPath}
                color={backgroundColor}
                style="stroke"
                strokeWidth={stroke}
                strokeCap="round"
              />
              <Path
                path={fgPath}
                color={ring.color}
                style="stroke"
                strokeWidth={stroke}
                strokeCap="round"
              />
            </React.Fragment>
          );
        })}
      </Canvas>
    </View>
  );
};
