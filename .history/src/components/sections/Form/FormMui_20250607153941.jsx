"use client";
import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import {
  GitHub as GitHubIcon,
  Google as GoogleIcon,
  Favorite as OnlyFansIcon,
} from "@mui/icons-material";

const formFields = [
  { id: "firstname", label: "First Name", type: "text", placeholder: "Tyler" },
  { id: "lastname", label: "Last Name", type: "text", placeholder: "Durden" },
  { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••" },
  { id: "twitterpassword", label: "Twitter Password", type: "password", placeholder: "••••••••" },
];

const FormMui = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());
    console.log("Form submitted:", formValues);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome to Aceternity
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Login to aceternity if you can, because we don&apos;t have a login flow yet.
        </Typography>

        <Grid container spacing={2}>
          {formFields.map(({ id, label, type, placeholder }) => (
            <Grid item xs={12} sm={id === "firstname" || id === "lastname" ? 6 : 12} key={id}>
              <TextField
                fullWidth
                id={id}
                name={id}
                label={label}
                type={type}
                placeholder={placeholder}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Sign up →
        </Button>

        <Divider sx={{ my: 4 }} />

        <Stack spacing={2}>
          <OAuthButton icon={<GitHubIcon />} label="GitHub" />
          <OAuthButton icon={<GoogleIcon />} label="Google" />
          <OAuthButton icon={<OnlyFansIcon />} label="OnlyFans" />
        </Stack>
      </Box>
    </Container>
  );
}
export default FormMui;

function OAuthButton({ icon, label }) {
  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={icon}
      sx={{
        textTransform: "none",
        justifyContent: "flex-start",
      }}
    >
      Continue with {label}
    </Button>
  );
}
