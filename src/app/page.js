"use client";
import {
  Autocomplete,
  TextField,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Avatar,
  CardActions,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  InputLabel,
} from "@mui/material";
import PropTypes, { array, object } from "prop-types";
import * as XLSX from "xlsx";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  createTheme,
  ThemeProvider,
  styled,
  useTheme,
  useColorScheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  AccountCircle,
  ArrowLeft,
  ArrowLeftRounded,
  RocketLaunch,
} from "@mui/icons-material";
import DarkModeToggle from "@/components/DarkModeToggle";

import demoData from "@/data/demo_data.json";
import HiddenInput from "@/components/HiddenInput";
import DataChart from "../lib/DataChart.js";
import DualAxisAreaChart from "@/components/Line2Y";

import MyFilterTable from "@/components/MyFilterTable.jsx";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import MyAnalytics from "@/components/MyAnalytics.jsx";

import AboutMe from "@/components/AboutMe.jsx";
import MaterilasMethod from "@/components/MaterilasMethod.jsx";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
// format theme
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#67C090",
      light: "#215B63",
      dark: "#124170",
    },
    secondary: {
      main: "#00e2f5",
      light: "rgba(51,225,247,0.86)",
    },
  },
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [value, setValue] = useState(0);
  const [fileExcel, setFileExcel] = useState([]);
  const [fileName, setFileName] = useState("No file chosen.");
  const [isLoading, setIsLoading] = useState(false);
  const [traitValues, setTraitValues] = useState([]);
  const [faktorSelect, setFaktorSelect] = useState("");
  // menu dropdown
  const [open, setOpen] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const tableContainerRef = useRef(null);

  const columns = fileExcel[0] ? Object.keys(fileExcel[0]) : [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // tab selection
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // open menu
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  // close menu
  const handleCloseMenu = () => {
    setOpen(false);
  };
  const isOpen = Boolean(open);

  const chart = useMemo(() => {
    if (fileExcel.length === 0) return null;
    return DataChart(fileExcel, faktorSelect, traitValues);
  }, [fileExcel, faktorSelect, traitValues]);

  // input file handle
  const inputFileHandle = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileName("No file chosen.");
      return;
    }

    setFaktorSelect("");
    setTraitValues([]);
    setFileName(file.name);
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, {
          defval: null,
          raw: false,
        });

        setFileExcel(json);
        setTraitValues([]);
      } catch (error) {
        console.error("Error parsing file:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  // analys button handle
  const handleAnalys = () => {
    setIsLoading(true);
    setIsAnalyzing(true);
    try {
      console.log("Analysis akan dilakukan pada kolom:", traitValues);
    } catch (e) {
      console.error(`Error during analysis:${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  // demo data handle
  const demoFileHandle = async () => {
    setIsLoading(true);

    try {
      setFileName("demo_data.json");
      setFileExcel(demoData);
      setFaktorSelect("sire");
      setTraitValues(["birth_weight", "weaning_weight", "average_daily_gain"]);
      setIsAnalyzing(true);
    } catch (e) {
      console.error("Error fetching demo data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />{" "}
          {/* Menghilangkan margin default dan mengatur bg color */}
          <Box sx={{ width: "100%" }}>
            {/* Navbar Tabs */}
            <Box
              className="gap-2 items-end justify-between px-2"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                bgcolor: theme.palette.secondary.light,
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.secondary.contrastText,
                }}
                variant="h4"
              >
                Livstocklis
              </Typography>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                indicatorColor="primary"
              >
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="Table" {...a11yProps(1)} />
                <Tab
                  label="Analytics"
                  {...a11yProps(2)}
                  disabled={!isAnalyzing}
                />
                <Tab label="About" {...a11yProps(3)} />
              </Tabs>
              <Button
                id="dropdown-menu"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                disableElevation
                onClick={handleOpenMenu}
              >
                <Avatar alt="Najmi" src="/#" className="my-auto" />
              </Button>
              <Menu
                anchorEl={open}
                id="demo-positioned-menu"
                open={isOpen}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      minWidth: 150,
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    setValue(3);
                  }}
                  component="a"
                  href="#about"
                  sx={{ py: 1.2, px: 2, gap: 1.5 }}
                >
                  <AccountCircle
                    sx={{ fontSize: 22, color: "action.active" }}
                  />
                  <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <Divider />

                <List sx={{ py: 0, px: 0 }}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <Typography variant="caption">Theme Setting</Typography>
                    <DarkModeToggle />
                  </ListItem>
                </List>
              </Menu>
            </Box>
            {/* Tab Overview */}
            <CustomTabPanel value={value} index={0}>
              {/* Upload & select data */}
              <Box sx={{ p: 3 }}>
                <Paper
                  elevation={4}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    minHeight: "64px",
                    borderRadius: 6,
                  }}
                >
                  <div className="flex gap-6">
                    <div className="flex items-center gap-3 p-2">
                      {fileExcel.length > 0 ? (
                        ""
                      ) : (
                        <Button
                          variant="outlined"
                          color="success"
                          startIcon={<RocketLaunch />}
                          onClick={demoFileHandle}
                          sx={{
                            height: "50px",
                            borderRadius: "50px",
                            textTransform: "none",
                          }}
                        >
                          Use demo data
                        </Button>
                      )}
                      <HiddenInput onChange={inputFileHandle} />
                      <span
                        className={`text-sm ${fileName === "No file chosen." ? "text-gray-500" : "text-blue-600 font-medium"}`}
                      >
                        {fileName}
                      </span>
                      {isLoading && (
                        <span className="text-sm text-gray-500">
                          Loading...
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 p-2">
                      {/* Fakto Select */}
                      {fileExcel.length > 0 && (
                        <Autocomplete
                          options={columns}
                          getOptionLabel={(option) => option || ""}
                          value={faktorSelect}
                          onChange={(event, newValue) => {
                            setFaktorSelect(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Factor"
                              variant="outlined"
                              size="small"
                            />
                          )}
                          sx={{
                            width: 200,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "50px",
                              minHeight: "50px",
                              display: "flex",
                              alignItems: "center", // Pusatkan konten secara vertikal
                              paddingTop: "0px !important",
                              paddingBottom: "0px !important",
                              "& fieldset": {
                                borderRadius: "50px",
                              },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "50px", // Pastikan outline-nya juga ikut melengkung
                            },
                            "& .MuiInputLabel-shrink": {
                              top: "0px",
                            },
                          }}
                          disablePortal
                        />
                      )}
                      {/* Traits select */}
                      {fileExcel.length > 0 && (
                        <Autocomplete
                          multiple
                          options={columns}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option}
                          value={traitValues}
                          onChange={(event, newValue) => {
                            setTraitValues(newValue);
                          }}
                          renderValue={(value, getItemProps) =>
                            value.map((option, index) => {
                              const { key, ...itemProps } = getItemProps({
                                index,
                              });
                              return (
                                <Chip
                                  variant="outlined"
                                  label={option}
                                  key={key}
                                  {...itemProps}
                                  size="small"
                                />
                              );
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Select Traits"
                            />
                          )}
                          sx={{
                            width: 400,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "50px",
                              minHeight: "50px",
                              paddingTop: "0px",
                              paddingBottom: "0px",
                              display: "flex",
                              alignItems: "center", // Pusatkan konten secara vertikal

                              "& fieldset": {
                                borderRadius: "50px",
                              },
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderRadius: "50px", // Pastikan outline-nya juga ikut melengkung
                            },
                            "& .MuiInputLabel-shrink": {
                              top: "0px",
                            },
                          }}
                          disablePortal
                        />
                      )}
                      {fileExcel.length > 0 && (
                        <Button
                          variant="outlined"
                          color="success"
                          disabled={!faktorSelect || traitValues.length === 0}
                          startIcon={<RocketLaunch />}
                          onClick={handleAnalys}
                          sx={{
                            height: "50px",
                            borderRadius: "50px",
                            textTransform: "none",
                          }}
                        >
                          Analys
                        </Button>
                      )}
                    </div>
                  </div>

                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      mr: 3,
                      mb: 1,
                    }}
                  >
                    {fileExcel.length > 0
                      ? ""
                      : `📁 Please upload your data file (.xlsx, .xls, .csv) / use demo data`}
                  </Typography>
                </Paper>
                {/* Chart */}
                {isAnalyzing && (
                  <DualAxisAreaChart
                    result={chart}
                    faktor={faktorSelect}
                    traits={traitValues}
                  />
                )}
              </Box>
            </CustomTabPanel>
            {/* Tab Table */}
            <CustomTabPanel value={value} index={1}>
              <Box sx={{ p: 3 }}>
                {fileExcel.length > 0 ? (
                  <MyFilterTable data={fileExcel} />
                ) : (
                  <Paper elevation={6} sx={{ borderRadius: 0 }}>
                    <Typography variant="h6" sx={{ p: 2 }}>
                      No data loaded. Please upload a file.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CustomTabPanel>
            {/* Tab Analitics */}
            <CustomTabPanel value={value} index={2}>
              <Box sx={{ p: 3 }}>
                <MyAnalytics
                  result={fileExcel}
                  fator={faktorSelect}
                  tratList={traitValues}
                />
              </Box>
            </CustomTabPanel>
            {/* Tab About */}
            <CustomTabPanel value={value} index={3}>
              <MaterilasMethod />
              <AboutMe />
            </CustomTabPanel>
          </Box>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </div>
  );
}
