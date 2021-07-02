import {STOCK_API_KEY} from '@env';


const axios = require('axios');

export default function getCurrentPrice(ticker) {
      
      
   
    const url = `http://api.marketstack.com/v1/eod/latest?access_key=${STOCK_API_KEY}&symbols=${ticker}`
   
    const quote = async () => axios.get(url)
    .then(response => {
      const apiResponse = response.data;
      if (Array.isArray(apiResponse['data'])) {
        console.log(apiResponse['data'][0]['close'])
        return apiResponse['data'][0]['close']
      }
    }).catch(error => {
      // no alert if error loading price make sure check valid ticker before igetting price
      console.log("Error getting price: " + error.response.data);
    });
     
    return quote();
      
}
