require('dotenv').config();
const ApiKey = "637848cf25f3b2283790";
const ApiSecret = "8e07dd83c4b2f872e912841c05df216a9b42b8e347a6fb41a770274558ec38d3";

// const key = "f5cd4d9993789e2d2be4";
// const secret = "492b591e121cd74a113c77fe234e976353cde295a7cacf73b7b3517ba9bd49d9";
const axios = require('axios');

export const pinJSONToIPFS = async(JSONBody) => {
    console.log(JSONBody);
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: ApiKey,
                pinata_secret_api_key: ApiSecret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {

            console.log(error)
            return {
                success: false,
                message: error.message,
            }
           
        });
};