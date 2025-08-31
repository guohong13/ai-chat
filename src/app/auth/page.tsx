"use client";

import React, { useState } from "react";
import { Container, Paper, Tabs, Tab, Box } from "@mui/material";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function AuthPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSwitchToRegister = () => {
    setTabValue(1);
  };

  const handleSwitchToLogin = () => {
    setTabValue(0);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="登录" />
          <Tab label="注册" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        </TabPanel>
      </Paper>
    </Container>
  );
}
