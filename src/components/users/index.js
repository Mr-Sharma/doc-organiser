import React, {useEffect ,useState } from 'react';
import './user.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function UserPage (props) {
  const [candidates, setCandidates] = useState([]);
  const [username, setUsername] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const history = useNavigate();

  useEffect(()=>{
    getCandidates()
  }, []);

  const getCandidates = async () => {
    try {
      let response = await axios.get('/api/candidate/get');
      console.log("getCandidates",response);
      setCandidates(response.data.message || []);
    } catch (err) {
      console.log("error",err);
      setCandidates([])
    }
  }

  const openPopup=()=> {
    document.getElementById('createCandidatePopup').style.display = 'block';
  }

  const hidePopUp=()=> {
    document.getElementById('createCandidatePopup').style.display = 'none';
  }

  const handleUsernameChange=(e)=>{
    setUsername(e.target.value);
    setShowErrorMsg(false);
  }

  const handleAadharChange=(e)=>{
    setAadhar(e.target.value);
    setShowErrorMsg(false);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(username!=='' && username!==undefined && aadhar!=='' && aadhar!==undefined){
      const formData = new FormData();
      const configuration = { headers: { "Content-Type": "multipart/form-data" } };
      formData.append('name', username);
      formData.append('aadhar', aadhar);
      axios
      .put("/api/candidate/create", formData, configuration)
      .then(response => {
        console.log("response", response);
        if(!response.data.message.success){
          setError('Name or aadhar is missing!');
          setShowErrorMsg(true);
        } else {
          hidePopUp()
        }
      })
      .catch(error => {      
        console.log("failed", error);
      });
    }
  }

  return (
    <div>
      <div className='doc-card'>
        <div className="doc-card__header">
          <p>Candidates List</p>
          <button className='doc-button' onClick={openPopup}>Create</button>
        </div>
        <div className='doc-card__body'>
          <table className='doc-table'>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Name</th>
                <th>Aadhar</th>
                <th>Answer Sheet</th>
                <th>Patting Sheet</th>
                <th>C Form</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, i)=> (<tr key={candidate._id}>
                <td>{i+1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.aadhar}</td>
                <td>
                  <span className='view-button'>view</span>
                </td>
                <td>
                  <span className='view-button1'>view</span>
                </td>
                <td>
                  <span className='view-button2'>view</span>
                </td>
              </tr>))}
            </tbody>
          </table>  
        </div>
      </div>
       {/*popup to delete course*/}
       <div id="createCandidatePopup" className="nj-overly add-rebound-animation" >
          <div className="doc-popup my-popup">
            <div className="doc-popup-form">
              <form onSubmit={handleSubmit}>
                <div className="doc-popup-form__inner">
                  <div className="doc-popup-title">
                    <span>Create Candidate</span>
                    <span onClick={hidePopUp} className="doc-popup__close">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x"
                      >
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                      </svg>  
                    </span>
                  </div>
                  <div className="doc-popup-form-input-wrap">
                    <label className="doc-popup-form__label">
                      Name
                    </label>
                    <input type="text" className="doc-popup-form__input" name="username" value={username} onChange={handleUsernameChange} placeholder="Name" required autoFocus="" />
                  </div>
                  <div className="doc-popup-form-input-wrap">
                    <label className="doc-popup-form__label">
                      Aadhar
                    </label>
                    <input type="text" className="doc-popup-form__input" name="aadhar" value={aadhar} onChange={handleAadharChange} placeholder="Aadhar card no." required autoFocus="" />
                  </div>
                  {showErrorMsg && <p style={{textAlign: 'center',color: '#ff5151', fontSize:14}}>{error}</p>}
                  <div style={{textAlign:'right'}}>
                    <button className='doc-button doc-button-cancel' onClick={hidePopUp}>Cancel</button>  
                    <button className='doc-button' style={{marginLeft:10}} onClick={openPopup}>Create</button> 
                  </div>
                </div>
              </form>
            </div>   
          </div>
        </div>
    </div>
  );
}

export default UserPage;