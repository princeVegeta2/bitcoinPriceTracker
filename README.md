# Bitcoin Price Tracker

This web application allows the user to look at fresh, real bitcoin day-to-day data. 

## Functionality

- "Last Day" button shows the price of bitcoin on the last calendar day"
- "Last Week" button shows the price of bitcoin on the last calendar week"
- "Last Month" button shows the price of bitcoin on the last calendar month"
- "Last Year" button shows the price of bitcoin on the last calendar year"
- "Update Database" button manually updates the database from the fresh data via coindesk api, starting from last date entry on the database to the current day when the button is pressed."
- The custom timeframe allows the user to choose the start date and end date. Then the chart will display the data between those two dates.


## Prerequisites
- "Node v20.10.0+"
- "Npm v10.2.3+"
- "node-fetch 3.3.2"
- "pg 8.11.3"
- "recharts 2.10.4"

## Launch
- Open the project folder "my-bitcoin-app" in VSCode or any environment of your choice
- In the terminal, run the following command: "npm run dev"
- Go to http://localhost:3000 or another link shown in the terminal

## JS files

### MyRechart.js
This file is using Recharts to contruct a basic chart with dates on the X axis and prices on the Y axis. 

### db.js
This file has the data required to my PostgreSQL database

### bitcoin-data.js
This is the file responsible for fetching the data from our database. It takes in the startDate and endDate values passed to it from the frontend(index.js) and locates and fetches that data from the table.

### fetch-bitcoin.js
This is a redundant file, I only used it for testing. It simply takes 1 piece of data from the coindesk api(one day) and saves it in the database. Api link used: 'https://api.coindesk.com/v1/bpi/currentprice.json'

### fetch-historical-bitcoin.js
This is the main data fetcher. It takes the data from the api:
https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}
Taking in the start and end date, then saves it within our database. Its a crucial file in our "Update Database" button.

### index.js
This is our main file and page. It has all of the required functions to setDate, fetchData, etc. These are the functions:

- 'updateDatabase' - this function updates our database. It fetches historical bitcoin prices from Coindesk api via a POST request and saves it in our database for our use. 
- 'handleTimeFrameChange' - this function handles the timeframe change. 
- 'handleStartDateChange' and 'handleEndDateChange' are the functions designed to handle the timeframe change of our custom timeframe where the user chooses their own timeframe.
- 'fetchData' - this is the main function that fetches data from our database via the 'bitcoin-data.js' routing file and has error catching in place.
- 'useEffect()' - this is what changes the data and calls 'fetchData' when the selected timeframe mounts.

### Note
You can change, use and experiment with this however you want. I have populated the database using my machine with all of the data available via API from 2013 to 2024. You need to click "Update Database" to update it to your current date.

https://bitcoin-price-tracker-mu.vercel.app/