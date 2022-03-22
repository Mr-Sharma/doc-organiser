import React, {useEffect ,useState } from 'react';
import './userView.scss';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

function UserViewPage (props) {
  const [documentList, setDocumentList] = useState([]);
  const [viewTitle, setViewTitle] = useState(null);
  const [viewDocumentType, setViewDocumentType] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPDF, setShowPDF] = useState(false);
  const history = useNavigate();
  

  useEffect(()=>{
    const selectedView =  JSON.parse(sessionStorage.getItem('selectedView')) || [];
    setDocumentList(selectedView);
    const selectedViewCandidate =  JSON.parse(sessionStorage.getItem('selectedViewCandidate'));
    setViewTitle(selectedViewCandidate.name || 'View Document');
    const selectedViewDocumentType =  JSON.parse(sessionStorage.getItem('selectedViewDocumentType'));
    console.log('selectedViewDocumentType', selectedViewDocumentType)
    setViewDocumentType(selectedViewDocumentType || '');
  }, []);

  const alert = useAlert();

  const openPopup=()=> {
    document.getElementById('operatorDocumentPopup').style.display = 'block';
  }

  const hidePopUp=()=> {
    document.getElementById('operatorDocumentPopup').style.display = 'none';
  }


  const openDocument = (document) => {
    console.log("document", document)
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
          <p>{viewTitle}</p>
          <button className='doc-button' onClick={()=>{history('/admin/users')}}>Back</button>
        </div>
        {documentList && documentList.length>0 ? <div className='doc-card__body'>
          <table className='doc-table'>
            <thead>
              <tr>
                <th>Sl No.</th>
                {viewDocumentType === 'admissionApproval' && <th>Trade</th>}
                {viewDocumentType === 'certificate' && <th>Type</th>}
                {(viewDocumentType === 'answerSheet' || viewDocumentType === 'packingSlip' || viewDocumentType === 'markSheet') && <th>Subject</th>}
                <th>Month</th>
                <th>Year</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {documentList.map((document, i)=> (<tr key={i}>
                <td>{i+1}</td>
                {viewDocumentType === 'admissionApproval' && <td>{document.trade}</td>}
                {viewDocumentType === 'certificate' && <td>{document.type}</td>}
                {(viewDocumentType === 'answerSheet' || viewDocumentType === 'packingSlip' || viewDocumentType === 'markSheet') && <td>{document.subject}</td>}
                <td>{document.month}</td>
                <td>{document.year}</td>
                <td>
                <span className='view-button1' style={{cursor:'pointer'}} onClick={()=>openDocument(document.file)}>view</span>
                </td>
              </tr>))}
            </tbody>
          </table>  
        </div>
        :<div className='doc-card__body' style={{padding:10, minHeight:'140px', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <p style={{textAlign:'center'}}>No data found.</p>
        </div>}
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

export default UserViewPage;