const ecweather = require("ec-weather");
const express = require("express");
const app = express();
const port = 5501;
const path = require("path");
const moment = require("moment");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let weatherInfo = {};
let thermometerSrc;
let selectedCity;

const cityDescriptions = {
  Banff:
    "Located an hour and a half outside of Calgary Alberta, Banff National Park boasts over 500 total climbs most consisting of either Sport or Trad. \n Though the rock is fairly chossy (some have described it as the worst rock in North America that still gets climbed), the routes are many from small sport crags to huge alpine rock routes.",
  Calabogie:
    "Near the Calabogie Peaks ski resort, Calabogie is a climbing destination known for its scenic beauty and a variety of climbing options with an emphasis on bouldering. With over 330 boulders and 200 sport/trad climbs, Calabogie offers a diverse range of routes suitable for climbers of different skill levels.",
  Canmore:
    "Nestled in the heart of the Canadian Rockies, Canmore known by many as the Bow Valley is a climbing paradise surrounded by stunning mountain landscapes. Alberta's premier sport-climbing destination consisting of limestone crags and alpine walls, boasting over 1000 climbs including the 2 hardest climbs in Canada.",
  Castlegar:
    "Located deep in the West Kootenays, Castlegar offers a unique climbing experience with a mix of outdoor climbing areas. From local crags to nearby mountains, climbers can enjoy a variety of routes. The climbing community in Castlegar is welcoming, and the natural beauty of the area adds to the overall appeal.",
  ChineseMountains:
    "On secluded Quadra Island the Chinese Mountains provides a challenging and rewarding experience. The diverse terrain offers everything from granite walls to high-altitude routes. Climbers can enjoy both traditional and sport climbing in this scenic mountainous region. (Trad gear from 0-4 needed for most trad routes)",
  Duncan:
    "Just east of Duncan and just west of Salt Spring Island, the Duncan Boulders are a haven for boulderers seeking quality problems in a picturesque setting. The climbing area features a mix of difficulties, making it suitable for climbers of various skill levels. The local community contributes to a vibrant bouldering scene.",
  EardleyEscarpment:
    "Across the bridge from Ottawa and past Hull into Gatineau, Eardley Escarpment is known for its intriguing rock formations and quality climbing routes. Climbers can explore a mix of trad and sport climbs against the backdrop of the escarpment's unique geology. The area offers both single-pitch and multi-pitch routes.",
  PeggysCove:
    "Located about an hour south of Halifax, Peggy's Cove is a Nova Scotian coastal climbing destination characterized by rugged cliffs and stunning ocean views. Climbers can enjoy a mix of sea cliff scrambling and over 500 boulder problems. The maritime atmosphere adds a distinct charm to the climbing experience.",
  Halton:
    "60km south-east from Toronto, Ontario's Halton Region provides climbers with a mix of outdoor climbing opportunities, ranging from local crags to hidden gems. The region's diverse landscape offers a variety of routes, and climbers can enjoy a sense of community within the Halton climbing scene.",
  Jasper:
    "Climbing in Jasper National Park offers a unique alpine experience surrounded by breathtaking mountain scenery. The park features a mix of rock types and climbing styles, attracting climbers seeking both adventure and natural beauty. Just pay mind to the wildlife as it is not uncommon to encounter bears, you are in their home after all.",
  Kananaskis:
    "Just south of Canmore you'll find it's little brother, Kananaskis is an underdeveloped climber's haven with a diverse range of undiscovered routes to be first ascent. From alpine ascents to craggy limestone walls, Kananaskis offers a mix of climbing experiences amidst the stunning mountain scenery.",
  Kelowna:
    "Less than 30 minutes south of Kelowna the Boulderfields provide a playground for boulderers seeking creative and challenging problems. Nestled in the Okanagan Valley, climbers can enjoy a variety of bouldering routes surrounded by the natural beauty of the region. Bare in mind the temperatures can get very high here in the summer.",
  Nelson:
    "Found just east of Castlegar, in the West Kootenays lies Nelson. Offering a unique blend of climbing opportunities, from local crags to hidden gems in the Kootenay region. The climbing community in Nelson is known for its friendly atmosphere, and the routes cater to climbers of different skill levels.",
  NiagaraGlen:
    "Just north-east of Niagara Falls, the Niagara Glen is a bouldering area throughout the wooded trails at Niagara Glen Nature Reserve. ADVISORY NOTICE: To boulder at the Niagara Glen, a permit is required. Permits can be purchased at the Niagara Glen Nature Center or at the Butterfly Conservatory. They cost $40 and require a signed waiver.",
  Squamish:
    "60 minutes north of Vancouver you'll find Squamish. A world-renowned climbing destination, known for its granite cliffs and diverse range of routes. From the famous Chief to bouldering areas like the Smoke Bluffs, Squamish offers something for every climber, attracting enthusiasts from around the globe.",
  Skaha:
    "Located just south of Penticton, Skaha's rock is well featured and easily accessible. Gneiss in nature the bluffs are a sport climbers dream due to the proximity of quality climbs to the parking lot. Skaha has something for every ability and style of climber. 5.6 to 5.14, slab to roofs, Skaha has it all",
  ThunderBay:
    "Climbing in Thunder Bay provides a unique mix of urban and wilderness climbing experiences. The region features both local crags primarily hosting traditional climbing routes and opportunities for exploration in nearby parks. Thunder Bay's climbing scene reflects a balance of adventure and community.",
  ValDavid:
    "90 minutes north of Montreal, Val-David offers a picturesque setting for climbers seeking tranquility and quality routes. The climbing area, situated in the Laurentians, includes a mix of trad and sport climbs. Climbers can appreciate the scenic beauty of Val-David while exploring its diverse routes.",
};

