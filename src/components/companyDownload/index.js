import React, {useEffect ,useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { downloadFile } from 'fs-browsers';

function CompanyDownloadPage (props) {
  const [rollNumber, setRollNumber] = useState("");
  const [admissionApprovalAvailable, setAdmissionApprovalAvailable] = useState(false);
  const [documents, setDocuments] = useState({'admissionApproval':false, 'answerSheet':false, 'certificate':false, 'cform':false, 'markSheet':false, 'packingSlip':false});
  const [fetchedDocuments, setFetchedDocuments] = useState([]);

  const history = useNavigate();
  const alert = useAlert()

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment=()=> {
    const data = JSON.parse(sessionStorage.getItem('documentsPaid'));
    const number = sessionStorage.getItem('RollNumberPaid');
    if(data && number) {
      setRollNumber(number);
      setDocuments(data);
      getDocuments(number);
    }
  }

  const getDocuments = async (number) => {
    if(number) {
      try {
        let response = await axios.get('/api/company/documents/'+number);
        var data;
        if(response.data && response.data.message) {
          data = response.data.message;
          setFetchedDocuments(data);
        }
      } catch (err) {
        alert.error("No data found");
      }
    }
  }

  const handleDownload = (type) => {
    if(fetchedDocuments && fetchedDocuments[type] && fetchedDocuments[type].length>0 && fetchedDocuments[type][0].file) {
      fetchedDocuments[type].forEach((doc)=>{
        console.log("jjaskdkdda", doc)
        const downloadURL = "http://localhost:4000"+doc.file.path;
        window.open(downloadURL)
        // downloadFile(downloadURL);
      })
    } else {
      alert.error("Failed to download!");
    }
  }

  return (
    <div>
      <div className="doc-popup-form" style={{maxWidth:'460px', marginTop:'10%'}}>
        <div className="doc-popup-form__inner">
          <div className="doc-popup-title">
            <span>Download Documents</span>
          </div>
          <div className="doc-popup-form-input-wrap">
            {document && documents['admissionApproval'] && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <div style={{fontSize:18}}>Admission Approval</div>
              <div style={{textAlign:'right'}}>
                <button className='doc-button' type='click' onClick={()=>{handleDownload('admissionApproval')}}>Download</button> 
              </div>
            </div>}

            {document && documents['answerSheet'] && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <div style={{fontSize:18}}>Answer Sheet</div>
              <div style={{textAlign:'right'}}>
                <button className='doc-button' type='click' onClick={()=>{handleDownload('answerSheet')}}>Download</button> 
              </div>
            </div>}

            {document && documents['certificate'] && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <div style={{fontSize:18}}>Certificate</div>
              <div style={{textAlign:'right'}}>
                <button className='doc-button' type='click' onClick={()=>{handleDownload('certificate')}}>Download</button> 
              </div>
            </div>}

            {document && documents['cform'] && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <div style={{fontSize:18}}>C Form</div>
              <div style={{textAlign:'right'}}>
                <button className='doc-button' type='click' onClick={()=>{handleDownload('cform')}}>Download</button> 
              </div>
            </div>}

            {document && documents['markSheet'] && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <div style={{fontSize:18}}>Mark Sheet</div>
              <div style={{textAlign:'right'}}>
                <button className='doc-button' type='click' onClick={()=>{handleDownload('markSheet')}}>Download</button> 
              </div>
            </div>}

            {document && documents['packingSlip'] && <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <div style={{fontSize:18}}>Packing Slip</div>
              <div style={{textAlign:'right'}}>
                <button className='doc-button' type='click' onClick={()=>{handleDownload('packingSlip')}}>Download</button> 
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDownloadPage;