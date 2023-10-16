import React, { ReactElement } from "react";
import FastImage, { FastImageProps } from "react-native-fast-image";

type FormImageProps = {
  size?: number;
} & FastImageProps;
const FormImage = (props: FormImageProps): ReactElement => {
  const { size, style, ...rest } = props;

  return (
    <FastImage
      style={[{ width: size ?? "100%", height: size ?? "100%" }, style]}
      {...rest}
    />
  );
};

export default FormImage;
