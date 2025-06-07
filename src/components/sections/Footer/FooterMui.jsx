import React from "react";
import { Box, Typography, Link } from "@mui/material";

const FooterMui = ({text, PP, Tos, Cu}) => {
  return (
    <Box
      sx={{
        backgroundColor: "grey.900",
        color: "grey.300",
        textAlign: "center",
        py: 3,
      }}
    >
      <Typography variant="body2" gutterBottom>
        &copy; {new Date().getFullYear()} {text}
      </Typography>
      <Typography variant="body2">
        <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
          {PP}
        </Link>
        |
        <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
          {Tos}
        </Link>
        |
        <Link href="#" color="inherit" underline="hover" sx={{ mx: 1 }}>
          {Cu}
        </Link>
      </Typography>
    </Box>
  );
};

export default FooterMui;
