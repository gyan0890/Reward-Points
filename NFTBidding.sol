//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControlEnumerable.sol";

contract NFTBidding {
    
    using Counters for Counters.Counter;
    Counters.Counter private _bids;
    
    enum NFTState {
	    ONBID,
	    LOCKED, 
	    RELEASED
	}
	
	struct NFTStruct{
	  address nftAddress;
      uint256 tokenId;
      string tokenURI;
      uint256 auctionPeriod;
      address owner;
      NFTState state;
  }
  
  struct Bid {
      address nftAddress;
      uint256 parentTokenId;
      uint256 tokenId;
      string tokenURI;
      address bidder;
      //The bidder can mention the time duration for which they are ready to lock their NFT
      uint256 lockInPeriod;
      NFTState state;
  }
  
  mapping(uint256 => NFTStruct) nftsOnBid;
  mapping(uint256 => Bid) bidMapping;
  
  event nftOnBid(address, uint256, address);
  event bidLog(address, uint256, uint256, address);
  
  
  
  function putOnBid(address nftAddress, uint256 tokenId, string memory tokenURI, uint256 auctionPeriod) public returns(bool){
      ERC721 nftContract = ERC721(nftAddress);
      require(msg.sender == nftContract.ownerOf(tokenId), "Only the owner of the NFT can call the put on bid function");
      
      NFTStruct memory nftData = NFTStruct(nftAddress, tokenId, tokenURI, auctionPeriod, msg.sender, NFTState.ONBID);
      nftsOnBid[tokenId] = nftData;
      
      emit nftOnBid(nftAddress, tokenId, msg.sender);
      
      return true;
  } 
  
  function bid(address nftAddress, uint256 parentTokenId, uint256 tokenId, string memory tokenURI) public returns(bool) {
      ERC721 nftContract = ERC721(nftAddress);
      require(msg.sender == nftContract.ownerOf(tokenId), "Only the owner of the NFT can call the bid function");
      
      
      Bid memory bidData = Bid(nftAddress, parentTokenId, tokenId, tokenURI, msg.sender, 0, NFTState.LOCKED);
      _bids.increment();
      
      uint bidId = _bids.current();
      bidMapping[bidId] = bidData;
      
      emit bidLog(nftAddress, parentTokenId, tokenId, msg.sender);
      
      return true;
  }
  
  function transfer(address nftAddress, uint256 tokenId) public {
      ERC721 nftContract = ERC721(nftAddress);
      address owner = nftContract.ownerOf(tokenId);
      nftContract.transferFrom(owner, address(this), tokenId);
  }
  
  function transferNFTBack(address nftAddress, uint256 tokenId, address to) public {
      ERC721 nftContract = ERC721(nftAddress);
      address owner = nftContract.ownerOf(tokenId);
      nftContract.transferFrom(owner, to, tokenId);
  }
  
}
