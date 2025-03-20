import { ThemeConfig } from "antd"

const getThemeConfig = (isDarkMode: boolean): ThemeConfig => ({
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 8,
    colorBgContainer: isDarkMode ? "var(--neutral-2)" : "var(--neutral-1)",
    colorBgElevated: isDarkMode ? "var(--neutral-3)" : "var(--neutral-2)",
    colorText: isDarkMode ? "var(--neutral-8)" : "var(--neutral-10)",
    colorTextSecondary: isDarkMode ? "var(--neutral-7)" : "var(--neutral-8)",
    boxShadow: isDarkMode
      ? "0 4px 12px rgba(0, 0, 0, 0.2)"
      : "0 4px 12px rgba(0, 0, 0, 0.05)",
    boxShadowSecondary: isDarkMode
      ? "0 6px 16px rgba(0, 0, 0, 0.3)"
      : "0 6px 16px rgba(0, 0, 0, 0.08)",
  },
  components: {
    Table: {
      headerBg: isDarkMode ? "var(--neutral-3)" : "var(--neutral-2)",
      headerColor: isDarkMode ? "var(--neutral-8)" : "var(--neutral-10)",
      rowHoverBg: isDarkMode ? "var(--neutral-3)" : "var(--neutral-2)",
      colorBgContainer: isDarkMode ? "var(--neutral-2)" : "var(--neutral-1)",
      colorText: isDarkMode ? "var(--neutral-8)" : "var(--neutral-10)",
      borderColor: isDarkMode ? "var(--neutral-4)" : "var(--neutral-4)",
    },
    Menu: {
      darkItemBg: "var(--neutral-2)",
      darkItemHoverBg: "var(--neutral-3)",
      darkItemSelectedBg: "var(--neutral-4)",
      darkSubMenuItemBg: "var(--neutral-2)",
    },
  },
})

export default getThemeConfig
