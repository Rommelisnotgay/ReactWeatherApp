import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import "./i18n";
import "moment/min/locales";
//mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

//theme
const theme = createTheme({
  typography: {
    fontFamily: ["eng", "ara"],
  },
});
let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState("en");
  const [time, setTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });

  function handleClick() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
      setTime(moment().format("MMM Do YY"));
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
      setTime(moment().format("MMM Do YY"));
    }
  }

  useEffect(() => {
    i18n.changeLanguage("en");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTime(moment().format("MMM Do YY"));

    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=30.033333&lon=31.233334&appid=4f6620bd3c73e72facd9b9b4d2957973",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const des = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        setTemp((prevTemp) => ({
          ...prevTemp,
          number: responseTemp,
          min: min,
          max: max,
          description: des,
          icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        }));
      })
      .catch(function (error) {
        console.log(error);
      });

    return () => {
      if (cancelAxios) {
        cancelAxios();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const currentLang = i18n.language;
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* content cont  */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {/* card  */}
            <div
              style={{
                background: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
                width: "100%",
              }}
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              {/* content  */}
              <div>
                {/* city and time  */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "end",
                  }}
                >
                  <Typography variant="h2" style={{ marginLeft: "20px" }}>
                    {t("Cairo")}
                  </Typography>
                  <Typography variant="h5" style={{ marginLeft: "20px" }}>
                    {time}
                  </Typography>
                </div>
                {/* city and time ==  */}
                <hr />
                {/* cont of eg  */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  {/* degree and des  */}
                  <div>
                    {/* Temp  */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      {/* Temp img  */}
                      <img src={temp.icon} alt={{}} className="wow" />
                      {/* Temp img == */}
                    </div>
                    {/* Temp == */}
                    <Typography variant="h6" style={{}}>
                      {t(temp.description)}
                    </Typography>
                    {/* min max  */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                      >
                        {t("Maximum")}
                        <p>:{temp.max}</p>
                      </h5>
                      <h4 style={{ margin: "0px 5px" }}>|</h4>
                      <h5
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                      >
                        {t("Minimum")}
                        <p>:{temp.min}</p>
                      </h5>
                    </div>
                    {/* min max ==  */}
                  </div>
                  {/* degree and des == */}
                  <CloudIcon className="cloud" />
                </div>
                {/* cont of eg  */}
              </div>
              {/* content ==  */}
            </div>
            {/* card ==  */}
            <div
              style={{
                display: "flex",
                justifyContent: locale === "ar" ? "start" : "end",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <Button
                variant="text"
                style={{ color: "white" }}
                onClick={handleClick}
              >
                {currentLang === "en" ? "عربي" : "English"}
              </Button>
            </div>
          </div>
          {/* content cont  ==*/}
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
