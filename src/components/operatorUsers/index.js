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
  const [trades, setTrades] = useState([]);
  const [subjects, setSubjects] = useState([{name:'Trade Practical', short:'TP'}, {name:'Trade Theory', short:'TT'}, {name:'Trade Sessional', short:'TS'}, {name:'Workshop Calculation and Science', short:'WSC'}, {name:'Engineering Drawing', short:'ED'}, {name:'Employability Skill', short:'ES'}]);
  const [types, setTypes] = useState([{name:'PNTC', short:'PNTC'}, {name:'PSTC', short:'PSTC'}, {name:'PMS', short:'PMS'}, {name:'PNAC', short:'PNAC'}]);
  const [monthArray, setMonthArray] = useState([]);
  const [yearArray, setYearArray] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedDocumentArray, setSelectedDocumentArray] = useState({files:[], fields: []});
  const [selectedDocumentSkipped, setSelectedDocumentSkipped] = useState('mandatory');
  const [searchUser , setSearchValue] = useState("");
  const history = useNavigate();
  

  useEffect(()=>{
    getCandidates();
    getTrades();
    setMonthArray(getMonths());
    setYearArray(getYears());
    setSelectedDocumentArray({files:[], fields: []});
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

  const getTrades = async () => {
    try {
      let response = await trackPromise(axios.get('/api/trade/getAll'));
      var tradeList = response.data.message || [];
      var tradesArr = [];
      for(var i=0; i<tradeList.length; i++) {
        tradesArr.push({name: tradeList[i], short:tradeList[i]});
      }
      setTrades(tradesArr);
    } catch (err) {
      console.log("error",err);
      setTrades([])
    }
  }

  const uniqueId=()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }

  const getYears = () => {
    const currentYear = (new Date()).getFullYear();
    const start = currentYear;
    const stop = currentYear - 50;
    const step = -1;
    const years = Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    return years;
  }

  const getMonths = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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

  const openUploadPopup=(type, candidate)=> {
    setSelectedCandidate(candidate);
    setSelectedDocumentType(type);
    document.getElementById('uploadFilePopup').style.display = 'block';
  }

  const hideUploadPopUp=()=> {
    document.getElementById('uploadFilePopup').style.display = 'none';
    setSelectedCandidate({});
    setSelectedDocumentSkipped('mandatory');
    setSelectedDocumentType(null);
    setSelectedDocumentArray({files:[], fields: []});
  }

  const addSelectedDocument = () => {
    var tempArray = {id:uniqueId(),fileName: '', subject: subjects[0].name || '', month: getMonths()[0], year:getYears()[0]};
    if(selectedDocumentType === "admissionApproval") {
      tempArray = {id:uniqueId(),fileName: '', trade: trades[0].name || '', month: getMonths()[0], year:getYears()[0]};
    } else if (selectedDocumentType === 'certificate') {
      tempArray = {id:uniqueId(),fileName: '', type: types[0].name || '', month: getMonths()[0], year:getYears()[0]};
    } else if (selectedDocumentType === 'cform') {
      tempArray = {id:uniqueId(),fileName: '', month: getMonths()[0], year:getYears()[0]};
    }
    var arr={...selectedDocumentArray};
    if(selectedDocumentSkipped == "mandatory") {
      arr.fields.push(tempArray);
      setSelectedDocumentArray(arr);
    }
  }

  const deleteSelectedDocument = (index) => {
    var arr={...selectedDocumentArray};
    if(arr.fields.length>1){
      arr.fields.splice(index,1);
      arr.files.splice(index,1);
      setSelectedDocumentArray(arr);
    } else if(selectedDocumentSkipped == "mandatory") {
      alert.error("Admission approval is mandatory!")
    }
  }

  const handleSelectedDocumentChange=(e, index)=>{
    var arr = {...selectedDocumentArray};
    if(e.target.name==='file' && e.target.files.length>0){
      arr.files[index] = e.target.files[0];
      arr.fields[index].fileName = e.target.files[0].name;
    } else if(e.target.name==="trade"){
      arr.fields[index].trade = e.target.value;
    } else if(e.target.name==="subject"){
      arr.fields[index].subject = e.target.value;
    } else if(e.target.name==="type"){
      arr.fields[index].type = e.target.value;
    } else if(e.target.name==="month"){
      arr.fields[index].month = e.target.value;
    } else if(e.target.name==="year"){
      arr.fields[index].year = e.target.value;
    }
    if(e.target.name==='file' && e.target.files.length<=0){
      arr.files[index] = {};
      arr.fields[index].fileName = '';
    }
    setSelectedDocumentArray(arr);
  }

  const handleSkippedChange = (e) => {
    var arr = {files:[], fields:[]};
    setSelectedDocumentSkipped(e.target.value);
      if(e.target.value === "skipped") {
        setSelectedDocumentArray(arr);
      }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {username: ''};
    if (selectedDocumentSkipped == "mandatory" && selectedDocumentArray.files && selectedDocumentArray.files.length<=0) {
      alert.error("All fields are required!")
      return
    }
    var selectedDocumentFormData = new FormData();
    if(selectedDocumentSkipped == "mandatory") {
      selectedDocumentFormData.append('files', selectedDocumentArray.files);
      for(let i =0; i < selectedDocumentArray.files.length; i++) {
        selectedDocumentFormData.append("files", selectedDocumentArray.files[i]);
      }
      selectedDocumentFormData.append('fields', JSON.stringify(selectedDocumentArray.fields));
      selectedDocumentFormData.append(selectedDocumentType+'Skipped', false);
      selectedDocumentFormData.append('_id', selectedCandidate._id);
      selectedDocumentFormData.append('updatedBy', userData.username);
    } else if(selectedDocumentSkipped == "skipped") {
      selectedDocumentFormData.append(selectedDocumentType+'Skipped', true);
      selectedDocumentFormData.append('_id', selectedCandidate._id);
      selectedDocumentFormData.append('updatedBy', userData.username);
    }
    try {
      const configuration = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await trackPromise(axios.put("/api/candidate/upload", selectedDocumentFormData, configuration));
      getCandidates();
      hideUploadPopUp();
      alert.success("Uploaded Successfully")
    } catch(err){
      console.log(err);
      alert.error("Upload failed! Please try again")
    }
  }

  const goToView = (view, candidateName, docType) => {
    if(view && view.length>0) {
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
                  <div style={{display:'flex', alignItems:'center'}}>
                    {candidate.admissionApprovalSkipped != undefined && candidate.admissionApprovalSkipped == false && (candidate.admissionApproval && candidate.admissionApproval.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.admissionApproval, candidate, 'admissionApproval')}>view</span>}
                    {candidate.admissionApprovalSkipped && candidate.admissionApprovalSkipped == true && <span>Skipped</span>}
                    {candidate.admissionApprovalSkipped == undefined && <span>-</span>}
                    <div className='view-button' onClick={()=>openUploadPopup('admissionApproval', candidate)} style={{padding:'0.45em 0.5em', margin: '0 8px', display:'inline-flex'}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit-2"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center'}}>
                    {candidate.answerSheetSkipped != undefined && candidate.answerSheetSkipped == false && (candidate.answerSheet && candidate.answerSheet.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.answerSheet, candidate, 'answerSheet')}>view</span>}
                    {candidate.answerSheetSkipped && candidate.answerSheetSkipped == true && <span>Skipped</span>}
                    {candidate.answerSheetSkipped == undefined && <span>-</span>}
                    <div className='view-button' onClick={()=>openUploadPopup('answerSheet', candidate)} style={{padding:'0.45em 0.5em', margin: '0 8px', display:'inline-flex'}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit-2"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center'}}>
                    {candidate.packingSlipSkipped != undefined && candidate.packingSlipSkipped == false && (candidate.packingSlip && candidate.packingSlip.length>0) && <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.packingSlip, candidate, 'packingSlip')}>view</span>}
                    {candidate.packingSlipSkipped && candidate.packingSlipSkipped == true && <span>Skipped</span>}
                    {candidate.packingSlipSkipped == undefined && <span>-</span>}
                    <div className='view-button1' onClick={()=>openUploadPopup('packingSlip', candidate)} style={{padding:'0.45em 0.5em', margin: '0 8px', display:'inline-flex'}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit-2"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center'}}>
                    {candidate.cformSkipped != undefined && candidate.cformSkipped == false && (candidate.cform && candidate.cform.length>0) && <span className='view-button2' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.cform, candidate, 'cform')}>view</span>}
                    {candidate.cformSkipped && candidate.cformSkipped == true && <span>Skipped</span>}
                    {candidate.cformSkipped == undefined && <span>-</span>}
                    <div className='view-button2' onClick={()=>openUploadPopup('cform', candidate)} style={{padding:'0.45em 0.5em', margin: '0 8px', display:'inline-flex'}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit-2"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center'}}>
                    {candidate.markSheetSkipped != undefined && candidate.markSheetSkipped == false && (candidate.markSheet && candidate.markSheet.length>0) && <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.markSheet, candidate, 'markSheet')}>view</span>}
                    {candidate.markSheetSkipped && candidate.markSheetSkipped == true && <span>Skipped</span>}
                    {candidate.markSheetSkipped == undefined && <span>-</span>}
                    <div className='view-button' onClick={()=>openUploadPopup('markSheet', candidate)} style={{padding:'0.45em 0.5em', margin: '0 8px', display:'inline-flex'}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit-2"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:'flex', alignItems:'center'}}>
                    {candidate.certificateSkipped != undefined && candidate.certificateSkipped == false && (candidate.certificate && candidate.certificate.length>0) && <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.certificate, candidate, 'certificate')}>view</span>}
                    {candidate.certificateSkipped && candidate.certificateSkipped == true && <span>Skipped</span>}
                    {candidate.certificateSkipped == undefined && <span>-</span>}
                    <div className='view-button1' onClick={()=>openUploadPopup('certificate', candidate)} style={{padding:'0.45em 0.5em', margin: '0 8px', display:'inline-flex'}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-edit-2"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                    </div>
                  </div>
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
                  <button className='doc-button' type='submit' style={{marginLeft:10}}>Create</button> 
                </div>
              </div>
            </form>
          </div>   
        </div>
      </div>
      {/*popup to upload document*/}
      <div id="uploadFilePopup" className="nj-overly add-rebound-animation" >
        <div className="doc-popup my-popup" style={{maxWidth:450}}>
          <div className="doc-popup-form" style={{maxWidth:450}}>
            <form onSubmit={handleUploadSubmit}>
              <div className="doc-popup-form__inner" style={{maxHeight:'78vh', overflow:'auto'}}>
                <div className="doc-popup-title">
                  <span style={{textTransform:'capitalize'}}>{selectedDocumentType}</span>
                  <span onClick={hideUploadPopUp} className="doc-popup__close">
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
                  <div className='' style={{display:'flex', alignItems: 'center', justifyContent:'space-between', margin:'10px 0'}}>
                    <div>
                      <div style={{display:'inline', margin:'0 12px'}}>
                        <input type="radio" value="mandatory" name="selectedDocumentSkipped" id="selectedDocumentMandatory"
                          onClick={handleSkippedChange} defaultChecked={true} 
                          checked={selectedDocumentSkipped === "mandatory"}
                        />
                        <label htmlFor="selectedDocumentMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                        <input type="radio" value="skipped" name="selectedDocumentSkipped" id="selectedDocumentSkipped"
                          onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                          checked={selectedDocumentSkipped == "skipped"}
                        />
                        <label htmlFor="selectedDocumentSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                      </div>
                    </div>
                  {selectedDocumentSkipped == "mandatory" && <div style={{marginLeft:10, cursor:'pointer'}} disabled={selectedDocumentSkipped == "skipped"} onClick={addSelectedDocument}>
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
                        className="feather feather-plus-circle"
                      >
                        <circle cx={12} cy={12} r={10} />
                        <line x1={12} y1={8} x2={12} y2={16} />
                        <line x1={8} y1={12} x2={16} y2={12} />
                      </svg>
                    </div>}
                  </div>
                  {selectedDocumentArray.fields && selectedDocumentArray.fields.length>0 && selectedDocumentArray.fields.map((item, i) => {
                    return (<div style={{border:'1px solid #afb6bd', borderRadius:8, padding:20, marginBottom:16}} key={i}>
                      <div className="pull-right" title="Remove" onClick={()=>deleteSelectedDocument(i)} style={{color:'rgb(251, 104, 104)',cursor:'pointer', textAlign:'right', marginRight:'-12px', marginTop:'-12px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                          strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </div>
                      <div style={{paddingBottom:10}}>
                        <label className="doc-popup-form__label">File</label>
                        <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={selectedDocumentSkipped == "skipped"} name="file" accept=".pdf" onChange={($event)=>handleSelectedDocumentChange($event, i)} placeholder="Select File" autoComplete="off" required={selectedDocumentSkipped == "mandatory"} />
                        {item.fileName && item.fileName!='' && <p style={{margin:'4px 0'}}><b>Selected File: </b>{item.fileName}</p>}
                      </div>
                      {selectedDocumentType === "admissionApproval" && <div style={{paddingBottom:10}}>
                        <label className="doc-popup-form__label">Trade</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="trade" value={item.trade} onChange={($event)=>handleSelectedDocumentChange($event, i)} disabled={selectedDocumentSkipped == "skipped"} required>
                          {trades.map((data,i)=>{
                            return (<option key={i} value={data.name}>{data.name}</option>)
                          })}
                        </select>
                      </div>}
                      {selectedDocumentType === 'certificate' && <div style={{paddingBottom:10}}>
                        <label className="doc-popup-form__label">Type</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="type" value={item.type} onChange={($event)=>handleSelectedDocumentChange($event, i)} disabled={selectedDocumentSkipped == "skipped"} required>
                          {types.map((data,i)=>{
                            return (<option key={i} value={data.name}>{data.name}</option>)
                          })}
                        </select>
                      </div>}
                      {(selectedDocumentType === 'answerSheet' || selectedDocumentType === 'packingSlip' || selectedDocumentType === 'markSheet') && <div style={{paddingBottom:10}}>
                        <label className="doc-popup-form__label">Subject</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="subject" value={item.subject} onChange={($event)=>handleSelectedDocumentChange($event, i)} disabled={selectedDocumentSkipped == "skipped"} required>
                          {subjects.map((data,i)=>{
                            return (<option key={i} value={data.name}>{data.name}</option>)
                          })}
                        </select>
                      </div>}
                      <div style={{display:'flex'}}>
                        <div style={{paddingRight:10}}>
                          <label className="doc-popup-form__label">Month</label>
                          <select className="doc-popup-form__input" autoComplete="off" name="month" value={item.month} onChange={($event)=>handleSelectedDocumentChange($event, i)} disabled={selectedDocumentSkipped == "skipped"} required>
                            {monthArray.map((data,i)=>{
                              return (<option key={i} value={data}>{data}</option>)
                            })}
                          </select>
                        </div>
                        <div>
                          <label className="doc-popup-form__label">Year</label>
                          <select className="doc-popup-form__input" autoComplete="off" name="year" value={item.year} onChange={($event)=>handleSelectedDocumentChange($event, i)} disabled={selectedDocumentSkipped == "skipped"} required>
                            {yearArray.map((data,i)=>{
                              return (<option key={i} value={data}>{data}</option>)
                            })}
                          </select>
                        </div>
                      </div>
                    </div>)
                  })}
                </div>
                {showErrorMsg && <p style={{textAlign: 'center',color: '#ff5151', fontSize:14}}>{error}</p>}
                <div style={{textAlign:'right'}}>
                  <button className='doc-button doc-button-cancel' type='button' onClick={hideUploadPopUp}>Cancel</button>  
                  <button className='doc-button' type='submit' style={{marginLeft:10}}>Submit</button> 
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