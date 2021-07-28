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
{   Exchange,
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
  UncontrolledTooltip,
  UncontrolledCarousel,
} from "reactstrap";



export default function UserProfile() {

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [nftAddress, setAddress] = useState('0x0');
  const [tokenId, setTokenId] = useState('0');
  const [auctionPeriod, setAuctionPeriod] = useState('0');
  const [tokenURI, setTokenURI] = useState("");

  const [tabs, setTabs] = React.useState(1);
  const [apiState, setApiState] = useState([]);

  let ps = null;

  React.useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
    getNFTData(address);
  }, []);

function getNFTData(address) {
    const url = `https://api.covalenthq.com/v1/4002/address/0xfFe1426e77CE0F7c0945fCC1f4196CD8dC3f090A/balances_v2/?nft=true&key=ckey_876ab80803e44602a7ad845e463`;
    axios.get(url).then(response => {
        // console.log(response.data);
        // console.log(response.data.data.items);
        setApiState(response.data.data.items);
    })
    .catch(error => {
        console.log(error)
    })
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

  const onExchangeRequest = async () => {
    const { success, status } = await Exchange(nftAddress, tokenId, tokenURI, auctionPeriod);
    setStatus(status);
    if (success) {
      alert("Successfully transferred");
    }
  };

  return (
    <React.Fragment>
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
          {
            apiState.map(function(item) {
              if(item.type === "nft" && item.nft_data != null){
              console.log(item)
              const nftData = item.nft_data
              return nftData.map(function(nft){
                {/* const tokenURI = nft.token_url;
                console.log(tokenURI.name); */}
                {/* console.log(nft); */}
                {/* const tokenURI = nft.token_url.json();
                console.log(tokenURI); */}
              {/* return <div> */}
              setTokenId(nft.token_id);
              setTokenURI(nft.token_url);
              return(
                <div>
                <Container className="align-items-center">
              <Row>
              <Col className="ml-auto mr-auto" lg="4" md="6">
              <Card className="card-coin card-plain">
                  <CardHeader>
                    <img
                      alt="..."
                      className="img-center img-fluid rounded-circle"
                      src="https://gateway.pinata.cloud/ipfs/QmZd9qJexMRdKH1LhMfKsmHZFqyWCQSr2yzo62Qm1ZWhaY"
                    />
                    <h4 className="title">Amazon</h4>
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
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: tabs === 2,
                          })}
                          onClick={(e) => {
                            e.preventDefault();
                            setTabs(2);
                          }}
                          href="#pablo"
                        >
                          Exchange
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
                              <td>OWNER</td>
                              <td>{nft.token_id}</td>
                            </tr> 
                            <tr>
                              <td>TOKEN URL</td>
                              <td>{nft.token_url}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="tab2">
                        <Row>
                          <Label sm="3">Auction Period</Label>
                          <Col sm="9">
                            <FormGroup>
                              <Input
                                placeholder="e.g. e7364bn"
                                type="text"
                                onChange={(event) => setAuctionPeriod(event.target.value)}
                              />
                              <FormText color="default" tag="span">
                                Please enter Auction Period in Seconds.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Label sm="3">Send to</Label>
                          <Col sm="9">
                          <FormGroup>
                              <FormText tag="span">
                              NFT Address: {}
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Label sm="3">Send to</Label>
                          <Col sm="9">
                          <FormGroup>
                              <FormText tag="span">
                              Token ID: {nft.token_id}
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button
                          className="btn-simple btn-icon btn-round float-right"
                          color="primary"
                          type="submit"
                          onClick={onExchangeRequest}
                        >
                          <i className="tim-icons icon-send" />
                        </Button>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
              </Row>
              </Container>
              </div>)
              //return <li> {nft.owner} as the {nft.token_url} </li>
            })
          }
        })
      }
      </ul>
      </div>
          {/* <Container className="align-items-center">
            <Row>
              <Col className="ml-auto mr-auto" lg="4" md="6">
              <Card className="card-coin card-plain">
                  <CardHeader>
                    <img
                      alt="..."
                      className="img-center img-fluid rounded-circle"
                      src="https://gateway.pinata.cloud/ipfs/QmZd9qJexMRdKH1LhMfKsmHZFqyWCQSr2yzo62Qm1ZWhaY"
                    />
                    <h4 className="title">Amazon</h4>
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
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: tabs === 2,
                          })}
                          onClick={(e) => {
                            e.preventDefault();
                            setTabs(2);
                          }}
                          href="#pablo"
                        >
                          Transfer
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
                              <td>POINTS</td>
                              <td>{apiState.apiAddress}</td>
                            </tr>
                            <tr>
                              <td>EXPIRY</td>
                              <td>{apiState.chainId}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="tab2">
                        <Row>
                          <Label sm="3">Token ID</Label>
                          <Col sm="9">
                            <FormGroup>
                              <Input
                                placeholder="e.g. e7364bn"
                                type="text"
                                onChange={(event) => setTokenId(event.target.value)}
                              />
                              <FormText color="default" tag="span">
                                Please enter a valid token ID.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Label sm="3">Send to</Label>
                          <Col sm="9">
                            <FormGroup>
                              <Input
                                placeholder="e.g. 0x1ffe.."
                                type="text"
                                onChange={(event) => setAddress(event.target.value)}
                              />
                              <FormText color="default" tag="span">
                                Please enter a valid address.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button
                          className="btn-simple btn-icon btn-round float-right"
                          color="primary"
                          type="submit"
                          onClick={onTransferRequest}
                        >
                          <i className="tim-icons icon-send" />
                        </Button>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
              <Col className="ml-auto mr-auto" lg="4" md="6">
                <Card className="card-coin card-plain">
                  <CardHeader>
                    <img
                      alt="..."
                      className="img-center img-fluid rounded-circle"
                      src="https://gateway.pinata.cloud/ipfs/QmZd9qJexMRdKH1LhMfKsmHZFqyWCQSr2yzo62Qm1ZWhaY"
                    />
                    <h4 className="title">Amazon</h4>
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
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: tabs === 2,
                          })}
                          onClick={(e) => {
                            e.preventDefault();
                            setTabs(2);
                          }}
                          href="#pablo"
                        >
                          Transfer
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent
                      className="tab-subcategories"
                      activeTab={"tab" + tabs}
                    >
                      <TabPane tabId="tab1">
                        <Table className="tablesorter" responsive>
                           <thead className="text-primary">
                            <tr>
                              <th className="header">COIN</th>
                              <th className="header">AMOUNT</th>
                              <th className="header">VALUE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>POINTS</td>
                              <td>7.342</td>
                            </tr>
                            <tr>
                              <td>EXPIRY</td>
                              <td>30.737</td>
                            </tr>
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="tab2">
                        <Row>
                          <Label sm="3">Send to</Label>
                          <Col sm="9">
                            <FormGroup>
                              <Input
                                placeholder="e.g. 0x1ffe.."
                                type="text"
                              />
                              <FormText color="default" tag="span">
                                Please enter a valid address.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button
                          className="btn-simple btn-icon btn-round float-right"
                          color="primary"
                          type="submit"
                          onClick={onTransferRequest}
                        >
                          <i className="tim-icons icon-send" />
                        </Button>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
              <Col className="ml-auto mr-auto" lg="4" md="6">
              <Card className="card-coin card-plain">
                  <CardHeader>
                    <img
                      alt="..."
                      className="img-center img-fluid rounded-circle"
                      src="https://gateway.pinata.cloud/ipfs/QmZd9qJexMRdKH1LhMfKsmHZFqyWCQSr2yzo62Qm1ZWhaY"
                    />
                    <h4 className="title">Amazon</h4>
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
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: tabs === 2,
                          })}
                          onClick={(e) => {
                            e.preventDefault();
                            setTabs(2);
                          }}
                          href="#pablo"
                        >
                          Transfer
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
                              <td>POINTS</td>
                              <td>{apiState.apiAddress}</td>
                            </tr>
                            <tr>
                              <td>EXPIRY</td>
                              <td>{apiState.chainId}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="tab2">
                        <Row>
                          <Label sm="3">Token ID</Label>
                          <Col sm="9">
                            <FormGroup>
                              <Input
                                placeholder="e.g. e7364bn"
                                type="text"
                                onChange={(event) => setTokenId(event.target.value)}
                              />
                              <FormText color="default" tag="span">
                                Please enter a valid token ID.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Label sm="3">Send to</Label>
                          <Col sm="9">
                            <FormGroup>
                              <Input
                                placeholder="e.g. 0x1ffe.."
                                type="text"
                                onChange={(event) => setAddress(event.target.value)}
                              />
                              <FormText color="default" tag="span">
                                Please enter a valid address.
                              </FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button
                          className="btn-simple btn-icon btn-round float-right"
                          color="primary"
                          type="submit"
                          onClick={onTransferRequest}
                        >
                          <i className="tim-icons icon-send" />
                        </Button>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container> */}
        </div>
        <Footer />
      </div>
   </React.Fragment>
  );
}

