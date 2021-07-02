import {STOCK_API_KEY} from '@env';


const axios = require('axios');

export default function getCompanyName(ticker) {
      
      
    const url = `http://api.marketstack.com/v1/tickers/${ticker}?access_key=${STOCK_API_KEY}`
    
   
    const name = async () => axios.get(url)
      .then(response => {
        const apiResponse = response.data;
        return apiResponse['name'];
        
      }).catch(error => {
        console.log(error);
        return 'NA'
      });
     
      return name();
      
  }