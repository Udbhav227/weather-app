export default class Weather {
  constructor(data) {
    if (!data || !data.currentConditions || !data.resolvedAddress) {
      throw new Error(
        "Invalid or incomplete weather data provided to Weather class.",
      );
    }

    this.location = data.resolvedAddress;
    this.weatherDescription = data.description;

    // Current Conditions
    const current = data.currentConditions;
    this.currentTemp = current.temp;
    this.feelsLike = current.feelslike;
    this.description = current.conditions;
    this.humidity = current.humidity;
    this.windSpeed = current.windspeed;
    this.icon = current.icon;
    this.datetime = current.datetime;
    this.sunrise = current.sunrise;
    this.sunset = current.sunset;
    this.visibility = current.visibility;
    this.cloudCover = current.cloudcover;
    this.uvindex = current.uvindex;
    this.moonPhase = current.moonphase;

    // Daily Forecast
    this.dailyForecast = data.days
      ? data.days.map((day) => ({
          date: day.datetime,
          tempMax: day.tempmax,
          tempMin: day.tempmin,
          conditions: day.conditions,
          icon: day.icon,
        }))
      : [];

    // Hourly Forecast (till tomorrow)
    this.hourlyForecast = [];
    if (data.days && data.days[0] && data.days[0].hours) {
      this.hourlyForecast = this.hourlyForecast.concat(
        data.days[0].hours.map((hour) => ({
          time: hour.datetime,
          temp: hour.temp,
          icon: hour.icon,
        })),
      );
    }
    if (data.days && data.days[1] && data.days[1].hours) {
      this.hourlyForecast = this.hourlyForecast.concat(
        data.days[1].hours.map((hour) => ({
          time: hour.datetime,
          temp: hour.temp,
          icon: hour.icon,
        })),
      );
    }
  }
}