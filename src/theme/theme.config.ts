"use client";
import { generateColors } from "@mantine/colors-generator";
import {
  rem,
  MantineThemeOverride,
  MantineTheme,
  createTheme,
} from "@mantine/core";

export const themeConfig: MantineThemeOverride = {
  colors: {
    primary: generateColors("#124e66"),
    secondary: generateColors("#ffcc00"),
    bgColor: generateColors("#f5f5f5"),
    blueInk: generateColors("#062f4f"),
    accent: generateColors("#F59300"),
    success: generateColors("#00be1c"),
    danger: generateColors("#ff0000"),
    warning: generateColors("#ffbb55"),
    muted: generateColors("#99B2C3"),
    black: generateColors("#000000"),
    gray: generateColors("#7d8da1"),
    white: generateColors("#FFFFFF"),
    aliceblue: generateColors("#f0f8ff"),
    lightGray: generateColors("#cccccc"),
  },

  primaryColor: "primary",
  primaryShade: 7,
  fontSizes: {
    xs: rem(10),
    sm: rem(12),
    md: rem(14),
    lg: rem(16),
    xl: rem(18),
    "2xl": rem(20),
    "3xl": rem(24),
  },
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(20),
    xl: rem(24),
  },
  radius: {
    xs: rem(1.25),
    sm: rem(2.5),
    md: rem(5),
    lg: rem(10),
    xl: rem(15),
    full: "50%",
  },

  breakpoints: {
    xs: "0em",
    sm: "57.6rem", // 576px
    md: "76.8rem", // 768px
    lg: "99.2rem", // 992px
    xl: "120rem", // 1200px
    "2xl": "160rem", // 1600px
  },
  shadows: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.1)",
    sm: "0 0.2rem 0.3rem rgba(0, 0, 0, 0.1)",
    md: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    lg: "0 0.8rem 1.5rem rgba(0, 0, 0, 0.2)",
    xl: "0 1.5rem 2rem rgba(0, 0, 0, 0.25)",
  },

  // Default component styles
  components: {
    Button: {
      defaultProps: {
        radius: "xs",
        size: "md",
      },
      styles: () => ({
        root: {
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: "0.1rem",
          padding: "0.75rem 1.5rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.2rem",
          cursor: "pointer",
          transition: "all 0.5s ease-in-out",
          "&:focus-visible, &:active": {
            outline: "none",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          },
        },
        leftIcon: {
          marginRight: "0.5rem",
          fontSize: "1.8rem",
        },
      }),
    },
    NavLink: {
      styles: (theme: MantineTheme) => ({
        root: {
          fontWeight: 400,
          "&[data-active]": {
            backgroundColor: "transparent",
            color: theme.colors.primary[7],
            fontWeight: 700,
            "&::before": {
              content: '""',
              width: "100%",
              height: "0.2rem",
              bottom: "-0.2rem",
              position: "absolute",
              backgroundColor: theme.colors.accent[7],
            },
          },
          "&:hover": {
            backgroundColor: "transparent",
            "&::before": {
              content: '""',
              width: "100%",
              height: "0.2rem",
              bottom: "-0.2rem",
              position: "absolute",
              transform: "scaleX(1)",
              transformOrigin: "left",
              backgroundColor: theme.colors.accent[7],
            },
          },
          "&::before": {
            content: '""',
            width: "100%",
            height: "0.2rem",
            bottom: "-0.2rem",
            position: "absolute",
            transform: "scaleX(0)",
            transformOrigin: "right",
            backgroundColor: theme.colors.accent[7],
            transition: "transform 0.4s ease-in-out",
          },
        },
        icon: {
          color: theme.white,
          "&[data-active]": {
            color: theme.colors.accent[7],
          },
        },
        label: {
          fontSize: rem(14),
        },
      }),
    },
    Card: {
      defaultProps: {
        padding: "lg",
        radius: "md",
        shadow: "sm",
      },
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.white,
          borderRadius: theme.radius.md,
          boxShadow: "0 0.2rem 0.3rem rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
          },
        },
      }),
    },
    Table: {
      styles: (theme: MantineTheme) => ({
        root: {
          width: "100%",
          textAlign: "left",
          borderCollapse: "collapse",
          backgroundColor: theme.white,
          boxShadow: "0px 7px 29px -5px rgba(0, 0, 0, 0.3)",
          borderRadius: theme.radius.md,
          overflow: "hidden",
        },
        thead: {
          backgroundColor: theme.white,
          boxShadow: "0px 5px 10px -5px rgba(0, 0, 0, 0.3)",
          th: {
            padding: rem(10),
            fontSize: rem(12),
            fontWeight: 700,
            letterSpacing: "0.1rem",
            textTransform: "uppercase",
          },
        },
        tbody: {
          tr: {
            borderBottom: `1px solid ${theme.colors.gray[3]}`,
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: theme.colors.gray[0],
            },
            "&:last-child": {
              borderBottom: "none",
            },
          },
          td: {
            padding: `${rem(15)} ${rem(7)}`,
            fontSize: rem(14),
          },
        },
      }),
    },
    Badge: {
      defaultProps: {
        radius: "xl",
      },
      styles: () => ({
        root: {
          textTransform: "uppercase",
          fontWeight: 500,
          padding: `${rem(3)} ${rem(8)}`,
          fontSize: rem(12),
        },
      }),
    },
    TextInput: {
      defaultProps: {
        size: "md",
      },
      styles: (theme: MantineTheme) => ({
        root: {
          position: "relative",
        },
        input: {
          height: rem(35),
          border: "none",
          outline: "none",
          padding: rem(10),
          fontSize: rem(14),
          borderRadius: rem(2),
          color: theme.colors.primary[7],
          backgroundColor: theme.white,
          borderBottom: `1px solid rgba(${theme.colors.muted[7]}, 0.4)`,
          transition: "all 0.2s ease-in-out",
          "&:focus": {
            borderBottom: `2px solid ${theme.colors.primary[7]}`,
          },
          "&::placeholder": {
            color: theme.colors.muted[7],
            fontSize: rem(14),
          },
        },
        label: {
          fontSize: rem(14),
          marginBottom: rem(4),
        },
        icon: {
          color: theme.colors.muted[7],
        },
      }),
    },
    Avatar: {
      styles: (theme: MantineTheme) => ({
        root: {
          border: `2px solid ${theme.white}`,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      }),
    },
    Pagination: {
      styles: (theme: MantineTheme) => ({
        root: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: `${rem(10)} 0`,
          gap: rem(5),
        },
        item: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: rem(25),
          height: rem(25),
          color: theme.colors.primary[7],
          textDecoration: "none",
          borderRadius: theme.radius.sm,
          fontWeight: 500,
          transition: "all 0.2s ease",
          backgroundColor: theme.white,
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
          position: "relative",
          overflow: "hidden",
          "&[data-active]": {
            boxShadow: "0 0.2rem 0.3rem rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
            color: theme.colors.primary[7],
            backgroundColor: "rgba(240, 240, 240, 0.7)",
          },
          "&:hover:not([data-active])": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            color: theme.colors.secondary[9],
          },
        },
      }),
    },
    Progress: {
      styles: (theme: MantineTheme) => ({
        root: {
          height: rem(20),
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.gray[2],
        },
        bar: {
          backgroundColor: theme.colors.primary[7],
          borderRadius: theme.radius.sm,
        },
      }),
    },
    Checkbox: {
      styles: (theme: MantineTheme) => ({
        input: {
          appearance: "none",
          backgroundColor: "transparent",
          width: rem(20),
          height: rem(20),
          border: `2px solid ${theme.colors.muted[7]}`,
          borderRadius: theme.radius.sm,
          cursor: "pointer",
          position: "relative",
          "&:checked": {
            backgroundColor: theme.colors.primary[7],
            borderColor: theme.colors.primary[7],
            "&::after": {
              content: '"✓"',
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: theme.white,
              fontSize: rem(12),
            },
          },
        },
        label: {
          marginLeft: rem(5),
          fontSize: rem(14),
        },
      }),
    },
  },
  fontFamily: '"Roboto", sans-serif',
  headings: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: "700",
    sizes: {
      h1: { fontSize: rem(22.5), lineHeight: "1.4" },
      h2: { fontSize: rem(18), lineHeight: "1.4" },
      h3: { fontSize: rem(16), lineHeight: "1.4" },
      h4: { fontSize: rem(14), lineHeight: "1.4" },
      h5: { fontSize: rem(12), lineHeight: "1.4" },
    },
  },

  other: {
    navbarHeight: "6rem",
    sidebarWidth: "22rem",
    transitionEasing: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "0.3s",
    boxShadowLight: "0 0.2rem 0.3rem rgba(0, 0, 0, 0.1)",
    boxShadowMedium: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
    boxShadowHeavy: "0 0.8rem 1.5rem rgba(0, 0, 0, 0.2)",
  },
};

const theme = createTheme({
  ...themeConfig,
});

export default theme;
