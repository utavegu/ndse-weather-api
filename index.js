#!/usr/bin/env node

const http = require('http');
const key = require('./config');

const city = process.argv.slice(2)[0];
const url = `http://api.weatherstack.com/current?access_key=${key}&query=${city}`;

if (city) {
  http.get(url, (res) => {
    const { statusCode } = res;

    if (statusCode !== 200) {
      console.error(`Status code: ${statusCode}`);
      return;
    }
    res.setEncoding('utf-8');
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      let parsedData = JSON.parse(data);
      console.log(`
        Город: ${parsedData.location.name}
        Страна: ${parsedData.location.country}
        Температура воздуха: ${parsedData.current.temperature}°
        Ощущается как: ${parsedData.current.feelslike}°
        Влажность: ${parsedData.current.humidity}%
        Давление: ${(parsedData.current.pressure / 1.33322).toFixed(2)} мм.рт.ст
      `);
    })
  }).on('error', (err) => {
    console.error(err);
  })
} else {
  console.log('Вы забыли указать название города');
}
