
import React, {useEffect ,useState } from 'react';
import './login.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useTimer } from 'react-timer-hook';
import { useAlert } from 'react-alert'

function MyTimer({ expiryTimestamp, onExpire }) {
  const { seconds, minutes } = useTimer({ expiryTimestamp , onExpire: () => onExpire()});

  return (
    <>
      <span>{minutes}</span>:<span>{seconds}</span>
    </>
  );
}

function LoginPage () {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [code, setCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [expiryTime, setExpiryTime] = useState('');
  const [phoneLoader, setPhoneLoader] = useState(false);
  const [codeLoader, setCodeLoader] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const history = useNavigate();
  const alert = useAlert()

  const handlePhoneNumberChange=(e)=>{
    setPhoneNumber(e.target.value);
    setShowErrorMsg(false);
    setError("");
  }
  const handleCompanyNameChange=(e)=>{
    setCompanyName(e.target.value);
    setShowErrorMsg(false);
    setError("");
  }

  const handleCodeChange=(e)=>{
    setCode(e.target.value);
    setShowErrorMsg(false);
    setError("");
  }

  const onExpire = () => {
    setShowOtp(false);
    setCode("");
    setShowErrorMsg(false);
    setError("");
    setCodeLoader(false);
  }

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault()
    if(phoneNumber!=='' && phoneNumber!==undefined){
      setPhoneLoader(true);
      var obj = {};
      obj.phoneNumber = phoneNumber;
      try {
        const response = axios.put("/api/user/phone/sendotp", obj);
        alert.success('Verification code sent to your phone number');
        const time = new Date();
        setExpiryTime(time.setSeconds(time.getSeconds() + 120));
        setShowOtp(true);
        setPhoneLoader(false);
      } catch (error) {
        setPhoneLoader(false);
        alert.error("Invalid Phone number");
        console.log("failed", error);
      }
    }
  }

  const handleResendSubmit = async (e) => {
    e.preventDefault();
    if(phoneNumber!=='' && phoneNumber!==undefined){
      setResendLoader(true);
      var obj = {};
      obj.phoneNumber = phoneNumber;
      try {
        const response = await axios.put("/api/user/phone/resendOtp", obj);
        alert.success('Verification code sent to your phone number')
        const time = new Date();
        setExpiryTime(time.setSeconds(time.getSeconds() + 120));
        setShowOtp(true);
        setResendLoader(false);
      } catch (error) {  
        setResendLoader(false);   
        alert.error("Invalid Phone number"); 
        console.log("failed", error);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(phoneNumber!=='' && phoneNumber!==undefined && code!=='' && code!==undefined){
      setCodeLoader(true);
      var obj = {};
      obj.phoneNumber = phoneNumber;
      obj.otp = code;
      try {
      const response = await axios.put("/api/user/phone/register/verify", obj);
        // console.log("response", response);
        if(!response.data.success){
          setError('Invalid code');
          setShowErrorMsg(true);
          setCodeLoader(false);
        } else {
          const checkRegistered = await isRegistered();
          console.log("checkRegistered", checkRegistered)
          if(checkRegistered) {
            const userInfo = await axios.get("/api/user/fetchUser/phone/"+obj.phoneNumber);
            sessionStorage.setItem('userData',JSON.stringify(response.data.message));
            history('/company/payment');
          } else {
            registerUser();
          }
        } 
      } catch (error) {  
        setCodeLoader(false);
        setError('Invalid code')
        setShowErrorMsg(true);   
        console.log(error);
      };
    }
  }

  const isRegistered = async () => {
    if(phoneNumber!=='' && phoneNumber!==undefined){
      setPhoneLoader(true);
      var obj = {};
      obj.phoneNumber = phoneNumber;
      try {
        const phoneExists = await axios.get("/api/user/checkUserPhoneExists/"+phoneNumber);
        if(phoneExists.data && phoneExists.data.message && phoneExists.data.message.userExists) {
          return true
        } else {
          return false
        }
      } catch (error) {
        return false;
        console.log("failed", error);
      }
    }
  }

  const registerUser = () => {
    if(phoneNumber!=='' && phoneNumber!==undefined && companyName!=='' && companyName!==undefined){
      setCodeLoader(true);
      var obj = {};
      obj.phoneNumber = phoneNumber;
      obj.username = companyName;
      obj.type = 2;
      axios
      .post("/api/user/create", obj)
      .then(response => {
        // console.log("response", response);
        if(!response.data.success){
          setError('Invalid code');
          setShowErrorMsg(true);
        } else {
          sessionStorage.setItem('userData',JSON.stringify(response.data.message));
          sessionStorage.setItem('isRegistered',JSON.stringify(true));
          history('/company/payment');
        }
        setCodeLoader(false);
      })
      .catch(error => {  
        setCodeLoader(false);
        setError('Invalid code')
        setShowErrorMsg(true);   
        console.log(error);
      });
    }
  }

  return (
      <div className="login-wrapper">
          <div className="card-form">
            <div className="card-form__inner">
            <img src={require('../../govt1.png')} width="100%"/>
              <div className="card-title">
                Login
              </div>
              <form onSubmit={handlePhoneNumberSubmit}>
                <div className="card-input">
                  <label className="card-input__label">
                    Company Name
                  </label>
                  <input type="text" className="card-input__input" disabled={showOtp} name="companyName" value={companyName} onChange={handleCompanyNameChange} required autoFocus="" />
                </div>
                <div className="card-input">
                  <label className="card-input__label">
                    Phone Number:
                  </label>
                  <input type="text" className="card-input__input" disabled={showOtp} name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} required autoFocus="" />
                </div>
                {!showOtp && <button className="doc-button" disabled={phoneLoader} style={{width: '100%', padding: 16, fontSize: 16, fontWeight: 500, marginTop: 10}}>
                  {!phoneLoader ? <span>Submit</span>:<div className="typing_loader"></div>}
                </button>}
              </form>
              {showOtp && <div style={{textAlign:'center'}}>
                <span style={{fontSize:14}}>Expires in </span>
                <span style={{fontSize:16, fontWeight:'600'}}><MyTimer expiryTimestamp={expiryTime} onExpire={onExpire} /></span>
              </div>}
              {showOtp && <form onSubmit={handleSubmit}>
                <div className="card-input">
                  <label className="card-input__label">
                    Code:
                  </label>
                  <input type="text" className="card-input__input" name="code" value={code} onChange={handleCodeChange} required autoFocus="" />
                </div>
                {showErrorMsg && <p style={{textAlign: 'center',color: '#ff5151', fontSize:14}}>{error}</p>}
                <div style={{display:'flex', marginTop: 10}}>
                  <button className="doc-button" type='button' disabled={resendLoader} onClick={handleResendSubmit} style={{width: '100%', padding: 16, fontSize: 16, fontWeight: 500, marginRight: 20}}>
                    {!resendLoader ? <span>Resend Code</span>:<div className="typing_loader"></div>}
                  </button>
                  <button className="doc-button" type='submit' disabled={codeLoader} style={{width: '100%', padding: 16, fontSize: 16, fontWeight: 500}}>
                    {!codeLoader ? <span>Submit</span>:<div className="typing_loader"></div>}
                  </button>
                </div>
              </form>}
            </div>
          </div>
        </div>
    );
  }

export default LoginPage;
