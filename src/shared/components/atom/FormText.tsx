import { getFontStyle } from "@shared-utils";
import { colors } from "@theme/color";
import React, { ReactElement, ReactNode } from "react";
import { Text, TextProps } from "react-native";
import { FontSize, FontType } from "types/font";

export type FormTextProps = {
  size?: FontSize;
  font?: "R" | "B" | "SB";
  children: ReactNode;
  color?: string;
} & TextProps;

const FormText = ({
  size = 14,
  font = "R",
  children,
  color = colors.black._800,
  style,
  ...rest
}: FormTextProps): ReactElement => {
  const fontStyle = getFontStyle(`${font}.${size}` as FontType);

  return (
    <Text style={[{ color }, fontStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

export default FormText;
