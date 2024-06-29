import React from "react";
import { Platform } from "react-native";
import { lightColors, createTheme, ThemeProvider } from "@rneui/themed";

type Props = {
  children: React.ReactNode;
};

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
  darkColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
  mode: "light",

});

const AppThemeProvider = ({ children }: Props) => {
  return (<ThemeProvider theme={theme}>
    {children}
    </ThemeProvider>);
};

export default AppThemeProvider;
