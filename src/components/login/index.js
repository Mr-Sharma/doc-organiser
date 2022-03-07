
import React, {useEffect ,useState } from 'react';
import './login.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function LoginPage () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const history = useNavigate();

  const handleUsernameChange=(e)=>{
    setUsername(e.target.value);
    setShowErrorMsg(false);
  }

  const handlePasswordChange=(e)=>{
    setPassword(e.target.value);
    setShowErrorMsg(false);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(username!=='' && username!==undefined && password!=='' && password!==undefined){
      var obj = {};
      obj.username = username;
      obj.password = password;
      axios
      .put("/api/user/authenticate", obj)
      .then(response => {
        console.log("response", response);
        if(!response.data.message.success){
          setError(response.data.message.msg);
          setShowErrorMsg(true);
        } else {
          sessionStorage.setItem('userData',JSON.stringify(response.data.message.res));
          history('/admin/users')
        }
      })
      .catch(error => {      
        console.log("failed", error);
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="login-wrapper">
          <div className="card-form">
            <div className="card-form__inner">
              <div className="card-title">
                Login
              </div>
              <div className="card-input">
                <label className="card-input__label">
                  Username
                </label>
                <input type="text" className="card-input__input" name="username" value={username} onChange={handleUsernameChange} required autoFocus="" />
              </div>
              <div className="card-input">
                <label className="card-input__label">
                  Password
                </label>
                <input type="password" className="card-input__input" name="password" value={password} onChange={handlePasswordChange} required autoFocus="" />
              </div>
              {showErrorMsg && <p style={{textAlign: 'center',color: '#ff5151', fontSize:14}}>{error}</p>}
              <button className="doc-button">Submit</button>
            </div>
          </div>
        </div>
      </form>
    );
  }

export default LoginPage;
