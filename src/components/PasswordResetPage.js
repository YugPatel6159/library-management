import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = (event) => {
    event.preventDefault();
    console.log("Email:", email);

    // Make an API call to request the OTP
    axios
      .post("http://localhost:3000/request-otp", { email }) // Change here to port 3000
      .then((response) => {
        console.log("Response:", response.data);
        alert("OTP sent! Check your email.");
        setIsOtpSent(true);
        // setOtpVerified(true);
        // navigate("/reset"); // Redirect to the page where they can enter the OTP
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to send OTP. Please try again.");
      });
  };

  const handleMatchOtp = (event) => {
    event.preventDefault();
    console.log("OTP:", otp);

    // Make an API call to verify the OTP
    axios
      .post("http://localhost:3000/verify-otp", { email, otp }) // Change here to port 3000
      .then((response) => {
        console.log("Response:", response.data);
        // setIsOtpSent(false);
        setOtpVerified(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to verify OTP. Please try again.");
      });
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();
    console.log("New Password:", newPassword);

    // Adjust the endpoint to match the server's endpoint
    axios.put("http://localhost:3000/reset-password", {
        email,
        password: newPassword,
    })
    .then((response) => {
        console.log("Response:", response.data);
        alert("Password changed successfully!");
        navigate("/login");
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to change password. Please try again.");
    });
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
          <Typography variant="h5" component="h1" gutterBottom>
            Reset Password
          </Typography>
          {
            // First check if OTP has been verified
            otpVerified ? (
              // OTP verified, show fields to enter new password
              <>
                <TextField
                  label="New Password"
                  variant="outlined"
                  type="password" // Use type="password" to hide input
                  size="small"
                  fullWidth
                  required
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  label="Confirm New Password"
                  variant="outlined"
                  type="password" // Use type="password" to hide input
                  size="small"
                  fullWidth
                  required
                  margin="normal"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  style={{ marginTop: 16 }}
                  onClick={handlePasswordChange}
                >
                  Change Password
                </Button>
              </>
            ) : isOtpSent ? (
              // OTP has been sent but not yet verified, show OTP input
              <>
                <TextField
                  label="Otp"
                  variant="outlined"
                  type="number"
                  size="small"
                  fullWidth
                  required
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  style={{ marginTop: 16 }}
                  onClick={handleMatchOtp}
                >
                  Verify OTP
                </Button>
              </>
            ) : (
              // No OTP sent, show email input to request OTP
              <>
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  size="small"
                  fullWidth
                  required
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  style={{ marginTop: 16 }}
                  onClick={handlePasswordReset}
                >
                  Send OTP
                </Button>
              </>
            )
          }

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                style={{ marginTop: 16 }}
                onClick={() => navigate("/login")}
              >
                Remember your password? Login
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default PasswordResetPage;
