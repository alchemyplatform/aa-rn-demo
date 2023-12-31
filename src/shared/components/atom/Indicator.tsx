import { colors } from "@theme/color";
import React, { ReactElement } from "react";
import { ActivityIndicator, ColorValue, Platform } from "react-native";

const Indicator = (props: {
  size?: number | "small" | "large" | undefined;
  color?: ColorValue | undefined;
}): ReactElement => {
  const defaultColor =
    Platform.OS === "android" ? colors.primary._400 : undefined;

  return (
    <ActivityIndicator size={props.size} color={props.color ?? defaultColor} />
  );
};
export default Indicator;
