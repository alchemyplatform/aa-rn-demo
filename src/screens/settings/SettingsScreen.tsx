import React, { ReactElement, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import { useWalletContext } from "@context/wallet";
import { colors } from "@theme/color";
import Header from "@shared-components/atom/Header";
import FormModal from "@shared-components/atom/FormModal";
import Container from "@shared-components/atom/Container";
import FormText from "@shared-components/atom/FormText";

interface SettingsScreenProps {}

const SettingTextItem = (props: {
  name: string;
  text?: string;
}): ReactElement => {
  const { name, text } = props;
  return (
    <View style={styles.item}>
      <FormText
        font={"B"}
        color={colors.black._900}
        style={{ marginBottom: 4 }}
      >
        {name}
      </FormText>
      <FormText size={12} font={"R"} color={colors.primary._400}>
        {text}
      </FormText>
    </View>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { magicAuth, scaAddress, logout } = useWalletContext();

  const [visibleSignOutModal, setVisibleSignOutModal] =
    useState<boolean>(false);

  return (
    <Container
      style={[styles.container]}
      safeAreaBackgroundColor={colors.black._90005}
    >
      <View style={styles.body}>
        <Header
          left="back"
          onPressLeft={() => {
            NavigationService.goBack();
          }}
          containerStyle={{ backgroundColor: "transparent" }}
        />
        <View style={styles.itemGroup}>
          {magicAuth?.email && (
            <SettingTextItem name={"Email"} text={magicAuth.email} />
          )}
          {magicAuth?.phoneNumber && (
            <SettingTextItem
              name={"Phone Number"}
              text={magicAuth.phoneNumber}
            />
          )}
          {magicAuth?.oAuthRedirectResult && (
            <SettingTextItem
              name={"Provider"}
              text={magicAuth.oAuthRedirectResult.oauth.provider}
            />
          )}
          {magicAuth?.address && (
            <SettingTextItem name={"Owner"} text={magicAuth.address} />
          )}
          {scaAddress && (
            <SettingTextItem name={"Wallet Address"} text={scaAddress} />
          )}
        </View>
        <View style={(styles.itemGroup, { alignSelf: "center" })}>
          <TouchableOpacity
            style={styles.button}
            onPress={(): void => {
              setVisibleSignOutModal(true);
            }}
          >
            <FormText font={"SB"} color={colors.black._300}>
              Sign Out
            </FormText>
          </TouchableOpacity>
        </View>
      </View>
      <FormModal
        visible={visibleSignOutModal}
        title={"Are you sure to sign out?"}
        message="You can always sign back in."
        positive={{
          text: "Cancel",
          callback: (): void => {
            setVisibleSignOutModal(false);
          },
        }}
        negative={{
          text: "Sign out",
          callback: (): void => {
            setVisibleSignOutModal(false);
            logout();
          },
        }}
      />
    </Container>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    rowGap: 12,
  },
  itemGroup: { backgroundColor: "white" },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: colors.white,
    borderColor: colors.black._100,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
});
