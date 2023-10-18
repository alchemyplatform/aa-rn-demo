import RNBounceable from "@freakycoder/react-native-bounceable";
import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
/**
 * ? Local Imports
 */
import { useWalletContext } from "@context/wallet";
import { ICardItem } from "@services/models";
import { Hex, encodeFunctionData, parseEther } from "viem";
import createStyles from "./CardItem.style";

import erc721Abi from "@abi/ERC721.json";
import { useAlertContext } from "@context/alert";
import usePostTx from "@hooks/contract/usePostTx";
import FormImage from "@shared-components/atom/FormImage";
import { TouchableButton } from "@shared-components/button/TouchableButton";
import Text from "@shared-components/text-wrapper/TextWrapper";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ICardItemProps {
  style?: CustomStyleProp;
  data: ICardItem;
  onPress: () => void;
}

const CardItem: React.FC<ICardItemProps> = ({ style, data, onPress }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(), []);

  const { name, description, contract, image } = data;
  const { scaAddress } = useWalletContext();

  const { postTx } = usePostTx();

  const { dispatchAlert } = useAlertContext();

  const [minting, setMinting] = React.useState(false);

  const mint = async () => {
    console.log("minting");
    setMinting(true);
    try {
      const res = await postTx({
        target: contract as Hex,
        data: encodeFunctionData({
          abi: erc721Abi,
          functionName: "mintTo",
          args: [scaAddress],
        }),
        value: parseEther("0.08"),
      });
      if (res.success) {
        console.log("minted", res.receipt);
        dispatchAlert({
          type: "open",
          alertType: "success",
          message: `Mint succsess to address ${scaAddress}: tx ${res.receipt.transactionHash}`,
        });
      } else {
        throw res.error;
      }
    } catch (error) {
      console.error("mint failed", error);
      dispatchAlert({
        type: "open",
        alertType: "error",
        message: `Mint failed: ${JSON.stringify(error)}`,
      });
    } finally {
      setMinting(false);
    }
  };

  const Header = () => (
    <>
      <Text h4 bold color={colors.text}>
        {name}
      </Text>
      <Text h5 color={colors.placeholder} style={styles.descriptionTextStyle}>
        {description}
      </Text>
    </>
  );

  return (
    <RNBounceable style={[styles.container, style]} onPress={onPress}>
      <Header />
      <View style={styles.contentContainer}>
        <FormImage source={{ uri: image }} size={250} />
      </View>
      <TouchableButton disabled={minting} handler={() => mint()} title="Mint" />
    </RNBounceable>
  );
};

export default CardItem;
