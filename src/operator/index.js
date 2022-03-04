import React, { Component } from "react";
import "./operator.css";
import OperatorUserPage from "../components/operatorUsers"
import {Route,Routes} from "react-router-dom";

class OperatorDashboard extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route  path="user" element={<OperatorUserPage/>} /> 
          <Route path="*" element={<h1>Page not Found!!!</h1>} />   
        </Routes>
      </div>         
    );
  }
}

export default OperatorDashboard;
