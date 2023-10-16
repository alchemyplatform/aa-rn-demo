import React, { ReactElement } from "react";
import { Linking, TouchableOpacity } from "react-native";

import FormText from "./FormText";
import { colors } from "@theme/color";
import { isValidHttpUrl } from "@shared-utils";

const Link = ({ text, url }: { text: string; url: string }): ReactElement => {
  return (
    <TouchableOpacity
      onPress={(): void => {
        if (isValidHttpUrl(url)) {
          Linking.openURL(url);
        }
      }}
    >
      <FormText style={{ color: colors.primary._400 }}>{text}</FormText>
    </TouchableOpacity>
  );
};

export default Link;
