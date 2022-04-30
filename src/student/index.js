
import React, {useEffect ,useState } from 'react';
import "../components/login/login.scss";
import "../Dashboard.scss"
import axios from 'axios';
import { downloadFile } from 'fs-browsers';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';

function LoginPage () {
  const [rollNumber, setRollNumber] = useState("");
  const [code, setCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [phoneLoader, setPhoneLoader] = useState(false);
  const history = useNavigate();
  const alert = useAlert()

  const handleRollNumberChange=(e)=>{
    setRollNumber(e.target.value);
    setShowErrorMsg(false);
    setError("");
  }

  const handleRollNumberSubmit = async (e) => {
    e.preventDefault()
    if(rollNumber!=='' && rollNumber!==undefined){
      setPhoneLoader(true);
      var obj = {};
      obj.rollNumber = rollNumber;
      try {
        const response = await axios.get("/api/candidate/download/"+rollNumber);
        if(response.data && response.data.message && response.data.message.length>0) {
          downloadFile("http://localhost:4000"+response.data.message[0].file.path, "certificate.pdf");
        } else {
          alert.error("Certificate is not available");
        }
        setPhoneLoader(false);
      } catch (error) {
        setPhoneLoader(false);
        alert.error("Certificate is not available");
        console.log("failed", error);
      }
    }
  }

  return (
      <div className="login-wrapper">
          <div className="card-form">
            <div className="card-form__inner">
            <img src={require('../govt1.png')} width="100%"/>
              <div className="card-title">
                Download Certificate
              </div>
              <form onSubmit={handleRollNumberSubmit}>
                <div className="card-input">
                  <label className="card-input__label">
                    Roll Number:
                  </label>
                  <input type="text" className="card-input__input" disabled={showOtp} name="rollNumber" value={rollNumber} onChange={handleRollNumberChange} required autoFocus="" />
                </div>
                <button className="doc-button" disabled={phoneLoader} style={{width: '100%', padding: 16, fontSize: 16, fontWeight: 500, marginTop: 10}}>
                  {!phoneLoader ? <span>Download</span>:<div className="typing_loader"></div>}
                </button>
              </form>
            </div>
          </div>
        </div>
    );
  }

export default LoginPage;
