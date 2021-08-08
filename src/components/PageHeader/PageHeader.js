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
import React, { useEffect } from "react";

// reactstrap components
import { Container, ButtonToggle } from "reactstrap";
// import { useHistory } from "react-router-dom";

// const history = useHistory();

//   const routeChange = () =>{
//     let path = `marketplace`;
//     history.push(path);
//   }
export default function PageHeader() {
  function enableMenu() {
    document.getElementById("menucontainer").style.display="block";
  }

  useEffect(()=>{
    document.getElementById("menucontainer").style.display="none";
  })
  return (
    <div className="page-header header-filter">
      <div className="squares square1" />
      <div className="squares square2" />
      <div className="squares square3" />
      <div className="squares square4" />
      <div className="squares square5" />
      <div className="squares square6" />
      <div className="squares square7" />
      <Container>
        <div className="content-center brand">
          <h1 className="h1-seo">Unified Rewards</h1>
          <h3 className="d-none d-sm-block">
            All your reward points in one single wallet! <br />
            What more ?! It is DECENTRALISED.
          </h3>
          <ButtonToggle
            color="primary"
            size="lg"
            onClick={() => {
              window.location.pathname = "/marketplace";
            }}
          >
            Explore Marketplace
          </ButtonToggle>
          <div className="button-holder" style={{ padding: "20px" }}>
            <ButtonToggle color="primary" size="lg" onClick={enableMenu}>
              Organization
            </ButtonToggle>
            <ButtonToggle
              color="primary"
              size="lg"
              onClick={() => {
                window.location.pathname = "/user-profile-page";
              }}
            >
              User profile
            </ButtonToggle>
          </div>
        </div>
      </Container>
    </div>
  );
}
