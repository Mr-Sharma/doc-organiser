import React, {useEffect ,useState } from 'react';
import './operatorUpload.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
  const [answerSheetSkipped, setAnswerSheetSkipped] = useState(false);
  const [pattingSheetSkipped, setPattingSheetSkipped] = useState(false);
  const [cformSkipped, setCformSkipped] = useState(false);
  const [markSheetSkipped, setMarkSheetSkipped] = useState(false);
  const [certificateSkipped, setCertificateSkipped] = useState(false);

  const history = useNavigate();

  useEffect(()=>{
    getCandidates()
  }, []);

  const getCandidates = async () => {
    try {
      let response = await axios.get('/api/candidate/get');
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
    setAnswerSheetSkipped(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(username!=='' && username!==undefined && aadhar!=='' && aadhar!==undefined){
      var obj = {};
      obj.name = username;
      obj.aadhar  = aadhar;
      axios
      .post("/api/candidate/create", obj)
      .then(response => {
        if(!response.data.success){
          setError('Name or aadhar is missing!');
          setShowErrorMsg(true);
        } else {
          setShowErrorMsg(false);
          getCandidates();
        }
      })
      .catch(error => {      
        console.log("failed", error);
      });
    }
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
                <select className="doc-popup-form__input" autoComplete="off" required>
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
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" name="file" accept=".pdf" onChange={handleAnswerSheetFileChange} placeholder="Select File" autoComplete="off" required />
                  <div style={{display:'flex'}}>
                    <input type="radio" value="mandatory" name="answerSheetSkipped" id="answerSheetMandatory"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped === "mandatory"}
                    />
                    <label for="answerSheetMandatory" style={{fontSize:14}}>Mandatory</label>

                    <input type="radio" value="skipped" name="answerSheetSkipped" id="answerSheetSkipped"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped == "skipped"}
                    />
                    <label for="answerSheetSkipped" style={{fontSize:14}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Patting Sheet
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" name="file" accept=".pdf" onChange={handleAnswerSheetFileChange} placeholder="Select File" autoComplete="off" required />
                  <div style={{display:'flex'}}>
                    <input type="radio" value="mandatory" name="answerSheetSkipped" id="answerSheetMandatory"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped === "mandatory"}
                    />
                    <label for="answerSheetMandatory" style={{fontSize:14}}>Mandatory</label>

                    <input type="radio" value="skipped" name="answerSheetSkipped" id="answerSheetSkipped"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped == "skipped"}
                    />
                    <label for="answerSheetSkipped" style={{fontSize:14}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  C Form
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" name="file" accept=".pdf" onChange={handleAnswerSheetFileChange} placeholder="Select File" autoComplete="off" required />
                  <div style={{display:'flex'}}>
                    <input type="radio" value="mandatory" name="answerSheetSkipped" id="answerSheetMandatory"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped === "mandatory"}
                    />
                    <label for="answerSheetMandatory" style={{fontSize:14}}>Mandatory</label>

                    <input type="radio" value="skipped" name="answerSheetSkipped" id="answerSheetSkipped"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped == "skipped"}
                    />
                    <label for="answerSheetSkipped" style={{fontSize:14}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Mark Sheet
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" name="file" accept=".pdf" onChange={handleAnswerSheetFileChange} placeholder="Select File" autoComplete="off" required />
                  <div style={{display:'flex'}}>
                    <input type="radio" value="mandatory" name="answerSheetSkipped" id="answerSheetMandatory"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped === "mandatory"}
                    />
                    <label for="answerSheetMandatory" style={{fontSize:14}}>Mandatory</label>

                    <input type="radio" value="skipped" name="answerSheetSkipped" id="answerSheetSkipped"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped == "skipped"}
                    />
                    <label for="answerSheetSkipped" style={{fontSize:14}}>Skip</label>
                  </div>
                </div>
              </div>
              <div className="doc-popup-form-input-wrap">
                <label className="doc-popup-form__label">
                  Certificate
                </label>
                <div style={{display:'flex', alignItems:'center'}}>
                  <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" name="file" accept=".pdf" onChange={handleAnswerSheetFileChange} placeholder="Select File" autoComplete="off" required />
                  <div style={{display:'flex'}}>
                    <input type="radio" value="mandatory" name="answerSheetSkipped" id="answerSheetMandatory"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped === "mandatory"}
                    />
                    <label for="answerSheetMandatory" style={{fontSize:14}}>Mandatory</label>

                    <input type="radio" value="skipped" name="answerSheetSkipped" id="answerSheetSkipped"
                      onClick={handleSkippedChange}
                      checked={answerSheetSkipped == "skipped"}
                    />
                    <label for="answerSheetSkipped" style={{fontSize:14}}>Skip</label>
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