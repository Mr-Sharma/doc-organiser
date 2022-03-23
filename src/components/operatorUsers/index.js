import React, {useEffect ,useState } from 'react';
import './operatorUser.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { trackPromise } from 'react-promise-tracker';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

function OperatorUserPage (props) {
  const [candidates, setCandidates] = useState([]);
  const [unfilteredCandidates, setUnfilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [username, setUsername] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [popupType, setPopupType] = useState("create");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchUser , setSearchValue] = useState("");
  const history = useNavigate();
  

  useEffect(()=>{
    getCandidates()
  }, []);

  const alert = useAlert()

  const getCandidates = async () => {
    try {
      let response = await trackPromise(axios.get('/api/candidate/get'));
      var userList = response.data.message || [];
      setCandidates(userList);
      setUnfilteredCandidates(userList);
    } catch (err) {
      console.log("error",err);
      setCandidates([])
      setUnfilteredCandidates([]);
    }
  }

  const openPopup=()=> {
    document.getElementById('createCandidatePopup').style.display = 'block';
  }

  const hidePopUp=()=> {
    document.getElementById('createCandidatePopup').style.display = 'none';
    setSelectedCandidate({})
  }

  const handleCreate = () => {
    setUsername('');
    setRollNumber('');
    setPopupType('create');
    openPopup();
  }

  const handleUsernameChange=(e)=>{
    setUsername(e.target.value);
    setShowErrorMsg(false);
  }

  const handleRollNumberChange=(e)=>{
    setRollNumber(e.target.value);
    setShowErrorMsg(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(popupType == 'create' && username!=='' && username!==undefined && rollNumber!=='' && rollNumber!==undefined){
      var obj = {};
      obj.name = username;
      obj.rollNumber  = rollNumber;
      axios
      .post("/api/candidate/create", obj)
      .then(response => {
        if(!response.data.success){
          setError('Name or rollNumber is missing!');
          alert.error("error in updating candidate")
          setShowErrorMsg(true);
        } else {
          alert.success("candidate created successfully")
          setShowErrorMsg(false);
          getCandidates()
          hidePopUp();
        }
      })
      .catch(error => {      
        console.log("failed", error);
      });
    } else if(popupType == 'edit') {
      updateCandidate()
    }
  }

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate)
    setUsername(candidate.name);
    setRollNumber(candidate.rollNumber || '');
    setPopupType('edit');
    openPopup()
  }

  const updateCandidate = async () => {
    if(username!=='' && username!==undefined && rollNumber!=='' && rollNumber!==undefined){
      var obj = {};
      obj.name = username;
      obj.rollNumber  = rollNumber;
      obj._id = selectedCandidate._id
      axios
      .put("/api/candidate/update", obj)
      .then(response => {
        if(!response.data.success){
          setError('Name or rollNumber is missing!');
          alert.error("error in updating candidate")
          setShowErrorMsg(true);
        } else {
          alert.success("candidate updated successfully")
          setShowErrorMsg(false);
          getCandidates()
          hidePopUp();
        }
      })
      .catch(error => {      
        console.log("failed", error);
      });
    }
  }

  var handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    var data = e.target.value;
    if( data && data !== ""){
      var searchedArray=unfilteredCandidates.filter(el =>{
        if(el.rollNumber!==undefined){
          return el.rollNumber.toLowerCase().indexOf(data.toString().toLowerCase()) !== -1;
        }
      })
      setCandidates(searchedArray)
    } else {
      setCandidates(unfilteredCandidates)
    }
  }

  const goToView = (view, candidateName, docType) => {
    if(view && view.length>0) {
      setSelectedDocument(view);
      sessionStorage.setItem('selectedView',JSON.stringify(view));
      sessionStorage.setItem('selectedViewCandidate',JSON.stringify(candidateName));
      sessionStorage.setItem('selectedViewDocumentType',JSON.stringify(docType));
      history('/operator/view')
    }
  }

  return (
    <div>
      <div className='doc-card'>
        <div className="doc-card__header">
          <p>Candidates</p>
          <button className='doc-button' onClick={handleCreate}>Create</button>
        </div>
        <div className="doc-card__header" style={{margin:0, padding:'0 16px'}}>
          <input style={{height:36}} className="doc-popup-form__input" type="text" name="searchUser" value={searchUser} onChange={handleSearchChange} placeholder="Search by Roll Number" autoComplete="off" />
        </div>
        {candidates && candidates.length>0 ? <div className='doc-card__body'>
          <table className='doc-table'>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Admission Approval</th>
                <th>Answer Sheet</th>
                <th>Packing Slip</th>
                <th>C Form</th>
                <th>Marks Card</th>
                <th>Certificate</th>
                <th>Uploaded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {candidates.map((candidate, i)=> (<tr key={candidate._id}>
                <td>{i+1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.rollNumber}</td>
                <td>
                  {candidate.admissionApprovalSkipped != undefined && candidate.admissionApprovalSkipped == false && (candidate.admissionApproval && candidate.admissionApproval.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.admissionApproval, candidate, 'admissionApproval')}>view</span>}
                  {candidate.admissionApprovalSkipped && candidate.admissionApprovalSkipped == true && <span>Skipped</span>}
                  {candidate.admissionApprovalSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.answerSheetSkipped != undefined && candidate.answerSheetSkipped == false && (candidate.answerSheet && candidate.answerSheet.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.answerSheet, candidate, 'answerSheet')}>view</span>}
                  {candidate.answerSheetSkipped && candidate.answerSheetSkipped == true && <span>Skipped</span>}
                  {candidate.answerSheetSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.packingSlipSkipped != undefined && candidate.packingSlipSkipped == false && (candidate.packingSlip && candidate.packingSlip.length>0) && <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.packingSlip, candidate, 'packingSlip')}>view</span>}
                  {candidate.packingSlipSkipped && candidate.packingSlipSkipped == true && <span>Skipped</span>}
                  {candidate.packingSlipSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.cformSkipped != undefined && candidate.cformSkipped == false && (candidate.cform && candidate.cform.length>0) && <span className='view-button2' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.cform, candidate, 'cform')}>view</span>}
                  {candidate.cformSkipped && candidate.cformSkipped == true && <span>Skipped</span>}
                  {candidate.cformSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.markSheetSkipped != undefined && candidate.markSheetSkipped == false && (candidate.markSheet && candidate.markSheet.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.markSheet, candidate, 'markSheet')}>view</span>}
                  {candidate.markSheetSkipped && candidate.markSheetSkipped == true && <span>Skipped</span>}
                  {candidate.markSheetSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.certificateSkipped != undefined && candidate.certificateSkipped == false && (candidate.certificate && candidate.certificate.length>0) && <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.certificate, candidate, 'certificate')}>view</span>}
                  {candidate.certificateSkipped && candidate.certificateSkipped == true && <span>Skipped</span>}
                  {candidate.certificateSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.updatedBy && candidate.updatedBy!="" ? <span>{candidate.updatedBy}</span>
                  :<span>-</span>}
                </td>
                <td>
                  <span className='view-button2' onClick={()=>handleEdit(candidate)}>Edit</span>
                </td>
              </tr>))}
            </tbody>
          </table>  
        </div>
        :<div className='doc-card__body' style={{padding:10, minHeight:'140px', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <p style={{textAlign:'center'}}>No data found.</p>
        </div>}
      </div>
      {/*popup to candidate creation*/}
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
                  Roll Number
                  </label>
                  <input type="text" className="doc-popup-form__input" name="rollNumber" value={rollNumber} onChange={handleRollNumberChange} placeholder="Roll Number" required autoFocus="" />
                </div>
                {showErrorMsg && <p style={{textAlign: 'center',color: '#ff5151', fontSize:14}}>{error}</p>}
                <div style={{textAlign:'right'}}>
                  <button className='doc-button doc-button-cancel' type='button' onClick={hidePopUp}>Cancel</button>  
                  <button className='doc-button' type='submit' style={{marginLeft:10}} onClick={openPopup}>Create</button> 
                </div>
              </div>
            </form>
          </div>   
        </div>
      </div>
    </div>
  );
}

export default OperatorUserPage;