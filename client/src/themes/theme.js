import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: ["Monseratt", "sans-serif"],
    fontSize: 12,
    fontWeightRegular: 600,
    h1: {
      fontSize: 24,
      fontWeight: 500
    },
    h2: {
      fontSize: 18,
      fontWeight: 600
    },
    h3: {
      fontSize: 14,
      fontWeight: 600
    }
  },
  palette: {
    primary: { main: "#759CFC" },
    secondary: { main: "#B5C0D9" }
  },
  overrides: {
    MuiButton: {
      root: {
        fontWeight: 600
      }
    },
    MuiInputLabel: {
      outlined: {
        color: "black",
        textAlign: "center",
        "&$shrink": {
          width: "auto",
          color: "#759CFC"
        },
        width: "90%"
      }
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: "rgba(117,156,252,0.3)"
      },
      root: {
        fontWeight: 500,
        "&:hover $notchedOutline": {
          borderColor: "#759CFC"
        }
      }
    },
    MuiInput: {
      underline: {
        "&&&:before": {
          borderBottom: "none"
        }
      }
    }
  }
});
