
import React, { Component } from "react";
import "./admin.css";
import UserPage from "../components/users"
import { Route,Routes} from "react-router-dom";
import Sidebar from "react-sidebar";
import SidebarContent from './adminSidebar';
import "../Dashboard.scss";
const mql = window.matchMedia(`(min-width: 800px)`);

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: true,
      sidebarDocked: mql.matches,
      sidebarOpen: true
    };
 
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }
 
  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }
 
  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }
 
  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  toggleSidebar = () =>{
    var open = this.state.sidebarOpen
    if(mql.matches){
      this.setState({ sidebarOpen: !open,sidebarDocked:!this.state.sidebarDocked,isSidebarOpen:!open });
    } else {
      this.setState({ sidebarOpen: !open,isSidebarOpen:false});
    }
  }
  
  logoutUser = () => {
    sessionStorage.removeItem('userData');
    this.context.history.push('/login');
  }

  render() {
    return (
      <div>
        <Sidebar  sidebar={<SidebarContent />} open={this.state.sidebarOpen} docked={this.state.sidebarDocked} onSetOpen={this.onSetSidebarOpen} shadow={false} defaultSidebarWidth={230}>
          <div className="right-area-upper">
            {/* <button className="menu-button" onClick={this.toggleSidebar}>
              <svg width={24} height={24} fill="none" stroke="#51a380" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                <defs />
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button> */}
            <div className="search-part-wrapper">
              <p className="search-input">Candidates</p>
              <span className="search-input"></span>
              <a className="menu-links" href="#" onClick={this.logoutUser}>
                <span className="sm:inline-flex xl:hidden cursor-pointer mr-1 feather-icon select-none relative purple-feather-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </span>
              </a>
              <a className="menu-links" href="#" onClick={this.logoutUser}>Logout</a>
            </div>
            {/* <button className="btn-notification">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#232428" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span>3</span>
            </button> */}
          </div>
          <div className="content-wrap" style={{padding:'0 20px'}}>
            <Routes>
              <Route exact path="users" element={<UserPage/>} /> 
              <Route path="*" element={<h1>Page not Found!!!</h1>} />   
            </Routes>
          </div>
        </Sidebar>
      </div>
          
    );
  }
}

export default AdminDashboard;
