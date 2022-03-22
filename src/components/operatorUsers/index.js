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
      var finalList = [];
      for(let i=0;i<userList.length;i++) {
        if(userList[i].answerSheetSkipped != undefined || userList[i].packingSlipSkipped != undefined || 
          userList[i].cformSkipped != undefined || userList[i].markSheetSkipped != undefined || 
          userList[i].certificateSkipped != undefined || userList[i].admissionApprovalSkipped != undefined) {
            finalList.push(userList[i]);
        }
      }
      setCandidates(finalList);
      setUnfilteredCandidates(finalList);
    } catch (err) {
      console.log("error",err);
      setCandidates([])
      setUnfilteredCandidates([]);
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

  return (
    <div>
      <div className='doc-card'>
        <div className="doc-card__header">
          <p>Documents</p>
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
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, i)=> (<tr key={candidate._id}>
                <td>{i+1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.rollNumber}</td>
                <td>
                  {!candidate.admissionApprovalSkipped && (candidate.admissionApproval && candidate.admissionApproval.length>0) ? <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.admissionApproval, candidate, 'admissionApproval')}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                  {!candidate.answerSheetSkipped && (candidate.answerSheet && candidate.answerSheet.length>0) ? <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.answerSheet, candidate, 'answerSheet')}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                {!candidate.packingSlipSkipped && (candidate.packingSlip && candidate.packingSlip.length>0) ? <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.packingSlip, candidate, 'packingSlip')}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                {!candidate.cformSkipped && (candidate.cform && candidate.cform.length>0) ? <span className='view-button2' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.cform, candidate, 'cform')}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                  {!candidate.markSheetSkipped && (candidate.markSheet && candidate.markSheet.length>0) ? <span className='view-button' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.markSheet, candidate, 'markSheet')}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                  {!candidate.certificateSkipped && (candidate.certificate && candidate.certificate.length>0) ? <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>goToView(candidate.certificate, candidate, 'certificate')}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                  {candidate.updatedBy && candidate.updatedBy!="" ? <span>{candidate.updatedBy}</span>
                  :<span>-</span>}
                </td>
                {/* <td>
                  <span className='view-button2' onClick={()=>handleEdit(candidate)}>Edit</span>
                </td> */}
              </tr>))}
            </tbody>
          </table>  
        </div>
        :<div className='doc-card__body' style={{padding:10, minHeight:'140px', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <p style={{textAlign:'center'}}>No data found.</p>
        </div>}
      </div>
    </div>
  );
}

export default OperatorUserPage;