async function fetchData(cityCode) {
  try {
    let data = await ecweather({
      lang: "en",
      city: cityCode,
    });

    const currentConditions = data.entries.find(
      (entry) => entry.type === "Current Conditions"
    );

    console.log(currentConditions);

    function logWeatherInfo(property, label) {
      if (currentConditions && currentConditions[property]) {
        weatherInfo[label] = currentConditions[property];
      } else {
      }
    }

    logWeatherInfo("temperature", "Temperature");
    logWeatherInfo("humidity", "Humidity");
    logWeatherInfo("wind", "Wind");
    logWeatherInfo("windChill", "WindChill");

    weatherInfo.dateTime = moment().format("YYYY-MM-DD HH:mm:ss");

    const realWorldTemperature = parseInt(currentConditions.temperature);

    if (realWorldTemperature <= 0) {
      thermometerSrc = "../images/thermometer_empty.svg";
    } else if (realWorldTemperature <= 10) {
      thermometerSrc = "../images/thermometer_moderate.svg";
    } else {
      thermometerSrc = "../images/thermometer_full.svg";
    }

    if (!currentConditions.windChill) {
      weatherInfo.WindChill = undefined;
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

const interval = setInterval(fetchData, 5 * 60 * 1000);

app.get("/Banff", async (req, res) => {
  try {
    await fetchData("ab-49");
    weatherInfo.locationDescription = cityDescriptions["Banff"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Banff",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Calabogie", async (req, res) => {
  try {
    await fetchData("on-58");
    weatherInfo.locationDescription = cityDescriptions["Calabogie"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Calabogie",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Canmore", async (req, res) => {
  try {
    await fetchData("ab-3");
    weatherInfo.locationDescription = cityDescriptions["Canmore"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Canmore",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Castlegar", async (req, res) => {
  try {
    await fetchData("bc-21");
    weatherInfo.locationDescription = cityDescriptions["Castlegar"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Castlegar",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Chinese-Mountains", async (req, res) => {
  try {
    await fetchData("bc-19");
    weatherInfo.locationDescription = cityDescriptions["ChineseMountains"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Chinese-Mountains",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Duncan", async (req, res) => {
  try {
    await fetchData("bc-97");
    weatherInfo.locationDescription = cityDescriptions["Duncan"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Duncan",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Eardley-Escarpment", async (req, res) => {
  try {
    await fetchData("qc-126");
    weatherInfo.locationDescription = cityDescriptions["EardleyEscarpment"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Eardley-Escarpment",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Peggys-Cove", async (req, res) => {
  try {
    await fetchData("ns-40");
    weatherInfo.locationDescription = cityDescriptions["PeggysCove"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Peggy's Cove",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Halton", async (req, res) => {
  try {
    await fetchData("on-95");
    weatherInfo.locationDescription = cityDescriptions["Halton"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Halton",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Jasper", async (req, res) => {
  try {
    await fetchData("ab-70");
    weatherInfo.locationDescription = cityDescriptions["Jasper"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Jasper",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Kananaskis", async (req, res) => {
  try {
    await fetchData("ab-34");
    weatherInfo.locationDescription = cityDescriptions["Kananaskis"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Kananaskis",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Kelowna", async (req, res) => {
  try {
    await fetchData("bc-48");
    weatherInfo.locationDescription = cityDescriptions["Kelowna"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Kelowna",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Nelson", async (req, res) => {
  try {
    await fetchData("bc-37");
    weatherInfo.locationDescription = cityDescriptions["Nelson"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Nelson",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Niagara-Glen", async (req, res) => {
  try {
    await fetchData("on-125");
    weatherInfo.locationDescription = cityDescriptions["NiagaraGlen"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Niagara-Glen",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Squamish", async (req, res) => {
  try {
    await fetchData("bc-50");
    weatherInfo.locationDescription = cityDescriptions["Squamish"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Squamish",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Skaha", async (req, res) => {
  try {
    await fetchData("bc-84");
    weatherInfo.locationDescription = cityDescriptions["Skaha"];
    res.render("index", { weatherInfo, thermometerSrc, selectedCity: "Skaha" });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Thunder-Bay", async (req, res) => {
  try {
    await fetchData("on-100");
    weatherInfo.locationDescription = cityDescriptions["ThunderBay"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Thunder-Bay",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Val-David", async (req, res) => {
  try {
    await fetchData("qc-33");
    weatherInfo.locationDescription = cityDescriptions["ValDavid"];
    res.render("index", {
      weatherInfo,
      thermometerSrc,
      selectedCity: "Val-David",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
