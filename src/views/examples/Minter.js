import React,{ useEffect, useState } from "react";
import IndexNavbar from "../../components/Navbars/IndexNavbar.js";
import {Button, FormGroup, Col, Row, Input, InputGroup, InputGroupAddon,InputGroupText, Card, CardBody, CardHeader } from 'reactstrap';
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "../util/interact.js";
import Footer from "components/Footer/Footer.js";

const Minter = (props) => {
  React.useEffect(() => {
    document.body.classList.toggle("minter-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("minter-page");
    };
  },[]);

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [points, setPoints] = useState("");
  const [expiry, setExpiry] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(points, expiry);
    setStatus(status);
    if (success) {
      setPoints("");
      setExpiry("");
    }
  };

  return (
    <div>
    <IndexNavbar />
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
      <Button color="info" id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </Button>
      </div>
      <br/>
      <br/>
      <br/>
    <div className="Minter">
      <Row className="row-grid justify-content-between align-items-center text-left">
      <Col lg="6" md="6">
      <Card>
      <CardHeader>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <h1> <Button color="primary" id="title" pill="true">NFT Minter</Button> </h1>
        </div>   
        </CardHeader>   
        <CardBody>
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
      
      <FormGroup row>
      <Col sm={10}>
      <InputGroup>
        <InputGroupAddon addonType="append">
          <InputGroupText>Points</InputGroupText>
        </InputGroupAddon>
        <Input placeholder="Reward Points" onChange={(event) => setPoints(event.target.value)}/>
      </InputGroup>
      </Col>
      <Col sm={10}>
      <InputGroup>
        <InputGroupAddon addonType="append">
          <InputGroupText>Expiry</InputGroupText>
        </InputGroupAddon>
        <Input placeholder="Expiry Date" onChange={(event) => setExpiry(event.target.value)}/>
      </InputGroup>
      </Col>
      </FormGroup>
      </div> 
      <br/>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
      <Button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </Button>
      </div>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
      </div>
      </CardBody>
      </Card>
      </Col>
      <Col lg="4" md="5">
                <img
                  alt="..."
                  className="img-fluid"
                  style = {{width: 220, height:220}}
                  src={require("assets/img/etherum.png").default}
                />
              </Col>
      </Row>
      </div>
      <Footer />
      </div>
  );
};

export default Minter;