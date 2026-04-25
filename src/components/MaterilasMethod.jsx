"use client";
import * as React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function MaterilasMethod() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Box>
      <Paper
        sx={{
          pl: 2,
          pt: 3,
          pb: 1,
          mb: 0,
          borderRadius: 0,
          bgcolor: "primary.main",
          color: "background.paper",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Methodology & Analysis
        </Typography>
        <Typography variant="body2">
          The mathematical formulas used in this application are based on{" "}
          <Link
            href="https://iopscience.iop.org/article/10.1088/1755-1315/1584/1/012036#:~:text=is%20Open%20access-,Estimation%20of%20Genetic%20Parameters%20for%20Growth%20Traits%20of%20Garut%20Sheep,1315/1584/1/012036"
            color="inherit"
            target="_blank"
            rel="noopener"
          >
            Najmi et al. (2026)
          </Link>{" "}
          .
        </Typography>
      </Paper>

      {/* --- Accordion 1: Heritability --- */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        sx={{ borderRadius: 0, mb: 0 }}
        elevation={0}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">1. Heritability Analysis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The estimation of heritability values used in this app is halfsib
            correlation method, the heritability formula with the halfsib
            correlation method according to the instructions of Najmi et al.
            (2026) which is:
          </Typography>
          <BlockMath math="h^{2}=4t" />
          <BlockMath math="t=\frac{\sigma_{S}^{2}}{\sigma_{S}^{2}+\sigma_{W}^{2}}" />{" "}
          <BlockMath math="K=\frac{1}{s-1}(n-\frac{\Sigma n_{i}^{2}}{n})" />
          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
            Standard Error:
          </Typography>
          <BlockMath math="SE(h^{2})=4\sqrt{\frac{2(1-t)^{2}[1+(k-1)(t)]^{2}}{k(k-1)-(S-1)}}" />{" "}
          <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
            Where, <InlineMath math="\sigma_{S}^{2}" /> is the variance of sire;{" "}
            <InlineMath math="\sigma_{w}^{2}" /> is the variance of progeny; k
            is the constant value; S is the number of sire; n is the number of
            progeny; <InlineMath math="n_{1}" /> is the number of progeny per
            sire and SE is the standard error.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* --- Accordion 2: EBV --- */}
      <Accordion
        onChange={handleChange("panel2")}
        expanded={expanded === "panel2"}
        sx={{ borderRadius: 0, mb: 0 }}
        elevation={0}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">
            2. Estimated Breeding Value (EBV)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Estimation of breeding value (EBV) for sires and EBV for their
            progenies were calculated using a mathematical formula referring
            Najmi et al. (2026) as follows:
          </Typography>
          <BlockMath math="EBV_{Ram}=\frac{2nh^{2}}{4+(n-1)h^{2}}(\bar{p}-\bar{\bar{p}})+\bar{\bar{p}}" />{" "}
          <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
            Where, <InlineMath math="h^{2}" /> is the heritability; n is the
            number of progenies per sire; <InlineMath math="\bar{P}" /> is the
            average growth traits of progeny;{" "}
            <InlineMath math="\bar{\bar{P}}" /> is the average of growth traits
            in progeny population and P is the individual growth traits.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* --- Accordion 3: Genetic Correlation --- */}
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
        sx={{ borderRadius: 0, mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">3. Genetic Correlation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Estimation of genetic correlation between birth weight and weaning
            weight were calculated according to Najmi et al. (2026) as follows:
          </Typography>
          <BlockMath math="r_{g}=\frac{4cov_{S}}{\sqrt{(4\sigma_{S1}^{2})(4\sigma_{S2}^{2})}}" />{" "}
          <BlockMath math="SE_{(r_{G)}}=\sqrt{Var(r_{G})}" />
          <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
            Where, <InlineMath math="r_{g}" /> is the genetic correlation; Covs
            is the number of progeny per sire;{" "}
            <InlineMath math="\sigma_{S1}^{2}" /> is the variance of first trait
            and <InlineMath math="\sigma_{S2}^{2}" /> variance of second trait.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
