const axios = require('axios')

export  const postDataToEndPoint = async (value) => {
  try {

    return await  axios.post(`https://enmzq6eaj9rj.x.pipedream.net/response/submit/?SushilKumar=${value}`);        
      
  } catch (error) {
    console.error(error)
  }
}