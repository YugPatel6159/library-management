import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // Implement your login logic here
    // console.log("Username:", username, "Password:", password);

    // login logic here
    // check if username and password match from database using axios
    axios.post("http://localhost:3000/login", { email, password }).then(
      (response) => {
        console.log("Login successful:", response.data);
        // store token in local storage
        console.log(response.data.data.to);
        localStorage.setItem("token", response.data.token);
        if (response.data.data.Token === "admin") {
          navigate("/admin");
        }
        if (response.data.data.Token === "user") {
          navigate("/home");
        }
      },
      (error) => {
        console.error("Login failed:", error);
        alert("Invalid username or password. Please try again.");
      }
    )

    // navigate("/home");
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={10} sm={6} md={4} lg={3}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="email"
              variant="outlined"
              fullWidth
              required
              size="small"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              size="small"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              style={{ marginTop: 16 }}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" style={{ marginTop: 16 }} onClick={() => navigate("/forgotpassword")}>
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate("/register")}
                >
                  Not a Member? Sign up
                </Link>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
