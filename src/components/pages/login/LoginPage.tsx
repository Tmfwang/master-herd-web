import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// @ts-ignore
import icon from "../../../assets/iconLandscape.png";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Animated } from "react-animated-css";

const theme = createTheme();

interface LoginPageProps {}

// Denne login-siden er en egenmodifisert versjon av en gratis login-mal fra Material UI:
// https://mui.com/getting-started/templates/

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = React.useState(false);

  React.useEffect(() => {
    const authToken = window.sessionStorage.getItem("authToken");

    if (authToken) {
      navigate("/tilsynsturer");
    }
  }, []);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axios
      .post(
        "https://master-herd-api.herokuapp.com/user/",
        {
          email: data.get("email")?.toString().toLowerCase(),
          full_name: data.get("fullName")?.toString(),
          gaards_number: data.get("gaardsNumber")?.toString().toUpperCase(),
          bruks_number: data.get("bruksNumber")?.toString(),
          municipality: data.get("municipality")?.toString(),
          password1: data.get("password1")?.toString(),
          password2: data.get("password2")?.toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (response.status === 200) {
          alert(response.status);
        } else {
          alert("K" + response.status);
        }
      })
      .catch((e) => {
        alert(e.response.data.error);
      });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axios
      .post(
        "https://master-herd-api.herokuapp.com/api-token-auth/",
        {
          username:
            // @ts-ignore
            data.get("email")?.toString().toLowerCase() +
            // @ts-ignore
            data.get("gaardsNumber")?.toString().toUpperCase(),
          password: data.get("password")?.toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (response.status === 200) {
          window.sessionStorage.setItem("authToken", response.data.token);
          navigate("/tilsynsturer");
        } else {
          alert("K" + response.status);
        }
      })
      .catch((e) => {
        alert(e.response.status);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Animated
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            isVisible={!isRegistering}
            // style={{ position: "absolute" }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                width={200}
                src={icon}
                style={{ marginRight: "-15px", marginBottom: "40px" }}
              ></img>
              <Typography component="h1" variant="h5">
                Logg inn
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleLogin}
                sx={{ mt: 1, width: "80%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-post"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="gaardsNumber"
                  label="Gårdsnummer"
                  name="gaardsNumber"
                  autoComplete="gaardsNumber"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Passord"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Logg inn
                </Button>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Link
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsRegistering(true)}
                      variant="body2"
                    >
                      {"Har du ikke en konto? Registrer deg her"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Animated>

          <Animated
            animationIn="slideInRight"
            animationOut="slideOutRight"
            isVisible={isRegistering}
            animateOnMount={false}
            style={{ marginTop: "-550px" }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                width={200}
                src={icon}
                style={{ marginRight: "-15px", marginBottom: "40px" }}
              ></img>

              <Typography component="h1" variant="h5">
                Registrer ny bruker
              </Typography>
              <Box
                component="form"
                noValidate
                // @ts-ignore
                onSubmit={(event) => {
                  handleRegister(event);
                }}
                sx={{ mt: 1, width: "80%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-post"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="fullName"
                  label="Fullt Navn"
                  id="fullName"
                  autoComplete="name"
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    name="gaardsNumber"
                    label="Gårdsnummer"
                    id="gaardsNumber"
                    autoComplete="gaardsNumber"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    name="bruksNumber"
                    label="Bruksnummer"
                    id="bruksNumber"
                    autoComplete="bruksNumber"
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password1"
                    label="Passord"
                    type="password"
                    id="password1"
                    autoComplete="current-password"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password2"
                    label="Gjenta passord"
                    type="password"
                    id="password2"
                    autoComplete="current-password"
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Registrer bruker
                </Button>
                <Grid container>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Link
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsRegistering(false)}
                      variant="body2"
                    >
                      {"Har du allerede en konto? Logg inn her"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Animated>
        </Grid>

        <Grid
          style={{ zIndex: "99999" }}
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random/?sheep,lamb,farm)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;
