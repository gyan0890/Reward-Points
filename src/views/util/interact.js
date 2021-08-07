import {testNFTAbi} from '../abis/TestNFTAbi';
import {BiddingNFTAbi} from '../abis/BiddingNFTAbi';
import Web3 from 'web3';
import { pinJSONToIPFS } from "./pinata.js";
require("dotenv").config();



const NFTContractAddr = '0x7aCeC4eccba9323a784C5720fB81f1e6944f0331';
const web3 = new Web3(Web3.givenProvider);

const BiddingNFTContractAddr = '0x123D5E24630470d38709DE8adDD157aAcD1B412d';


export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(testNFTAbi, NFTContractAddr);
}

export const mintNFT = async (address, points, expiry) => {
  if (points.trim() == "" || expiry.trim() == "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }

  //make metadata
  const metadata = new Object();
  if(address === "0xdFE56933c0e112589A2BD414161B39aa3A1EC4BE"){
    metadata.name = "Amazon";
    metadata.description = "Reward Points NFT by Amazon";
    metadata.image = 'https://gateway.pinata.cloud/ipfs/QmeKwVX4r9k6dknzTyxr6rxDxf8XwKKDqzfMbcWqXcFVeP';
  }
  else if(address === "0x4b8a65c8ef37430edFaaD1B61Dba2D680f56FFd7"){
    metadata.name = "Chroma";
    metadata.description = "Reward Points NFT by Chroma";
    metadata.image = 'https://gateway.pinata.cloud/ipfs/QmXCsxjFvWGab5jLhxPXLCUqjudM6LkVkctsUZb3nz3SV3';
  }
  else if(address === "0xA873Bb96597D71d3BA6764ab26387DB598F65372"){
    metadata.name = "Big Bazaar";
    metadata.description = "Reward Points NFT by Big Bazaar";
    metadata.image = 'https://gateway.pinata.cloud/ipfs/QmRiXXH18KwBAtNtZRGta4gXMCuu5cq6dMBLmsVzS1HKo4';
  }
  metadata.points = points;
  metadata.image = 'https://gateway.pinata.cloud/ipfs/QmZd9qJexMRdKH1LhMfKsmHZFqyWCQSr2yzo62Qm1ZWhaY';
  metadata.expiry = expiry;

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }
  const tokenURI = pinataResponse.pinataUrl;
  console.log("Token URI is:", tokenURI);
  window.contract = await new web3.eth.Contract(testNFTAbi, NFTContractAddr);

  const transactionParameters = {
    to: NFTContractAddr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .awardItem(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const Transfer = async (toAddress, tokenId) => {
  window.contract = await new web3.eth.Contract(testNFTAbi, NFTContractAddr);
  const transactionParameters = {
    to: NFTContractAddr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .safeTransferFrom(window.ethereum.selectedAddress, toAddress, tokenId)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on PolygonScan: " +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }

};

export const Exchange = async(nftAddress, tokenID, tokenURI, auctionPeriod) => {
  window.contract = await new web3.eth.Contract(BiddingNFTAbi, BiddingNFTContractAddr);
  const transactionParameters = {
    to: BiddingNFTContractAddr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .putOnBid(nftAddress, tokenID, tokenURI, auctionPeriod)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on PolygonScan: " +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const Approve = async(nftAddress) => {
  window.contract = await new web3.eth.Contract(testNFTAbi, nftAddress);
  const transactionParameters = {
    to: nftAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .approve(BiddingNFTContractAddr, true)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on PolygonScan: " +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};


export const DepositNFTs = async(nftAddress, tokenID) => {
  window.contract = await new web3.eth.Contract(BiddingNFTAbi, BiddingNFTContractAddr);
  const transactionParameters = {
    to: BiddingNFTContractAddr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .transfer(nftAddress, tokenID)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on PolygonScan: https://mumbai.polygonscan.com/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};


export const ReturnNFTs = async(nftAddress, tokenID, owner) => {
  window.contract = await new web3.eth.Contract(BiddingNFTAbi, BiddingNFTContractAddr);
  const transactionParameters = {
    to: BiddingNFTContractAddr, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .transferNFTBack(nftAddress, tokenID, owner)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "✅ Check out your transaction on PolygonScan: " +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

