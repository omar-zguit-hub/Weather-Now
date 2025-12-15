import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  createTheme,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

function Weather() {
  // API_URL
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=31.520464&lon=-5.530234&appid=dfd85af7a3e8118e37003df6b1fd61c3&units=metric`;

  // ===== FONTS THEME PROVIDER =====
  const theme = createTheme({
    typography: {
      fontFamily: ["Aref"],
    },
  });

  // ===== HOOKS =====
  // useState
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

  // useEffect
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  useEffect(() => {
    i18n.changeLanguage(locale);
    const controller = new AbortController();

    async function getWeather() {
      try {
        const response = await axios.get(API_URL, {
          signal: controller.signal,
        });

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

        console.log(response);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.error(error);
      }
    }

    getWeather();

    return () => {
      controller.abort();
    };
  }, [locale]);

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

  return (
    <ThemeProvider theme={theme}>
      <Container
        disableGutters
        maxWidth="sm"
        sx={{
          height: { xs: "auto", sm: "300px" },
          mt: { xs: 4, sm: "120px" },
          boxShadow: "0px 70px 50px #252525ff",
        }}
        dir={locale === "ar" ? "ltr" : "rtl"}
      >
        <Grid>
          {/* Header */}
          <Box
            component="section"
            sx={{
              p: 2,
              bgcolor: "#0e3585ff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: { xs: "auto", sm: "22%" },
              borderRadius: "20px 20px 0 0",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              sx={{ borderRadius: "15px", width: "80px" }}
              onClick={handleChangeLanguage}
            >
              {locale == "en" ? "Arabic" : "إنجليزي"}
            </Button>

            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                px: 2,
                fontSize: { xs: "1.7rem", sm: "2rem" },
              }}
            >
              {date}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                textAlign: "right",
                px: 1,
                fontSize: { xs: "2.5rem", sm: "3rem" },
              }}
            >
              {t("Tinghir")}
            </Typography>
          </Box>

          {/* Body */}
          <Box
            component="section"
            sx={{
              p: 2,
              bgcolor: "#0e3585ff",
              height: { xs: "auto", sm: "78%" },
              borderRadius: "0 0 20px 20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "300px" },
                  textAlign: "center",
                }}
              >
                <WbSunnyIcon
                  sx={{
                    fontSize: { xs: "120px", sm: "220px" },
                    m: 2,
                    color: "#2d529aff",
                  }}
                />
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", sm: "300px" },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    textAlign: {
                      xs: "center",
                      sm: locale === "ar" ? "right" : "left",
                    },
                    pr: { sm: "20px" },
                    pl: { sm: "20px" },
                    fontSize: { xs: "3rem", sm: "6rem" },
                  }}
                >
                  <Box component="img" src={data.icon} sx={{ width: 80 }} />
                  {data.temp}°
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    textAlign: {
                      xs: "center",
                      sm: locale === "ar" ? "right" : "left",
                    },
                    pr: { sm: "20px" },
                    pl: { sm: "20px" },
                    mt: 5,
                    fontSize: "30px",
                  }}
                >
                  {t(data.description)}
                </Typography>

                <Box
                  sx={{
                    pr: { sm: "20px" },
                    pl: { sm: "20px" },
                    mt: 3,
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      sm: locale === "ar" ? "right" : "left",
                    },
                  }}
                >
                  <Typography sx={{ mr: 2, fontSize: "22px" }}>
                    {t("Max")} : {data.temp_max}
                  </Typography>
                  <Typography sx={{ mr: 2, fontSize: "22px" }}>|</Typography>
                  <Typography sx={{ mr: 2, fontSize: "22px" }}>
                    {t("Min")} : {data.temp_min}
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
