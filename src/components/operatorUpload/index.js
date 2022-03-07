import React, {useEffect ,useState } from 'react';
import './operatorUpload.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { trackPromise } from 'react-promise-tracker';

function OperatorUpload (props) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [username, setUsername] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [answerSheetFile, setAnswerSheetFile] = useState(null);
  const [pattingSheetFile, setPattingSheetFile] = useState(null);
  const [cformFile, setCformFile] = useState(null);
  const [markSheetFile, setMarkSheetFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [answerSheetSkipped, setAnswerSheetSkipped] = useState('mandatory');
  const [pattingSheetSkipped, setPattingSheetSkipped] = useState('mandatory');
  const [cformSkipped, setCformSkipped] = useState('mandatory');
  const [markSheetSkipped, setMarkSheetSkipped] = useState('mandatory');
  const [certificateSkipped, setCertificateSkipped] = useState('mandatory');

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
      setCandidates(userList);
      setSelectedCandidate(userList[0])
    } catch (err) {
      console.log("error",err);
      setCandidates([])
    }
  }

  const handleCandidateChange = (event) => {
    var temp= JSON.parse(event.target.value)
     setSelectedCandidate(temp);
     console.log("Selcted", temp)
  }

  const handleAnswerSheetFileChange=(e)=>{
    if(e.target.files.length>0){
      if(e.target.name==='file'){
        console.log("file",e.target.files);
        setAnswerSheetFile(e.target.files[0]);
      }
    }
  }
  const handlePattingSheetFileChange=(e)=>{
    if(e.target.files.length>0){
      if(e.target.name==='file'){
        console.log("file",e.target.files);
        setPattingSheetFile(e.target.files[0]);
      }
    }
  }
  const handleCformFileChange=(e)=>{
    if(e.target.files.length>0){
      if(e.target.name==='file'){
        console.log("file",e.target.files);
        setCformFile(e.target.files[0]);
      }
    }
  }
  const handlemarkSheetFileChange=(e)=>{
    if(e.target.files.length>0){
      if(e.target.name==='file'){
        console.log("file",e.target.files);
        setMarkSheetFile(e.target.files[0]);
      }
    }
  }
  const handleCertificateFileChange=(e)=>{
    if(e.target.files.length>0){
      if(e.target.name==='file'){
        console.log("file",e.target.files);
        setCertificateFile(e.target.files[0]);
      }
    }
  }
  
  var clearFileUploadFields=()=>{
    //document.getElementById("createUser").style.display='none';
    //document.getElementById("uploadFile").value="";
    //setOpenUpload(false)
  }

  const handleSkippedChange = (e) => {
    if(e.target.name === "answerSheetSkipped") {
      setAnswerSheetSkipped(e.target.value)
    } else if(e.target.name === "pattingSheetSkipped") {
      setPattingSheetSkipped(e.target.value)
    } else if(e.target.name === "cformSkipped") {
      setCformSkipped(e.target.value)
    } else if(e.target.name === "markSheetSkipped") {
      setMarkSheetSkipped(e.target.value)
    } else if(e.target.name === "certificateSkipped") {
      setCertificateSkipped(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(answerSheetSkipped == "mandatory" && answerSheetFile == null) {
      return
    } else if (pattingSheetSkipped == "mandatory" && pattingSheetFile == null) {
      return
    } else if (cformSkipped == "mandatory" && cformFile == null) {
      return
    } else if (markSheetSkipped == "mandatory" && markSheetFile == null) {
      return
    } else if (certificateSkipped == "mandatory" && certificateFile == null) {
      return
    } 
    var promises = [];
    var answerSheetFormData = new FormData();
    if(answerSheetSkipped == "mandatory" && answerSheetFile != null) {
      answerSheetFormData.append('file', answerSheetFile);
      answerSheetFormData.append('answerSheetSkipped', false);
      answerSheetFormData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", answerSheetFormData, configuration));
      promises.push(apiCall(answerSheetFormData));
    } else if(answerSheetSkipped == "skipped") {
      answerSheetFormData.append('answerSheetSkipped', true);
      answerSheetFormData.append('_id', selectedCandidate._id);
      // answerSheetFormData.push(axios.put("/api/candidate/upload", answerSheetFormData, configuration));
      promises.push(apiCall(answerSheetFormData));
    }
    var pattingSheetFormData = new FormData();
    if (pattingSheetSkipped == "mandatory" && pattingSheetFile != null) {
      pattingSheetFormData.append('file', pattingSheetFile);
      pattingSheetFormData.append('pattingSheetSkipped', false);
      pattingSheetFormData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", pattingSheetFormData, configuration));
      promises.push(apiCall(pattingSheetFormData));
    } else if(pattingSheetSkipped == "skipped") {
      pattingSheetFormData.append('pattingSheetSkipped', true);
      pattingSheetFormData.append('_id', selectedCandidate._id);
      // pattingSheetFormData.push(axios.put("/api/candidate/upload", pattingSheetFormData, configuration));
      promises.push(apiCall(pattingSheetFormData));
    }
    var cformData = new FormData();
    if (cformSkipped == "mandatory" && cformFile != null) {
      cformData.append('file', cformFile);
      cformData.append('cformSkipped', false);
      cformData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", cformData, configuration));
      promises.push(apiCall(cformData));
    } else if(cformSkipped == "skipped") {
      cformData.append('cformSkipped', true);
      cformData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", cformData, configuration));
      promises.push(apiCall(cformData));
    }
    var markSheetFormData = new FormData();
    if (markSheetSkipped == "mandatory" && markSheetFile != null) {
      markSheetFormData.append('file', markSheetFile);
      markSheetFormData.append('markSheetSkipped', false);
      markSheetFormData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", markSheetFormData, configuration));
      promises.push(apiCall(markSheetFormData));
    } else if(markSheetSkipped == "skipped") {
      markSheetFormData.append('markSheetSkipped', true);
      markSheetFormData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", markSheetFormData, configuration));
      promises.push(apiCall(markSheetFormData));
    }
    var certificateFormData = new FormData();
    if (certificateSkipped == "mandatory" && certificateFile != null) {
      certificateFormData.append('file', certificateFile)
      certificateFormData.append('certificateSkipped', false);
      certificateFormData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", certificateFormData, configuration));
      promises.push(apiCall(certificateFormData));
    }  else if(certificateSkipped == "skipped") {
      certificateFormData.append('certificateSkipped', true);
      certificateFormData.append('_id', selectedCandidate._id);
      // promises.push(axios.put("/api/candidate/upload", certificateFormData, configuration));
      promises.push(apiCall(certificateFormData));
    }
    // if(answerSheetFile != null && pattingSheetFile != null && cformFile != null && markSheetFile != null && certificateFile != null){
      await Promise.all(promises).then(function(response) {
        console.log("INSIDE PROMISES", response);
        alert.success("Data uploaded successfully")
      }, function(error) {
        console.log("Error PROMISES", error)
        alert.error("Data upload failed")
      });
    // }
  }

  const apiCall = async (body) => {
    console.log("BODY",body);
    const configuration = { headers: { "Content-Type": "multipart/form-data" } };
    return await trackPromise(axios.put("/api/candidate/upload", body, configuration))
    // .then(function(response) {
    //   console.log("response", response);
    //   alert.success("Data uploaded successfully")
    // }, function(error) {
    //   console.log("Error", error)
    //   alert.error("Data upload failed")
    // }));
  }

  return (
    <div>
      <div className="doc-popup" style={{maxWidth:'auto', backgroundColor:'transparent', boxShadow:'none'}}>
        <div className="doc-popup-form" style={{maxWidth:'600px'}}>
          <form onSubmit={handleSubmit}>
            <div className="doc-popup-form__inner">
              <div className="doc-popup-title">
                <span>Upload Documents</span>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Name
                </label>
                <select className="doc-popup-form__input" autoComplete="off" value={JSON.stringify(selectedCandidate)} onChange={handleCandidateChange} required>
                  {candidates.map((data,i)=>{
                    return (<option key={i} value={JSON.stringify(data)}>{data.name}</option>)
                  })}
                </select>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Answer Sheet
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={answerSheetSkipped == "skipped"} name="file" accept=".pdf" onChange={handleAnswerSheetFileChange} placeholder="Select File" autoComplete="off" required={answerSheetSkipped == "mandatory"} />
                  <div style={{display:'flex', margin:'0 12px'}}>
                    <input type="radio" value="mandatory" name="answerSheetSkipped" id="answerSheetMandatory"
                      onClick={handleSkippedChange} defaultChecked={true} 
                      checked={answerSheetSkipped === "mandatory"}
                    />
                    <label for="answerSheetMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                    <input type="radio" value="skipped" name="answerSheetSkipped" id="answerSheetSkipped"
                      onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                      checked={answerSheetSkipped == "skipped"}
                    />
                    <label for="answerSheetSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Patting Sheet
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={pattingSheetSkipped == "skipped"} name="file" accept=".pdf" onChange={handlePattingSheetFileChange} placeholder="Select File" autoComplete="off" required={pattingSheetSkipped == "mandatory"}  />
                  <div style={{display:'flex',margin:'0 12px'}}>
                    <input type="radio" value="mandatory" name="pattingSheetSkipped" id="pattingSheetMandatory"
                      onClick={handleSkippedChange} defaultChecked={true}
                      checked={pattingSheetSkipped === "mandatory"}
                    />
                    <label for="pattingSheetMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                    <input type="radio" value="skipped" name="pattingSheetSkipped" id="pattingSheetSkipped"
                      onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                      checked={pattingSheetSkipped == "skipped"}
                    />
                    <label for="pattingSheetSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  C Form
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={cformSkipped == "skipped"} name="file" accept=".pdf" onChange={handleCformFileChange} placeholder="Select File" autoComplete="off" required={cformSkipped == "mandatory"} />
                  <div style={{display:'flex', margin:'0 12px'}}>
                    <input type="radio" value="mandatory" name="cformSkipped" id="cformMandatory"
                      onClick={handleSkippedChange} defaultChecked={true}
                      checked={cformSkipped === "mandatory"}
                    />
                    <label for="cformMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                    <input type="radio" value="skipped" name="cformSkipped" id="cformSkipped"
                      onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                      checked={cformSkipped == "skipped"}
                    />
                    <label for="cformSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Mark Sheet
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={markSheetSkipped == "skipped"} name="file" accept=".pdf" onChange={handlemarkSheetFileChange} placeholder="Select File" autoComplete="off" required={markSheetSkipped == "mandatory"} />
                  <div style={{display:'flex', margin:'0 12px'}}>
                    <input type="radio" value="mandatory" name="markSheetSkipped" id="markSheetMandatory"
                      onClick={handleSkippedChange}
                      checked={markSheetSkipped === "mandatory"} defaultChecked={true}
                    />
                    <label for="markSheetMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                    <input type="radio" value="skipped" name="markSheetSkipped" id="markSheetSkipped"
                      onClick={handleSkippedChange} style={{marginLeft: 12}}
                      checked={markSheetSkipped == "skipped"} defaultChecked={false}
                    />
                    <label for="markSheetSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Certificate
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={certificateSkipped == "skipped"} name="file" accept=".pdf" onChange={handleCertificateFileChange} placeholder="Select File" autoComplete="off" required={certificateSkipped == "mandatory"} />
                  <div style={{display:'flex', margin:'0 12px'}}>
                    <input type="radio" value="mandatory" name="certificateSkipped" id="certificateMandatory"
                      onClick={handleSkippedChange}
                      checked={certificateSkipped === "mandatory"} defaultChecked={true}
                    />
                    <label for="certificateMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                    <input type="radio" value="skipped" name="certificateSkipped" id="certificateSkipped"
                      onClick={handleSkippedChange} style={{marginLeft: 12}}
                      checked={certificateSkipped == "skipped"} defaultChecked={false}
                    />
                    <label for="certificateSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                  </div>
                </div>
              </div>
              {showErrorMsg && <p style={{textAlign: 'center',color: '#ff5151', fontSize:14}}>{error}</p>}
              <div style={{textAlign:'right'}}>
                <button className='doc-button' type='submit' style={{marginLeft:10}} onClick={handleSubmit}>Create</button> 
              </div>
            </div>
          </form>
        </div>   
      </div>
    </div>
  );
}

export default OperatorUpload;