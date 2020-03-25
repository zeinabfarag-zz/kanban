import React, { useState, useEffect } from "react";
import { Container, TextField, Grid, Typography } from "@material-ui/core";
import Button from "../components/BlueButton";
import useStyles from "../themes/AuthStyles";
import { Link } from "react-router-dom";
import { login, loggedIn, getCurrentBoard } from "../AuthService";
import { handleError } from "../utils/handleAlerts";

const SignUp = props => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let dashboardId = getCurrentBoard();

  const redirect = () => {
    loggedIn() &&
      dashboardId &&
      props.history.push(`/dashboards/${dashboardId}`);
  };

  const signup = () => {
    props.history.push(`/dashboards/createboard`);
  };

  useEffect(() => {
    redirect();
  });

  const handleSignUp = e => {
    e.preventDefault();
    login("signup", email, password)
      .then(() => {
        localStorage.removeItem("dashboard");
      })
      .then(() => signup())
      .catch(err => {
        handleError(err);
      });
  };

  return (
    <Grid container className={classes.root}>
      <Grid item md={6} className={classes.image}></Grid>
      <Grid item xs={12} md={6}>
        <Container className={classes.paper}>
          <div>
            <Typography variant="h1" className={classes.title}>
              Sign up to Kanban
            </Typography>

            <form onSubmit={handleSignUp}>
              <TextField
                type="email"
                label="Enter Email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                InputProps={{
                  classes: {
                    root: classes.input,
                    notchedOutline: classes.notchedOutline
                  },
                  inputProps: {
                    required: true
                  }
                }}
              />

              <TextField
                type="password"
                label="Create password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                InputProps={{
                  classes: {
                    root: classes.input,
                    input: classes.password,
                    notchedOutline: classes.notchedOutline
                  },
                  inputProps: {
                    required: true,
                    pattern: ".{6,}",
                    title: "Password must be 6 characters or longer "
                  }
                }}
              />

              <Button>Sign up</Button>
            </form>
          </div>
        </Container>

        <Container className={classes.footer}>
          <Typography paragraph variant="h3">
            Already have an account?
          </Typography>

          <Typography variant="h3">
            <Link to="/signin">Login</Link>
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
};

export default SignUp;
