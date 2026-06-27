import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Use_SideBar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userPlan = "basic"; // This should come from your state/context

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userPlan={userPlan}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
