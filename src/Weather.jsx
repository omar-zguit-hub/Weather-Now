import {
  Box,
  Button,
  Container,
  createTheme,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";

import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

function Weather() {
  // ===== FONTS THEME PROVIDER =====
  const theme = createTheme({
    typography: {
      fontFamily: ["Aref"],
    },
  });

  // ===== HOOKS =====
  // useState
  const cities = [
    { name: "Rabat", lat: "34.020882", lon: "-6.841650" },
    { name: "Salé", lat: "34.040000", lon: "-6.800000" },
    { name: "Kénitra", lat: "34.261000", lon: "-6.580200" },
    { name: "Casablanca", lat: "33.573110", lon: "-7.589843" },
    { name: "Settat", lat: "33.001000", lon: "-7.616000" },
    { name: "Mohammedia", lat: "33.686600", lon: "-7.382800" },
    { name: "Marrakech", lat: "31.629472", lon: "-7.981084" },
    { name: "Safi", lat: "32.299400", lon: "-9.237200" },
    { name: "Essaouira", lat: "31.508510", lon: "-9.759300" },
    { name: "Fes", lat: "34.033126", lon: "-5.000000" },
    { name: "Meknes", lat: "33.873000", lon: "-5.540000" },
    { name: "Taza", lat: "34.210000", lon: "-4.010000" },
    { name: "Tangier", lat: "35.759518", lon: "-5.833954" },
    { name: "Tetouan", lat: "35.571000", lon: "-5.372000" },
    { name: "Chefchaouen", lat: "35.168369", lon: "-5.269780" },
    { name: "Al Hoceima", lat: "35.244600", lon: "-3.931700" },
    { name: "Agadir", lat: "30.427754", lon: "-9.598107" },
    { name: "Taroudant", lat: "30.471000", lon: "-8.876000" },
    { name: "Tiznit", lat: "29.697400", lon: "-9.731600" },
    { name: "Ouarzazate", lat: "30.933334", lon: "-6.900000" },
    { name: "Errachidia", lat: "31.931400", lon: "-4.423400" },
    { name: "Tinghir", lat: "31.520464", lon: "-5.530234" },
    { name: "Oujda", lat: "34.681400", lon: "-1.908600" },
    { name: "Nador", lat: "35.168100", lon: "-2.933500" },
    { name: "Berkane", lat: "34.920000", lon: "-2.320000" },
    { name: "Laayoune", lat: "27.153600", lon: "-13.203300" },
    { name: "Dakhla", lat: "23.684800", lon: "-15.957000" },
  ];
  const [selectedCity, setSelectedCity] = useState("Tinghir");

  const [date, setDate] = useState("");
  const [locale, setLocale] = useState("ar");
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({
    temp: null,
    temp_max: null,
    temp_min: null,
    description: "",
    icon: null,
  });

  useEffect(() => {
    dayjs.locale(locale);
    i18n.changeLanguage(locale);
    const controller = new AbortController();

    async function getWeather() {
      const selected = cities.find((c) => c.name == selectedCity);
      if (!selected) return;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${selected.lat}&lon=${selected.lon}&appid=dfd85af7a3e8118e37003df6b1fd61c3&units=metric`,
          {
            signal: controller.signal,
          },
        );

        const FormatNumber = (n) => {
          return locale == "ar" ? toArabicNumbers(n) : n;
        };

        const date = dayjs().format("DD/MM/YYYY");
        const displayDate = locale === "ar" ? toArabicNumbers(date) : date;

        setData({
          temp: FormatNumber(Math.round(response.data.main.temp)),
          temp_max: FormatNumber(Math.round(response.data.main.temp_max)),
          temp_min: FormatNumber(Math.round(response.data.main.temp_min)),
          description: response.data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
        });
        setDate(displayDate);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.error(error);
      }
    }

    getWeather();

    return () => {
      controller.abort();
    };
  }, [selectedCity, locale]);

  // ========= HANDLERS =========

  // translation
  function handleChangeLanguage() {
    if (locale == "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      dayjs.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      dayjs.locale("en");
    }
  }
  // TO ARABIC NUMBERS
  function toArabicNumbers(num) {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(num).replace(/\d/g, (d) => arabicDigits[d]);
  }

  const filteredCity = cities.find((c) => c.name === selectedCity);
  console.log("filteredCity  :", filteredCity);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        disableGutters
        dir={locale === "ar" ? "rtl" : "ltr"}
        sx={{
          minHeight: "100vh",
          bgcolor: "#081f4d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Grid
          sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: "28px",
            overflow: "hidden",
            background: "linear-gradient(180deg, #210068 0%, #081f4d 100%)",
            boxShadow: "0 30px 60px rgba(0,0,0,.45)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                opacity: 0.85,
                fontSize: {
                  xs: "25px",
                  sm: "30px",
                  md: "45px",
                },
              }}
            >
              {t("choise a city")}
            </Typography>

            <FormControl sx={{ minWidth: 160 }}>
              <NativeSelect
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                sx={{
                  color: "#fff",
                  "& option": {
                    color: "#000",
                  },
                }}
              >
                {cities.map((c, i) => (
                  <option key={i} value={c.name}>
                    {t(c.name)}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Box>

          {/* TOP INFO */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleChangeLanguage}
              sx={{
                borderColor: "rgba(255,255,255,0.3)",
                color: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              {locale === "en" ? "Arabic" : "English"}
            </Button>

            <Typography
              sx={{
                opacity: 0.75,
                fontSize: {
                  xs: "25px",
                  sm: "30px",
                  md: "40px",
                },
              }}
            >
              {date}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #ffffff, #2f58d5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: {
                  xs: "35px",
                  sm: "40px",
                  md: "55px",
                },
              }}
            >
              {t(filteredCity.name)}
            </Typography>
          </Box>

          {/* BODY */}
          <Box sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 4,
              }}
            >
              {/* ICON */}
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <WbSunnyIcon
                  sx={{
                    fontSize: { xs: 140, sm: 220 },
                    color: "#3f6fd1",
                    opacity: 0.9,
                  }}
                />
              </Box>

              {/* WEATHER INFO */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "60px",
                      sm: "70px",
                      md: "80px",
                    },
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <img src={data.icon} width={72} alt="" />
                  {data.temp}°
                </Typography>

                <Typography
                  sx={{
                    opacity: 0.8,
                    mt: 1,
                    fontSize: {
                      xs: "25px",
                      sm: "30px",
                      md: "45px",
                    },
                  }}
                >
                  {t(data.description)}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    mt: 3,
                    opacity: 0.75,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "20px",
                        sm: "25px",
                        md: "30px",
                      },
                    }}
                  >
                    {t("Max")} : {data.temp_max}°
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "20px",
                        sm: "25px",
                        md: "30px",
                      },
                    }}
                  >
                    {t("Min")} : {data.temp_min}°
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Weather;
