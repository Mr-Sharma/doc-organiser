import React, {useEffect ,useState } from 'react';
import './user.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import { useAlert } from 'react-alert'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

function UserPage (props) {
  const [candidates, setCandidates] = useState([]);
  const [unfilteredCandidates, setUnfilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [username, setUsername] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [popupType, setPopupType] = useState("create");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPDF, setShowPDF] = useState(false);
  const [searchUser , setSearchValue] = useState("");
  const history = useNavigate();

  useEffect(()=>{
    getCandidates()
  }, []);

  const alert = useAlert()

  const getCandidates = async () => {
    try {
      let response = await trackPromise(axios.get('/api/candidate/get'));
      // alert.success('Oh look, an alert!')
      setCandidates(response.data.message || []);
      setUnfilteredCandidates(response.data.message || []);
    } catch (err) {
      console.log("error",err);
      setCandidates([]);
      setUnfilteredCandidates([]);
      alert.error("error in fetching candidates")
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
    setAadhar('');
    setPopupType('create');
    openPopup();
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
    if(popupType == 'create' && username!=='' && username!==undefined && aadhar!=='' && aadhar!==undefined){
      var obj = {};
      obj.name = username;
      obj.aadhar  = aadhar;
      axios
      .post("/api/candidate/create", obj)
      .then(response => {
        if(!response.data.success){
          setError('Name or aadhar is missing!');
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
    setAadhar(candidate.aadhar);
    setPopupType('edit');
    openPopup()
  }

  const updateCandidate = async () => {
    if(username!=='' && username!==undefined && aadhar!=='' && aadhar!==undefined){
      var obj = {};
      obj.name = username;
      obj.aadhar  = aadhar;
      obj._id = selectedCandidate._id
      axios
      .put("/api/candidate/update", obj)
      .then(response => {
        if(!response.data.success){
          setError('Name or aadhar is missing!');
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

  const openDocument = (doc) => {
    setSelectedDocument(doc);
    document.getElementById('adminDocumentPopup').style.display = 'block'
    // setNumPages(null);
    setPageNumber(1);
    setShowPDF(true)
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleBack = () => {
    if(pageNumber>1) {
      setPageNumber(pageNumber-1)
    }
  }
  const handleNext = () => {
    if(pageNumber<numPages) {
      setPageNumber(pageNumber+1)
    }
  }

  var handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    var data = e.target.value;
    if( data && data !== ""){
      var searchedArray=unfilteredCandidates.filter(el =>{
        if(el.aadhar!==undefined){
          return el.aadhar.toLowerCase().indexOf(data.toString().toLowerCase()) !== -1;
        }
      })
      setCandidates(searchedArray)
    } else {
      setCandidates(unfilteredCandidates)
    }
  }

  return (
    <div>
      <div className='doc-card'>
        <div className="doc-card__header">
          <p>Candidates</p>
            <button className='doc-button' onClick={handleCreate}>Create</button>
        </div>
        <div className="doc-card__header" style={{margin:0, padding:'0 24px'}}>
          <input style={{height:36,}} className="doc-popup-form__input" type="text" name="searchUser" value={searchUser} onChange={handleSearchChange} placeholder="Search by aadhar" autoComplete="off" />
        </div>
        {candidates && candidates.length>0 ? <div className='doc-card__body'>
          <table className='doc-table'>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Name</th>
                <th>Aadhar</th>
                <th>Answer Sheet</th>
                <th>Patting Sheet</th>
                <th>C Form</th>
                <th>Marks Card</th>
                <th>Certificate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, i)=> (<tr key={candidate._id}>
                <td>{i+1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.aadhar}</td>
                <td>
                  {candidate.answerSheetSkipped != undefined && candidate.answerSheetSkipped == false && (candidate.answerSheet && candidate.answerSheet.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.answerSheet[0])}>view</span>}
                  {candidate.answerSheetSkipped && candidate.answerSheetSkipped == true && <span>Skipped</span>}
                  {candidate.answerSheetSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.pattingSheetSkipped != undefined && candidate.pattingSheetSkipped == false && (candidate.pattingSheet && candidate.pattingSheet.length>0) && <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.pattingSheet[0])}>view</span>}
                  {candidate.pattingSheetSkipped && candidate.pattingSheetSkipped == true && <span>Skipped</span>}
                  {candidate.pattingSheetSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.cformSkipped != undefined && candidate.cformSkipped == false && (candidate.cform && candidate.cform.length>0) && <span className='view-button2' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.cform[0])}>view</span>}
                  {candidate.cformSkipped && candidate.cformSkipped == true && <span>Skipped</span>}
                  {candidate.cformSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.markSheetSkipped != undefined && candidate.markSheetSkipped == false && (candidate.markSheet && candidate.markSheet.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.markSheet[0])}>view</span>}
                  {candidate.markSheetSkipped && candidate.markSheetSkipped == true && <span>Skipped</span>}
                  {candidate.markSheetSkipped == undefined && <span>-</span>}
                </td>
                <td>
                  {candidate.certificateSkipped != undefined && candidate.certificateSkipped == false && (candidate.certificate && candidate.certificate.length>0) && <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.certificate[0])}>view</span>}
                  {candidate.certificateSkipped && candidate.certificateSkipped == true && <span>Skipped</span>}
                  {candidate.certificateSkipped == undefined && <span>-</span>}
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
                      Aadhar
                    </label>
                    <input type="text" className="doc-popup-form__input" name="aadhar" value={aadhar} onChange={handleAadharChange} placeholder="Aadhar card no." required autoFocus="" />
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
        {/*popup to show document*/}
        <div id="adminDocumentPopup" className="nj-overly add-rebound-animation" >
          <div className="doc-popup my-popup" style={{maxWidth:700, marginTop:'5vh'}}>
            <div className="doc-popup-form" style={{maxWidth:700, overflow:'auto'}}>
                <div className="doc-popup-form__inner">
                  <div className="doc-popup-title">
                    <span onClick={()=>{document.getElementById('adminDocumentPopup').style.display = 'none'}} className="doc-popup__close">
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
                  {showPDF && <div style={{height:'74vh', overflow:'auto', display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                    <Document file={selectedDocument.path} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={pageNumber} />
                    </Document>
                  </div>}
                  <div>
                    <p style={{textAlign:'center'}}>
                      Page {pageNumber} of {numPages}
                    </p>
                    <div style={{textAlign:'center'}}>
                      <span className='view-button' style={{cursor:'pointer', marginRight:8}} onClick={handleBack}>Back</span>
                      <span className='view-button' style={{cursor:'pointer'}} onClick={handleNext}>Next</span>
                    </div>
                  </div>
                </div>
            </div>   
          </div>
        </div>
    </div>
  );
}

export default UserPage;