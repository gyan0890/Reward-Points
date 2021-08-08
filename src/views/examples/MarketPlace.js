/*!

=========================================================
* BLK Design System React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useState} from 'react';
import classnames from "classnames";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import axios from 'axios';
import 
{   Transfer,
    connectWallet,
    getCurrentWalletConnected} from "../util/interact";

import IndexNavbar from "../../components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Form,
  Input,
  FormText,
  NavItem,
  NavLink,
  Nav,
  Table,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function MarketPlace() {

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [address, setAddress] = useState('0x0');
  const [tokenId, setTokenId] = useState('0');

  const [transferAddress, setTransferAddress] = useState('0x0');
  const [tabs, setTabs] = React.useState(1);
  const [apiState, setApiState] = useState([]);

  let ps = null;


  React.useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
    getNFTData();
  }, []);

  function handleChange(event, tokenId) {
    setTransferAddress(event.target.value);
    setTokenId(tokenId);
  }

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



  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("profile-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("profile-page");
    };
  },[]);

  const bidNFT = async () => {
    alert("On Transfer");
    const { success, status } = await Transfer(transferAddress, tokenId);
    setStatus(status);
    if (success) {
      alert("Successfully transferred");
    }
  };

  function getNFTData() {
    const marketAddress = "0x457F0D56862F0E0E965f37Ce057B87886420b8C4";
    const url = `https://api.covalenthq.com/v1/80001/address/${marketAddress}/balances_v2/?nft=true&key=ckey_876ab80803e44602a7ad845e463`;
    axios
      .get(url)
      .then((response) => {
        // console.log(response.data);
        // console.log(response.data.data.items);
        setApiState(response.data.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const allNFTdata = [];
  const rowColumnData = [];
  let displayGrid = [];
  const cardsData = apiState.map(function (item) {
    if (item.type === "nft" && item.nft_data != null) {
      console.log(item);
      const nftData = item.nft_data;
      return nftData.map(function (nft) {
        allNFTdata.push(nft);
        
      });
    }
  });
  if (allNFTdata.length > 0) {
    const rows = Math.ceil(allNFTdata.length / 3);
    let counter = 0;
    for (let index = 0; index < rows; index++) {
      const tempArray = [];
      for (let j = 0; j < 3; j++) {
        tempArray.push(allNFTdata[counter++]);
      }
      rowColumnData.push(tempArray);
    }
    displayGrid = rowColumnData.map((d) => {
        return (
          <Row>
            {d.map((nft) => {
              if (nft && nft.external_data != null){
                debugger;
              return (
                <Col className="ml-auto mr-auto" lg="4" md="6">
                  <Card className="card-coin card-plain">
                    <CardHeader>
                      <img
                        alt="..."
                        className="img-center img-fluid rounded-circle"
                        src={nft.external_data.image}
                      />
                      <h4 className="title">{nft.external_data.name}</h4>
                    </CardHeader>
                    <CardBody>
                      <Nav
                        className="nav-tabs-primary justify-content-center"
                        tabs
                      >
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: tabs === 1,
                            })}
                            onClick={(e) => {
                              e.preventDefault();
                              setTabs(1);
                            }}
                            href="#pablo"
                          >
                            Info
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent
                        className="tab-subcategories"
                        activeTab={"tab" + tabs}
                      >
                        <TabPane tabId="tab1">
                          <Table className="tablesorter" responsive>
                            <tbody>
                              <tr>
                                <td>TOKEN ID</td>
                                <td>{nft.token_id}</td>
                              </tr>
                              <tr>
                                <td>POINTS</td>
                                <td>100</td>
                              </tr>
                            </tbody>
                          </Table>
                        </TabPane>
                      </TabContent>
                      <Button
                          className="btn-simple btn-icon"
                          color="primary"
                          type="submit"
                          onClick={bidNFT}
                        >
                          Bid
                        </Button>
                    </CardBody>
                  </Card>
                </Col>
              )};
            })}
          </Row>
        );

    });
  }
  return (
    <React.Fragment>
      <IndexNavbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button color="info" id="walletButton" style={{position: 'absolute',  top:'11px',  zIndex: '100000000'}} onClick={connectWalletPressed}>
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
      <div className="wrapper">
        <div className="page-header">
          <img
            alt="..."
            className="dots"
            src={require("assets/img/dots.png").default}
          />
          <img
            alt="..."
            className="path"
            src={require("assets/img/path4.png").default}
          />
          <div>
            <ul>
              <div>
                <Container className="align-items-center">
                  {(() => {
                    if (displayGrid.length > 0) {
                      return displayGrid;
                    }
                  })()}
                </Container>
              </div>
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
//-----------
//Older Return ----
  
}

