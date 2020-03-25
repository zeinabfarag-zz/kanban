import { makeStyles } from "@material-ui/core/styles";
import loginPic from "../images/login.png";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    textAlign: "center"
  },
  image: {
    backgroundImage: `url(${loginPic})`,
    backgroundPosition: "center",
    backgroundSize: "cover"
  },
  paper: {
    marginTop: theme.spacing(16),
    display: "flex",
    justifyContent: "center",
    maxWidth: "60%"
  },
  title: {
    marginBottom: theme.spacing(4)
  },
  input: {
    height: "3.9em"
  },
  password: {
    fontSize: 18
  },
  footer: {
    marginTop: theme.spacing(22),
    padding: "5%",
    borderTop: "2px rgba(117,156,252, 0.1) solid"
  },
  notchedOutline: {
    borderColor: "white",
    boxShadow: "0px 0px 10px -2px rgba(117,156,252,0.3)"
  }
}));

export default useStyles;
