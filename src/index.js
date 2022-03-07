import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { usePromiseTracker } from "react-promise-tracker";
import {InfinitySpin} from 'react-loader-spinner';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
    return (
      // promiseInProgress && 
     <div
     
     style={{
            width: "100%",
             height: "100",
             display: "flex",
             marginTop:"25%",
            justifyContent: "center",
            alignItems: "center"
           }}
    >
     <InfinitySpin color="#2152ffad" height="200" width="200" timeout='3000'/>
  </div>
   );  
  }

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
    <App />
    </AlertProvider>
    
    <LoadingIndicator/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
