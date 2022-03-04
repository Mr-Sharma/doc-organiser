import React, {Component} from "react";
import {NavLink} from 'react-router-dom';
const mql = window.matchMedia(`(min-width: 800px)`);
class AdminSidebar extends Component {
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

  render() {
    return (
      <div className="left-area">
        <div className="left-area ">
          {/**/}
            <div className="app-header">Video.
              <span className="inner-text">ply</span>
              <button className="close-menu">
                <svg width={24} height={24} fill="none" stroke="#51a380" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="feather feather-x">
                  <defs />
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          <div className="left-area-content">
            <div className="profile">
                <img src="https://images.unsplash.com/photo-1496340672773-0b29c9b17ed2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" alt="" />
                <div className="profile-info">
                    <span className="profile-name">Michealla Cruz</span>
                    <span className="country">Country</span>
                </div>
            </div>
            <div className="page-link-list">
                <div>
                  <NavLink
                    to="/admin/users"
                    className="item-link"
                    activeClassName="active"
                    id="pageLink"
                    style={{display:'flex', alignItems:'center'}}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" className="link-icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span style={{marginLeft:5}}> Candidates </span>
                  </NavLink>
                </div>
              {/**/}
              {/**/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminSidebar;
