import React, {useEffect ,useState } from 'react';
import './operatorUser.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { trackPromise } from 'react-promise-tracker';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

function OperatorUserPage (props) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [username, setUsername] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [popupType, setPopupType] = useState("create");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPDF, setShowPDF] = useState(false)
  const history = useNavigate();
  

  useEffect(()=>{
    getCandidates()
  }, []);

  const alert = useAlert()

  const getCandidates = async () => {
    try {
      let response = await trackPromise(axios.get('/api/candidate/get'));
      console.log("getCandidates",response);
      var userList = response.data.message || [];
      var finalList = [];
      for(let i=0;i<userList.length;i++) {
        if(userList[i].answerSheetSkipped != undefined || userList[i].pattingSheetSkipped != undefined || 
          userList[i].cformSkipped != undefined || userList[i].markSheetSkipped != undefined || 
          userList[i].certificateSkipped != undefined) {
            finalList.push(userList[i]);
        }
      }
      setCandidates(finalList);
    } catch (err) {
      console.log("error",err);
      setCandidates([])
    }
  }

  const openPopup=()=> {
    document.getElementById('operatorDocumentPopup').style.display = 'block';
  }

  const hidePopUp=()=> {
    document.getElementById('operatorDocumentPopup').style.display = 'none';
  }


  const openDocument = (document) => {
    setSelectedDocument(document);
    openPopup()
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

  return (
    <div>
      <div className='doc-card'>
        <div className="doc-card__header">
          <p>Documents</p>
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
                <th>Marks Card</th>
                <th>Certificate</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, i)=> (<tr key={candidate._id}>
                <td>{i+1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.aadhar}</td>
                <td>
                  {!candidate.answerSheetSkipped && (candidate.answerSheet && candidate.answerSheet.length>0) ? <span className='view-button' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.answerSheet[0])}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                {!candidate.pattingSheetSkipped && (candidate.pattingSheet && candidate.pattingSheet.length>0) ? <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.pattingSheet[0])}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                {!candidate.cformSkipped && (candidate.cform && candidate.cform.length>0) ? <span className='view-button2' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.cform[0])}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                  {!candidate.markSheetSkipped && (candidate.markSheet && candidate.markSheet.length>0) ? <span className='view-button' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.markSheet[0])}>view</span>
                  :<span>Skipped</span>}
                </td>
                <td>
                  {!candidate.certificateSkipped && (candidate.certificate && candidate.certificate.length>0) ? <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>openDocument(candidate.certificate[0])}>view</span>
                  :<span>Skipped</span>}
                </td>
                {/* <td>
                  <span className='view-button2' onClick={()=>handleEdit(candidate)}>Edit</span>
                </td> */}
              </tr>))}
            </tbody>
          </table>  
        </div>
      </div>
      {/*popup to show document*/}
      <div id="operatorDocumentPopup" className="nj-overly add-rebound-animation" >
          <div className="doc-popup my-popup" style={{maxWidth:700, marginTop:'5vh'}}>
            <div className="doc-popup-form" style={{maxWidth:700, overflow:'auto'}}>
                <div className="doc-popup-form__inner">
                  <div className="doc-popup-title">
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

export default OperatorUserPage;