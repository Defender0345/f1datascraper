const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');

for (let i = 1950; i <= 2022; i++) {
   // URL of the page we want to scrape
   const url = `https://www.formula1.com/en/results.html/${i}/races.html`;

   async function scrapeData() {
      try {
         // Fetch HTML of the page we want to scrape
         const { data } = await axios.get(url);
         // Load HTML we fetched in the previous line
         const $ = cheerio.load(data);
         // Select all the table items
         const tableItems = $('.resultsarchive-table tbody tr');
         // Stores data for races that year
         const races = [];
         // Use .each method to loop through the tr
         tableItems.each((idx, el) => {
            const race = {
               grandprix: '',
               date: '',
               winner: '',
               car: '',
               laps: '',
            };
            // Select the text content of the html elements
            //  Cant get grandprix yet
            race.grandprix = $(el).children('td:nth-child(2), a').text().trim();
            race.date = $(el).children('td:nth-child(3)').text();
            //  Cant get race winner yet
            race.winner = $(el)
               .children('td:nth-child(4), span')
               .text()
               .replace(/\n/g, ' ')
               .replace(/  +/g, ' ')
               .trim();
            race.car = $(el).children('td:nth-child(5)').text();
            race.laps = $(el).children('td:nth-child(6)').text();

            races.push(race);
         });

         console.dir(races);

         // Write races array in race{year}.json file
         fs.writeFile(
            `race${i}.json`,
            JSON.stringify(races, null, 5),
            (err) => {
               if (err) {
                  console.error(err);
                  return;
               } else {
                  console.log('Successfully written data to file');
               }
            }
         );
      } catch (err) {
         console.error(err);
      }
   }

   scrapeData();
}
