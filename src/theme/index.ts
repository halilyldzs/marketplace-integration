import { theme } from "antd"

const { defaultAlgorithm, darkAlgorithm } = theme

export const lightTheme = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    borderRadius: 8,
    wireframe: false,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f5f5f5",
    colorText: "rgba(0, 0, 0, 0.85)",
    colorTextSecondary: "rgba(0, 0, 0, 0.45)",
    colorBorder: "#d9d9d9",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    boxShadowSecondary: "0 2px 4px rgba(0, 0, 0, 0.06)",
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      boxShadow: "none",
      "&:hover": {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    },
    Card: {
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Table: {
      borderRadius: 8,
      headerBg: "#fafafa",
    },
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
    },
    Layout: {
      bodyBg: "#f5f5f5",
    },
    Form: {
      labelColor: "rgba(0, 0, 0, 0.85)",
      itemMarginBottom: 24,
    },
    Upload: {
      borderRadius: 6,
    },
    Modal: {
      borderRadius: 12,
      contentBg: "#ffffff",
      headerBg: "#ffffff",
      titleColor: "rgba(0, 0, 0, 0.85)",
    },
    Drawer: {
      borderRadius: 12,
    },
    Tag: {
      borderRadius: 4,
    },
    Badge: {
      statusSize: 8,
    },
    Avatar: {
      borderRadius: 6,
    },
    Tabs: {
      borderRadius: 8,
      inkBarColor: "#1677ff",
    },
    Steps: {
      iconSize: 32,
      titleLineHeight: 32,
    },
    Timeline: {
      dotBorderWidth: 2,
    },
    Progress: {
      borderRadius: 4,
    },
    Alert: {
      borderRadius: 8,
    },
    Message: {
      borderRadius: 8,
    },
    Notification: {
      borderRadius: 8,
    },
  },
}

export const darkTheme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    borderRadius: 8,
    wireframe: false,
    colorBgContainer: "#141414",
    colorBgLayout: "#000000",
    colorText: "rgba(255, 255, 255, 0.85)",
    colorTextSecondary: "rgba(255, 255, 255, 0.45)",
    colorBorder: "#303030",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.45)",
    boxShadowSecondary: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      boxShadow: "none",
      "&:hover": {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      },
    },
    Card: {
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 40,
    },
    Table: {
      borderRadius: 8,
      headerBg: "#1f1f1f",
    },
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
    },
    Layout: {
      bodyBg: "#000000",
    },
    Form: {
      labelColor: "rgba(255, 255, 255, 0.85)",
      itemMarginBottom: 24,
    },
    Upload: {
      borderRadius: 6,
    },
    Modal: {
      borderRadius: 12,
      contentBg: "#141414",
      headerBg: "#141414",
      titleColor: "rgba(255, 255, 255, 0.85)",
    },
    Drawer: {
      borderRadius: 12,
    },
    Tag: {
      borderRadius: 4,
    },
    Badge: {
      statusSize: 8,
    },
    Avatar: {
      borderRadius: 6,
    },
    Tabs: {
      borderRadius: 8,
      inkBarColor: "#1677ff",
    },
    Steps: {
      iconSize: 32,
      titleLineHeight: 32,
    },
    Timeline: {
      dotBorderWidth: 2,
    },
    Progress: {
      borderRadius: 4,
    },
    Alert: {
      borderRadius: 8,
    },
    Message: {
      borderRadius: 8,
    },
    Notification: {
      borderRadius: 8,
    },
  },
}
