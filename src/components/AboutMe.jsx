"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Mail as MailIcon,
  Code as CodeIcon,
  AutoAwesome as TechIcon,
  Grass as AgriIcon,
  HistoryEdu as EducationIcon,
  Instagram,
} from "@mui/icons-material";
import {
  Copyright,
  FolderKanban,
  GraduationCapIcon,
  MapPin,
  UserRound,
} from "lucide-react";

function AboutMe() {
  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ pt: 5 }}>
        <Typography
          variant="h3"
          id="about"
          sx={{ display: "flex", justifyContent: "center", mb: 1 }}
        >
          Profile
        </Typography>
        <Divider variant="middle" sx={{ width: "60%", mx: "auto" }} />
      </Box>
      <Box sx={{ bgcolor: "background.default", pt: 3, pb: 0 }}>
        <Container maxWidth="lg">
          {/* HERO SECTION */}
          <Grid container spacing={6} sx={{ mb: 10 }}>
            <Stack direction="row" spacing={2}>
              <Grid size={6}>
                <Stack spacing={2}>
                  <Chip
                    icon={<AgriIcon />}
                    label="Animal Science Graduate & Web Developer"
                    color="primary"
                    variant="outlined"
                    sx={{ width: "fit-content", fontWeight: "bold" }}
                  />
                  <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="800"
                    gutterBottom
                  >
                    Bridging{" "}
                    <Typography
                      variant="inherit"
                      component="span"
                      fontWeight="800"
                      gutterBottom
                      color="primary"
                      sx={{ display: "inline-block" }}
                    >
                      Agriculture
                    </Typography>{" "}
                    and{" "}
                    <Typography
                      variant="inherit"
                      component="span"
                      fontWeight="800"
                      gutterBottom
                      color="secondary"
                      sx={{ display: "inline-block" }}
                    >
                      Technology
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    fontSize="1.1rem"
                  >
                    Hello, I&apos;m <strong>Najmi</strong>. As an Animal Science
                    graduate (S.Pt.), I have a profound understanding of
                    livestock management. Recognizing the power of digital
                    solutions in modern agriculture, I have dedicated myself to
                    mastering web development to build impactful agritech
                    applications.
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<LinkedInIcon />}
                      sx={{ textTransform: "none" }}
                      href="http://www.linkedin.com/in/najmi-5b2966377"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  src="/heritability/about-image.png"
                  sx={{
                    width: { xs: 300, md: 450 },
                    height: { xs: 300, md: 450 },
                    borderRadius: 4,
                    boxShadow: "0px 10px 10px var(--mui-palette-primary-main)",
                    border: "4px solid var(--mui-palette-background-default)",
                  }}
                />
              </Grid>
            </Stack>
          </Grid>
          <Divider variant="middle" />
          {/* SKILLS & DOMAIN SECTION */}
          <Stack sx={{ mt: 1 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ display: "flex", justifyContent: "center" }}
              gutterBottom
            >
              Background & Expertise
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 6, display: "flex", justifyContent: "center" }}
            >
              Combining domain knowledge in animal husbandry with modern web
              development technologies.
            </Typography>
          </Stack>

          <Grid container spacing={4} sx={{ mb: 10 }}>
            <Grid size={6}>
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  bgcolor: "background.paper",
                  borderRadius: 4,
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ display: "flex", gap: 2 }}
                >
                  <UserRound />
                  Personal Data
                </Typography>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ display: "flex", gap: 2 }}
                    >
                      <GraduationCapIcon />
                      Bachelor of Animal Science (S.Pt)
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textDisabled"
                      sx={{ lineHeight: 1 }}
                    >
                      Department of Animal Science, Faculty of Agriculture,
                      Djuanda University, Bogor, West Java, Indonesia, 2025
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ display: "flex", gap: 2 }}
                    >
                      <MapPin />
                      Location
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textDisabled"
                      sx={{ lineHeight: 1 }}
                    >
                      South Jakarta, Indonesia
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ display: "flex", gap: 2 }}
                    >
                      <FolderKanban /> Current Focus
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textDisabled"
                      sx={{ lineHeight: 1 }}
                    >
                      Independent Software Development & Agritech Research
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={6}>
              <Stack spacing={5} sx={{ p: 4 }}>
                <Box>
                  <Typography
                    fontWeight="bold"
                    color="textSecondary"
                    variant="h5"
                  >
                    Web Development
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 2 }}
                  >
                    {["Next.js", "HTML", "CSS", "Javascript", "MUI", "Git"].map(
                      (skill) => (
                        <Chip
                          size="medium"
                          key={skill}
                          label={<Typography>{skill}</Typography>}
                          sx={{ borderRadius: 1 }}
                        />
                      ),
                    )}
                  </Stack>
                </Box>
                <Box>
                  <Typography fontWeight="bold" color="primary" variant="h5">
                    Domain Knowledge
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {[
                      "Livestock Genetics",
                      "Animal Breeding",
                      "Data Analysis",
                      "Farm Management",
                    ].map((skill) => (
                      <Chip
                        size="medium"
                        key={skill}
                        label={<Typography>{skill}</Typography>}
                        color="primary"
                        variant="soft"
                        sx={{ borderRadius: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ p: 0 }}>
        {/* CALL TO ACTION */}
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "primary.main",
            borderRadius: 0,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Let&apos;s Build Something Together
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            I am actively seeking opportunities as a Junior Front-End Developer
            or roles in Agritech startups where I can leverage my unique
            background. If you are interested, feel free to reach out.
          </Typography>
          <Stack
            direction={"row"}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ py: 0 }}
              startIcon={<MailIcon />}
              href="mailto:najmibasalamah@gmail.com"
            >
              Email Me
            </Button>
            <IconButton
              href="https://github.com/Najmi-nofel"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="secondary"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/in/najmi-5b2966377"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="secondary"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/najmibslmh/"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              color="secondary"
            >
              <Instagram />
            </IconButton>
          </Stack>
        </Paper>
        <Paper
          sx={{
            p: 4,
            borderRadius: 0,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "primary.dark",
            color: "secondary.dark",
          }}
        >
          <Copyright />{" "}
          <Typography>
            2026 Najmi. Built with Passion, Code, and Animal Science.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default AboutMe;
