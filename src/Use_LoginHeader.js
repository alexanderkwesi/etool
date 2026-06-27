import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Engineering } from "@mui/icons-material";
import Logo from './image/favicon-png.png';

const AuthHeader = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        color: "#333",
        py: 2,
      }}
    >
      <Toolbar>
       <img src={Logo} width='40px' height='40px' />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#6a0dad" }}
        >
         
        </Typography>
        <Box>
          <Button color="inherit" sx={{ color: "#666" }} href="/home">
            Home
          </Button>
          <Button color="inherit" sx={{ color: "#666" }} href="/features">
            Features
          </Button>
          <Button color="inherit" sx={{ color: "#666" }} href="/faq">
            FAQ
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AuthHeader;
