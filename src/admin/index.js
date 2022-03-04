
import React, { Component } from "react";
import "./admin.css";
import UserPage from "../components/users"
import { Route,Routes} from "react-router-dom";

class AdminDashboard extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route exact path="user" element={<UserPage/>} /> 
          <Route path="*" element={<h1>Page not Found!!!</h1>} />   
        </Routes>
      </div>
          
    );
  }
}

export default AdminDashboard;
