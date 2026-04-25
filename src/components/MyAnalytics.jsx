import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import HeeritabilityResult from "./HeeritabilityResult";
import estimateHeritability from "@/lib/heritability";
import CorrelationGeneticResult from "./CorrelationGeneticResult";
import estimateGeneticCorrelation from "@/lib/correlationGenetic";
import estimateBreedingValue, {
  breedingValueToTable,
} from "@/lib/breedingValue.js";
import BreedingValueResult from "./BreedingValueResult";
import DescriptiveAnalytics from "./DescriptiveAnalitycs";
import { CircleSlash } from "lucide-react";
import estimateDescriptiveAnalytics from "@/lib/descriptive";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

function MyAnalytics({ result, fator, tratList }) {
  const [value, setValue] = useState(0);
  const [heritabilityResult, setHeritabilityResult] = useState(null);
  const [geneticCorrelationResult, setGeneticCorrelationResult] =
    useState(null);
  const [breedingValue, setBreedingValue] = useState(null);
  const [descriptiveAnalyticsResult, setDescriptiveAnalyticsResult] =
    useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (result && fator && tratList && tratList.length > 0) {
      const heritability = estimateHeritability(result, fator, tratList);
      setHeritabilityResult(heritability);

      const genCorr = estimateGeneticCorrelation(result, fator, tratList);
      setGeneticCorrelationResult(genCorr);

      const bv = estimateBreedingValue(result, fator, tratList);
      setBreedingValue(breedingValueToTable(bv, fator));

      const desc = estimateDescriptiveAnalytics(result, fator, tratList);
      setDescriptiveAnalyticsResult(desc);
    }
  }, [result, fator, tratList]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: 224,
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Descriptive" {...a11yProps(0)} />
        <Tab label="Heritability" {...a11yProps(1)} />
        <Tab label="Genetic Correlation" {...a11yProps(2)} />
        <Tab label="Breeding Value" {...a11yProps(3)} />
      </Tabs>
      {/* Descriptive */}
      <CustomTabPanel value={value} index={0}>
        <DescriptiveAnalytics
          result={descriptiveAnalyticsResult}
          faktor={fator}
          traits={tratList}
        />
      </CustomTabPanel>
      {/* Heritability */}
      <CustomTabPanel value={value} index={1}>
        <HeeritabilityResult
          result={heritabilityResult}
          faktor={fator}
          traits={tratList}
        />
      </CustomTabPanel>
      {/* Correlation Genetic */}
      <CustomTabPanel value={value} index={2}>
        {tratList.length >= 2 ? (
          <CorrelationGeneticResult
            result={geneticCorrelationResult}
            faktor={fator}
            traits={tratList}
          />
        ) : (
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography
              color="warning"
              variant="body2"
              sx={{ display: "flex", gap: 2 }}
            >
              <CircleSlash /> Not enoughh trait to estimate.
            </Typography>
          </Paper>
        )}
      </CustomTabPanel>
      {/* Breeding Value */}
      <CustomTabPanel value={value} index={3}>
        <BreedingValueResult result={breedingValue} faktor={fator} />
      </CustomTabPanel>
    </Box>
  );
}

export default MyAnalytics;
