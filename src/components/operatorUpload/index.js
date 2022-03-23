import React, {useEffect ,useState } from 'react';
import './operatorUpload.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { trackPromise } from 'react-promise-tracker';

function OperatorUpload (props) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [trades, setTrades] = useState([]);
  const [subjects, setSubjects] = useState([{name:'Trade Practical', short:'TP'}, {name:'Trade Theory', short:'TT'}, {name:'Trade Sessional', short:'TS'}, {name:'Workshop Calculation and Science', short:'WSC'}, {name:'Engineering Drawing', short:'ED'}, {name:'Employability Skill', short:'ES'}]);
  const [types, setTypes] = useState([{name:'PNTC', short:'PNTC'}, {name:'PSTC', short:'PSTC'}, {name:'PMS', short:'PMS'}, {name:'PNAC', short:'PNAC'}]);
  const [answerSheetArray, setAnswerSheetArray] = useState({files:[], fields: []});
  const [admissionApprovalArray, setAdmissionApprovalArray] = useState({files:[], fields: []});
  const [packingSlipArray, setPackingSlipArray] = useState({files:[], fields: []});
  const [cformArray, setCformArray] = useState({files:[], fields: []});
  const [markSheetArray, setMarkSheetArray] = useState({files:[], fields: []});
  const [certificateArray, setCertificateArray] = useState({files:[], fields: []});
  const [answerSheetSkipped, setAnswerSheetSkipped] = useState('mandatory');
  const [packingSlipSkipped, setPackingSlipSkipped] = useState('mandatory');
  const [cformSkipped, setCformSkipped] = useState('mandatory');
  const [markSheetSkipped, setMarkSheetSkipped] = useState('mandatory');
  const [certificateSkipped, setCertificateSkipped] = useState('mandatory');
  const [admissionApprovalSkipped, setAdmissionApprovalSkipped] = useState('mandatory');
  const [monthArray, setMonthArray] = useState([]);
  const [yearArray, setYearArray] = useState([]);
  const history = useNavigate();

  useEffect(()=>{
    getCandidates();
    getTrades();
    setMonthArray(getMonths());
    setYearArray(getYears());
    setAnswerSheetArray({files:[], fields: []});
    setPackingSlipArray({files:[], fields: []});
    setCformArray({files:[], fields: []});
    setCertificateArray({files:[], fields: []});
    setMarkSheetArray({files:[], fields: []});
    setAdmissionApprovalArray({files:[], fields: []});
  }, []);

  const alert = useAlert()

  const getCandidates = async () => {
    try {
      let response = await trackPromise(axios.get('/api/candidate/get'));
      var userList = response.data.message || [];
      setCandidates(userList);
      setSelectedCandidate(userList[0])
    } catch (err) {
      console.log("error",err);
      setCandidates([])
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
      console.log("RESPONSE",response.data)
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

  const addAdmissionApproval = () => {
    var tempArray = {id:uniqueId(),fileName: '', trade: trades[0].name || '', month: getMonths()[0], year:getYears()[0]};
    var arr={...admissionApprovalArray};
    console.log("ARRRR", arr)
    if(admissionApprovalSkipped == "mandatory") {
      arr.fields.push(tempArray);
      setAdmissionApprovalArray(arr);
    }
  }

  const deleteAdmissionApproval = (index) => {
    var arr={...admissionApprovalArray};
    if(arr.fields.length>1){
      arr.fields.splice(index,1);
      arr.files.splice(index,1);
      setAdmissionApprovalArray(arr);
    } else if(admissionApprovalSkipped == "mandatory") {
      alert.error("Admission approval is mandatory!")
    }
  }

  const addAnswerSheet = () => {
    var tempArray = {id:uniqueId(),fileName: '', subject: subjects[0].name || '', month: getMonths()[0], year:getYears()[0]};
    var arr={...answerSheetArray};
    console.log("ARRRR", arr)
    if(answerSheetSkipped == "mandatory") {
      arr.fields.push(tempArray);
      setAnswerSheetArray(arr);
    }
  }

  const deleteAnswerSheet = (index) => {
    var arr={...answerSheetArray};
    if(arr.fields.length>1){
      arr.fields.splice(index,1);
      arr.files.splice(index,1);
      setAnswerSheetArray(arr);
    } else if(answerSheetSkipped == "mandatory") {
      alert.error("Answer sheet is mandatory!")
    }
  }

  const addPackingSlip = () => {
    var tempArray = {id:uniqueId(),fileName: '', subject: subjects[0].name || '', month: getMonths()[0], year:getYears()[0]};
    var arr = {...packingSlipArray};
    if(packingSlipSkipped == "mandatory") {
      arr.fields.push(tempArray);
      setPackingSlipArray(arr);
    }
  }

  const deletePackingSlip = (index) => {
    var arr = {...packingSlipArray};
    if(arr.fields.length>1){
      arr.fields.splice(index,1);
      arr.files.splice(index,1);
      setPackingSlipArray(arr);
    } else if(packingSlipSkipped == "mandatory") {
      alert.error("Packing Slip is mandatory!")
    }
  }

  const addCform = () => {
    var tempArray = {id:uniqueId(),fileName: '', month: getMonths()[0], year:getYears()[0]};
    var arr = {...cformArray};
    if(cformSkipped == "mandatory") {
      arr.fields.push(tempArray);
      setCformArray(arr);
    }
  }

  const deleteCform = (index) => {
    var arr = {...cformArray};
    if(arr.fields.length>1){
      arr.fields.splice(index,1);
      arr.files.splice(index,1);
      setCformArray(arr);
    } else if(cformSkipped == "mandatory") {
      alert.error("C Form is mandatory!")
    }
  }

  const addMarkSheet = () => {
    var tempArray = {id:uniqueId(),fileName: '', subject: subjects[0].name || '', month: getMonths()[0], year:getYears()[0]};
    var arr = {...markSheetArray};
    if(markSheetSkipped == "mandatory") {
      arr.fields.push(tempArray);
      setMarkSheetArray(arr);
    }
  }

  const deleteMarkSheet = (index) => {
    var arr = {...markSheetArray};
    if(arr.fields.length>1){
      arr.fields.splice(index,1);
      arr.files.splice(index,1);
      setMarkSheetArray(arr);
    } else if(markSheetSkipped == "mandatory") {
      alert.error("Mark Sheet is mandatory!")
    }
  }

  const addCertificate = () => {
    var tempArray = {id:uniqueId(),fileName: '', type: types[0].name || '', month: getMonths()[0], year:getYears()[0]};
    var arr = {...certificateArray};
    if(certificateSkipped == "mandatory") {
      arr.fields.push(tempArray);
      setCertificateArray(arr);
    }
  }

  const deleteCertificate = (index) => {
    var arr = {...certificateArray};
    if(arr.fields.length>1){
      arr.fields.splice(index,1);
      arr.files.splice(index,1);
      setCertificateArray(arr);
    } else if(certificateSkipped == "mandatory") {
      alert.error("Certificate is mandatory!")
    }
  }

  const handleCandidateChange = (event) => {
    var temp= JSON.parse(event.target.value)
     setSelectedCandidate(temp);
  }

  const handleAdmissionApprovalChange=(e, index)=>{
    var arr = {...admissionApprovalArray};
    if(e.target.name==='file' && e.target.files.length>0){
      arr.files[index] = e.target.files[0];
      arr.fields[index].fileName = e.target.files[0].name;
    } else if(e.target.name==="trade"){
      arr.fields[index].trade = e.target.value;
    } else if(e.target.name==="month"){
      arr.fields[index].month = e.target.value;
    } else if(e.target.name==="year"){
      arr.fields[index].year = e.target.value;
    }
    if(e.target.name==='file' && e.target.files.length<=0){
      arr.files[index] = {};
      arr.fields[index].fileName = '';
    }
    setAdmissionApprovalArray(arr);
  }
  const handleAnswerSheetChange=(e, index)=>{
    var arr = {...answerSheetArray};
    if(e.target.name==='file' && e.target.files.length>0){
      arr.files[index] = e.target.files[0];
      arr.fields[index].fileName = e.target.files[0].name;
    } else if(e.target.name==="subject"){
      arr.fields[index].subject = e.target.value;
    } else if(e.target.name==="month"){
      arr.fields[index].month = e.target.value;
    } else if(e.target.name==="year"){
      arr.fields[index].year = e.target.value;
    }
    if(e.target.name==='file' && e.target.files.length<=0){
      arr.files[index] = {};
      arr.fields[index].fileName = '';
    }
    setAnswerSheetArray(arr);
  }
  const handlePackingSlipChange=(e, index)=>{
    var arr = {...packingSlipArray};
    if(e.target.name==='file' && e.target.files.length>0){
      arr.files[index] = e.target.files[0];
      arr.fields[index].fileName = e.target.files[0].name;
    } else if(e.target.name==="subject"){
      arr.fields[index].subject = e.target.value;
    } else if(e.target.name==="month"){
      arr.fields[index].month = e.target.value;
    } else if(e.target.name==="year"){
      arr.fields[index].year = e.target.value;
    }
    if(e.target.name==='file' && e.target.files.length<=0){
      arr.files[index] = {};
      arr.fields[index].fileName = '';
    }
    setPackingSlipArray(arr);
  }
  const handleCformChange=(e, index)=>{
    var arr = {...cformArray};
    if(e.target.name==='file' && e.target.files.length>0){
      arr.files[index] = e.target.files[0];
      arr.fields[index].fileName = e.target.files[0].name;
    } else if(e.target.name==="month"){
      arr.fields[index].month = e.target.value;
    } else if(e.target.name==="year"){
      arr.fields[index].year = e.target.value;
    }
    if(e.target.name==='file' && e.target.files.length<=0){
      arr.files[index] = {};
      arr.fields[index].fileName = '';
    }
    setCformArray(arr);
  }
  const handleMarkSheetChange=(e, index)=>{
    var arr = {...markSheetArray};
    if(e.target.name==='file' && e.target.files.length>0){
      arr.files[index] = e.target.files[0];
      arr.fields[index].fileName = e.target.files[0].name;
    } else if(e.target.name==="subject"){
      arr.fields[index].subject = e.target.value;
    } else if(e.target.name==="month"){
      arr.fields[index].month = e.target.value;
    } else if(e.target.name==="year"){
      arr.fields[index].year = e.target.value;
    }
    if(e.target.name==='file' && e.target.files.length<=0){
      arr.files[index] = {};
      arr.fields[index].fileName = '';
    }
    setMarkSheetArray(arr);
  }
  const handleCertificateChange=(e, index)=>{
    var arr = {...certificateArray};
    if(e.target.name==='file' && e.target.files.length>0){
      arr.files[index] = e.target.files[0];
      arr.fields[index].fileName = e.target.files[0].name;
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
    setCertificateArray(arr);
  }

  const handleSkippedChange = (e) => {
    var arr = {files:[], fields:[]};
    if(e.target.name === "answerSheetSkipped") {
      setAnswerSheetSkipped(e.target.value);
      if(e.target.value === "skipped") {
        setAnswerSheetArray(arr);
      }
    } else if(e.target.name === "packingSlipSkipped") {
      setPackingSlipSkipped(e.target.value);
      if(e.target.value === "skipped") {
        setPackingSlipArray(arr);
      }
    } else if(e.target.name === "cformSkipped") {
      setCformSkipped(e.target.value);
      if(e.target.value === "skipped") {
        setCformArray(arr);
      }
    } else if(e.target.name === "markSheetSkipped") {
      setMarkSheetSkipped(e.target.value);
      if(e.target.value === "skipped") {
        setMarkSheetArray(arr);
      }
    } else if(e.target.name === "certificateSkipped") {
      setCertificateSkipped(e.target.value);
      if(e.target.value === "skipped") {
        setCertificateArray(arr);
      }
    } else if(e.target.name === "admissionApprovalSkipped") {
      setAdmissionApprovalSkipped(e.target.value);
      if(e.target.value === "skipped") {
        setAdmissionApprovalArray(arr);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admissionApprovalSkipped == "mandatory" && admissionApprovalArray.files && admissionApprovalArray.files.length<=0) {
      alert.error("Admission Approval is mandatory!")
      return
    } else if(answerSheetSkipped == "mandatory" && answerSheetArray.files && answerSheetArray.files.length<=0) {
      alert.error("Answer sheet is mandatory!")
      return
    } else if (packingSlipSkipped == "mandatory" && packingSlipArray.files && packingSlipArray.files.length<=0) {
      alert.error("Packing Slip is mandatory!")
      return
    } else if (cformSkipped == "mandatory" && cformArray.files && cformArray.files.length<=0) {
      alert.error("C Form is mandatory!")
      return
    } else if (markSheetSkipped == "mandatory" && markSheetArray.files && markSheetArray.files.length<=0) {
      alert.error("Mark sheet is mandatory!")
      return
    } else if (certificateSkipped == "mandatory" && certificateArray.files && certificateArray.files.length<=0) {
      alert.error("Certificate is mandatory!")
      return
    } 
    var promises = [];
    var answerSheetFormData = new FormData();
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {username: ''};
    if(answerSheetSkipped == "mandatory") {
      answerSheetFormData.append('files', answerSheetArray.files);
      for(let i =0; i < answerSheetArray.files.length; i++) {
        answerSheetFormData.append("files", answerSheetArray.files[i]);
      }
      answerSheetFormData.append('fields', JSON.stringify(answerSheetArray.fields));
      answerSheetFormData.append('answerSheetSkipped', false);
      answerSheetFormData.append('_id', selectedCandidate._id);
      answerSheetFormData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", answerSheetFormData, configuration));
      promises.push(apiCall(answerSheetFormData));
    } else if(answerSheetSkipped == "skipped") {
      answerSheetFormData.append('answerSheetSkipped', true);
      answerSheetFormData.append('_id', selectedCandidate._id);
      answerSheetFormData.append('updatedBy', userData.username);
      // answerSheetFormData.push(axios.put("/api/candidate/upload", answerSheetFormData, configuration));
      promises.push(apiCall(answerSheetFormData));
    }
    var admissionApprovalFormData = new FormData();
    if(admissionApprovalSkipped == "mandatory") {
      admissionApprovalFormData.append('files', admissionApprovalArray.files);
      for(let i =0; i < admissionApprovalArray.files.length; i++) {
        admissionApprovalFormData.append("files", admissionApprovalArray.files[i]);
      }
      admissionApprovalFormData.append('fields', JSON.stringify(admissionApprovalArray.fields));
      admissionApprovalFormData.append('admissionApprovalSkipped', false);
      admissionApprovalFormData.append('_id', selectedCandidate._id);
      admissionApprovalFormData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", admissionApprovalFormData, configuration));
      promises.push(apiCall(admissionApprovalFormData));
    } else if(admissionApprovalSkipped == "skipped") {
      admissionApprovalFormData.append('admissionApprovalSkipped', true);
      admissionApprovalFormData.append('_id', selectedCandidate._id);
      admissionApprovalFormData.append('updatedBy', userData.username);
      // admissionApprovalFormData.push(axios.put("/api/candidate/upload", admissionApprovalFormData, configuration));
      promises.push(apiCall(admissionApprovalFormData));
    }
    var packingSlipFormData = new FormData();
    if (packingSlipSkipped == "mandatory") {
      packingSlipFormData.append('files', packingSlipArray.files);
      for(let i =0; i < packingSlipArray.files.length; i++) {
        packingSlipFormData.append("files", packingSlipArray.files[i]);
      }
      packingSlipFormData.append('fields', JSON.stringify(packingSlipArray.fields));
      packingSlipFormData.append('packingSlipSkipped', false);
      packingSlipFormData.append('_id', selectedCandidate._id);
      packingSlipFormData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", packingSlipFormData, configuration));
      promises.push(apiCall(packingSlipFormData));
    } else if(packingSlipSkipped == "skipped") {
      packingSlipFormData.append('packingSlipSkipped', true);
      packingSlipFormData.append('_id', selectedCandidate._id);
      packingSlipFormData.append('updatedBy', userData.username);
      // packingSlipFormData.push(axios.put("/api/candidate/upload", packingSlipFormData, configuration));
      promises.push(apiCall(packingSlipFormData));
    }
    var cformData = new FormData();
    if (cformSkipped == "mandatory") {
      cformData.append('files', cformArray.files);
      for(let i =0; i < cformArray.files.length; i++) {
        cformData.append("files", cformArray.files[i]);
      }
      cformData.append('fields', JSON.stringify(cformArray.fields));
      cformData.append('cformSkipped', false);
      cformData.append('_id', selectedCandidate._id);
      cformData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", cformData, configuration));
      promises.push(apiCall(cformData));
    } else if(cformSkipped == "skipped") {
      cformData.append('cformSkipped', true);
      cformData.append('_id', selectedCandidate._id);
      cformData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", cformData, configuration));
      promises.push(apiCall(cformData));
    }
    var markSheetFormData = new FormData();
    if (markSheetSkipped == "mandatory") {
      markSheetFormData.append('files', markSheetArray.files);
      for(let i =0; i < markSheetArray.files.length; i++) {
        markSheetFormData.append("files", markSheetArray.files[i]);
      }
      markSheetFormData.append('fields', JSON.stringify(markSheetArray.fields));
      markSheetFormData.append('markSheetSkipped', false);
      markSheetFormData.append('_id', selectedCandidate._id);
      markSheetFormData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", markSheetFormData, configuration));
      promises.push(apiCall(markSheetFormData));
    } else if(markSheetSkipped == "skipped") {
      markSheetFormData.append('markSheetSkipped', true);
      markSheetFormData.append('_id', selectedCandidate._id);
      markSheetFormData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", markSheetFormData, configuration));
      promises.push(apiCall(markSheetFormData));
    }
    var certificateFormData = new FormData();
    if (certificateSkipped == "mandatory") {
      certificateFormData.append('files', certificateArray.files);
      for(let i =0; i < certificateArray.files.length; i++) {
        certificateFormData.append("files", certificateArray.files[i]);
      }
      certificateFormData.append('fields', JSON.stringify(certificateArray.fields));
      certificateFormData.append('certificateSkipped', false);
      certificateFormData.append('_id', selectedCandidate._id);
      certificateFormData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", certificateFormData, configuration));
      promises.push(apiCall(certificateFormData));
    }  else if(certificateSkipped == "skipped") {
      certificateFormData.append('certificateSkipped', true);
      certificateFormData.append('_id', selectedCandidate._id);
      certificateFormData.append('updatedBy', userData.username);
      // promises.push(axios.put("/api/candidate/upload", certificateFormData, configuration));
      promises.push(apiCall(certificateFormData));
    }
    // var admissionApprovalFormData = new FormData();
    // if (admissionApprovalSkipped == "mandatory" && certificateFile != null) {
    //   admissionApprovalFormData.append('file', certificateFile)
    //   admissionApprovalFormData.append('admissionApprovalSkipped', false);
    //   admissionApprovalFormData.append('_id', selectedCandidate._id);
    //   admissionApprovalFormData.append('updatedBy', userData.username);
    //   // promises.push(axios.put("/api/candidate/upload", admissionApprovalFormData, configuration));
    //   promises.push(apiCall(admissionApprovalFormData));
    // }  else if(admissionApprovalSkipped == "skipped") {
    //   admissionApprovalFormData.append('admissionApprovalSkipped', true);
    //   admissionApprovalFormData.append('_id', selectedCandidate._id);
    //   admissionApprovalFormData.append('updatedBy', userData.username);
    //   // promises.push(axios.put("/api/candidate/upload", admissionApprovalFormData, configuration));
    //   promises.push(apiCall(admissionApprovalFormData));
    // }
    // if(answerSheetFile != null && packingSlipFile != null && cformFile != null && markSheetFile != null && certificateFile != null){
      await Promise.all(promises).then(function(response) {
        alert.success("Data uploaded successfully");
        setAnswerSheetSkipped('mandatory');
        setAdmissionApprovalSkipped('mandatory');
        setPackingSlipSkipped('mandatory');
        setCformSkipped('mandatory');
        setCertificateSkipped('mandatory');
        setAdmissionApprovalSkipped('mandatory');
        setMarkSheetSkipped('mandatory');
        setAnswerSheetArray({files:[], fields: []});
        setAdmissionApprovalArray({files:[], fields: []})
        setPackingSlipArray({files:[], fields: []});
        setCformArray({files:[], fields: []});
        setCertificateArray({files:[], fields: []});
        setMarkSheetArray({files:[], fields: []});
      }, function(error) {
        alert.error("Data upload failed")
      });
    // }
  }

  const apiCall = async (body) => {
    console.log("CALLED")
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
                <div className='' style={{display:'flex', alignItems: 'center', justifyContent:'space-between', margin:'10px 0'}}>
                  <div>
                    <label className="doc-popup-form__label" style={{display:'inline', fontSize:18}}>
                      Admission Approval:
                    </label>
                    <div style={{display:'inline', margin:'0 12px'}}>
                      <input type="radio" value="mandatory" name="admissionApprovalSkipped" id="admissionApprovalMandatory"
                        onClick={handleSkippedChange} defaultChecked={true} 
                        checked={admissionApprovalSkipped === "mandatory"}
                      />
                      <label htmlFor="admissionApprovalMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                      <input type="radio" value="skipped" name="admissionApprovalSkipped" id="admissionApprovalSkipped"
                        onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                        checked={admissionApprovalSkipped == "skipped"}
                      />
                      <label htmlFor="admissionApprovalSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                    </div>
                  </div>
                 {admissionApprovalSkipped == "mandatory" && <div style={{marginLeft:10, cursor:'pointer'}} disabled={admissionApprovalSkipped == "skipped"} onClick={addAdmissionApproval}>
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
                {admissionApprovalArray.fields && admissionApprovalArray.fields.length>0 && admissionApprovalArray.fields.map((item, i) => {
                  return (<div style={{border:'1px solid #afb6bd', borderRadius:8, padding:20, marginBottom:16}} key={i}>
                    <div className="pull-right" title="Remove" onClick={()=>deleteAdmissionApproval(i)} style={{color:'rgb(251, 104, 104)',cursor:'pointer', textAlign:'right', marginRight:'-12px', marginTop:'-12px'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">File</label>
                      <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={admissionApprovalSkipped == "skipped"} name="file" accept=".pdf" onChange={($event)=>handleAdmissionApprovalChange($event, i)} placeholder="Select File" autoComplete="off" required={admissionApprovalSkipped == "mandatory"} />
                      {item.fileName && item.fileName!='' && <p style={{margin:'4px 0'}}><b>Selected File: </b>{item.fileName}</p>}
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">Trade</label>
                      <select className="doc-popup-form__input" autoComplete="off" name="trade" value={item.trade} onChange={($event)=>handleAdmissionApprovalChange($event, i)} disabled={admissionApprovalSkipped == "skipped"} required>
                        {trades.map((data,i)=>{
                          return (<option key={i} value={data.name}>{data.name}</option>)
                        })}
                      </select>
                    </div>
                    <div style={{display:'flex'}}>
                      <div style={{paddingRight:10}}>
                        <label className="doc-popup-form__label">Month</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="month" value={item.month} onChange={($event)=>handleAdmissionApprovalChange($event, i)} disabled={admissionApprovalSkipped == "skipped"} required>
                          {monthArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="doc-popup-form__label">Year</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="year" value={item.year} onChange={($event)=>handleAdmissionApprovalChange($event, i)} disabled={admissionApprovalSkipped == "skipped"} required>
                          {yearArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
              
              <div className="doc-popup-form-input-wrap">
                <div className='' style={{display:'flex', alignItems: 'center', justifyContent:'space-between', margin:'10px 0'}}>
                  <div>
                    <label className="doc-popup-form__label" style={{display:'inline', fontSize:18}}>
                      Answer Sheet:
                    </label>
                    <div style={{display:'inline', margin:'0 12px'}}>
                      <input type="radio" value="mandatory" name="answerSheetSkipped" id="answerSheetMandatory"
                        onClick={handleSkippedChange} defaultChecked={true} 
                        checked={answerSheetSkipped === "mandatory"}
                      />
                      <label htmlFor="answerSheetMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                      <input type="radio" value="skipped" name="answerSheetSkipped" id="answerSheetSkipped"
                        onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                        checked={answerSheetSkipped == "skipped"}
                      />
                      <label htmlFor="answerSheetSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                    </div>
                  </div>
                  {answerSheetSkipped == "mandatory" && <div style={{marginLeft:10, cursor:'pointer'}} disabled={answerSheetSkipped == "skipped"} onClick={addAnswerSheet}>
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
                {answerSheetArray.fields && answerSheetArray.fields.length>0 && answerSheetArray.fields.map((item, i) => {
                  return (<div style={{border:'1px solid #afb6bd', borderRadius:8, padding:20, marginBottom:16}} key={i}>
                    <div className="pull-right" title="Remove" onClick={()=>deleteAnswerSheet(i)} style={{color:'rgb(251, 104, 104)',cursor:'pointer', textAlign:'right', marginRight:'-12px', marginTop:'-12px'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">File</label>
                      <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={answerSheetSkipped == "skipped"} name="file" accept=".pdf" onChange={($event)=>handleAnswerSheetChange($event, i)} placeholder="Select File" autoComplete="off" required={answerSheetSkipped == "mandatory"} />
                      {item.fileName && item.fileName!='' && <p style={{margin:'4px 0'}}><b>Selected File: </b>{item.fileName}</p>}
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">Subject</label>
                      <select className="doc-popup-form__input" autoComplete="off" name="subject" value={item.subject} onChange={($event)=>handleAnswerSheetChange($event, i)} disabled={answerSheetSkipped == "skipped"} required>
                        {subjects.map((data,i)=>{
                          return (<option key={i} value={data.name}>{data.name}</option>)
                        })}
                      </select>
                    </div>
                    <div style={{display:'flex'}}>
                      <div style={{paddingRight:10}}>
                        <label className="doc-popup-form__label">Month</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="month" value={item.month} onChange={($event)=>handleAnswerSheetChange($event, i)} disabled={answerSheetSkipped == "skipped"} required>
                          {monthArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="doc-popup-form__label">Year</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="year" value={item.year} onChange={($event)=>handleAnswerSheetChange($event, i)} disabled={answerSheetSkipped == "skipped"} required>
                          {yearArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                    </div>
                  </div>)
                })}
              </div>

              <div className="doc-popup-form-input-wrap">
                <div className='' style={{display:'flex', alignItems: 'center', justifyContent:'space-between', margin:'10px 0'}}>
                  <div>
                    <label className="doc-popup-form__label" style={{display:'inline', fontSize:18}}>
                      Packing Slip:
                    </label>
                    <div style={{display:'inline', margin:'0 12px'}}>
                      <input type="radio" value="mandatory" name="packingSlipSkipped" id="packingSlipMandatory"
                        onClick={handleSkippedChange} defaultChecked={true}
                        checked={packingSlipSkipped === "mandatory"}
                      />
                      <label htmlFor="packingSlipMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                      <input type="radio" value="skipped" name="packingSlipSkipped" id="packingSlipSkipped"
                        onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                        checked={packingSlipSkipped == "skipped"}
                      />
                      <label htmlFor="packingSlipSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                    </div>
                  </div>
                  {packingSlipSkipped == "mandatory" && <div style={{marginLeft:10, cursor:'pointer'}} disabled={packingSlipSkipped == "skipped"} onClick={addPackingSlip}>
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
                {packingSlipArray.fields && packingSlipArray.fields.length>0 && packingSlipArray.fields.map((item, i) => {
                  return (<div key={i} style={{border:'1px solid #afb6bd', borderRadius:8, padding:20, marginBottom:16}}>
                    <div className="pull-right" title="Remove" onClick={()=>deletePackingSlip(i)} style={{color:'rgb(251, 104, 104)',cursor:'pointer', textAlign:'right', marginRight:'-12px', marginTop:'-12px'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">File</label>
                      <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={packingSlipSkipped == "skipped"} name="file" accept=".pdf" onChange={($event)=>handlePackingSlipChange($event, i)} placeholder="Select File" autoComplete="off" required={packingSlipSkipped == "mandatory"}  />
                      {item.fileName && item.fileName!='' && <p style={{margin:'4px 0'}}><b>Selected File: </b>{item.fileName}</p>}
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">Subject</label>
                      <select className="doc-popup-form__input" autoComplete="off" name="subject" value={item.subject} onChange={($event)=>handlePackingSlipChange($event, i)} disabled={packingSlipSkipped == "skipped"} required>
                        {subjects.map((data,i)=>{
                          return (<option key={i} value={data.name}>{data.name}</option>)
                        })}
                      </select>
                    </div>
                    <div style={{display:'flex'}}>
                      <div style={{paddingRight:10}}>
                        <label className="doc-popup-form__label">Month</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="month" value={item.month} onChange={($event)=>handlePackingSlipChange($event, i)} disabled={packingSlipSkipped == "skipped"} required>
                          {monthArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="doc-popup-form__label">Year</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="year" value={item.year} onChange={($event)=>handlePackingSlipChange($event, i)} disabled={packingSlipSkipped == "skipped"} required>
                          {yearArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                    </div>
                  </div>)
                })}
              </div>

              <div className="doc-popup-form-input-wrap">
                <div className='' style={{display:'flex', alignItems: 'center', justifyContent:'space-between', margin:'10px 0'}}>
                  <div>
                    <label className="doc-popup-form__label" style={{display:'inline', fontSize:18}}>
                      C Form:
                    </label>
                    <div style={{display:'inline', margin:'0 12px'}}>
                      <input type="radio" value="mandatory" name="cformSkipped" id="cformMandatory"
                        onClick={handleSkippedChange} defaultChecked={true}
                        checked={cformSkipped === "mandatory"}
                      />
                      <label htmlFor="cformMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                      <input type="radio" value="skipped" name="cformSkipped" id="cformSkipped"
                        onClick={handleSkippedChange}  style={{marginLeft: 12}} defaultChecked={false}
                        checked={cformSkipped == "skipped"}
                      />
                      <label htmlFor="cformSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                    </div>
                  </div>
                  {cformSkipped == "mandatory" && <div style={{marginLeft:10, cursor:'pointer'}} disabled={cformSkipped == "skipped"} onClick={addCform}>
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
                {cformArray.fields && cformArray.fields.length>0 && cformArray.fields.map((item, i) => {
                  return (<div key={i} style={{border:'1px solid #afb6bd', borderRadius:8, padding:20, marginBottom:16}}>
                    <div className="pull-right" title="Remove" onClick={()=>deleteCform(i)} style={{color:'rgb(251, 104, 104)',cursor:'pointer', textAlign:'right', marginRight:'-12px', marginTop:'-12px'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">File</label>
                      <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={cformSkipped == "skipped"} name="file" accept=".pdf" onChange={($event)=>handleCformChange($event, i)} placeholder="Select File" autoComplete="off" required={cformSkipped == "mandatory"} />
                      {item.fileName && item.fileName!='' && <p style={{margin:'4px 0'}}><b>Selected File: </b>{item.fileName}</p>}
                    </div>
                    <div style={{display:'flex'}}>
                      <div style={{paddingRight:10}}>
                        <label className="doc-popup-form__label">Month</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="month" value={item.month} onChange={($event)=>handleCformChange($event, i)} disabled={cformSkipped == "skipped"} required>
                          {monthArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="doc-popup-form__label">Year</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="year" value={item.year} onChange={($event)=>handleCformChange($event, i)} disabled={cformSkipped == "skipped"} required>
                          {yearArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                    </div>
                  </div>)
                })}
              </div>

              <div className="doc-popup-form-input-wrap">
                <div className='' style={{display:'flex', alignItems: 'center', justifyContent:'space-between', margin:'10px 0'}}>
                  <div>
                    <label className="doc-popup-form__label" style={{display:'inline', fontSize:18}}>
                      Mark Sheet:
                    </label>
                    <div style={{display:'inline', margin:'0 12px'}}>
                      <input type="radio" value="mandatory" name="markSheetSkipped" id="markSheetMandatory"
                        onClick={handleSkippedChange}
                        checked={markSheetSkipped === "mandatory"} defaultChecked={true}
                      />
                      <label htmlFor="markSheetMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                      <input type="radio" value="skipped" name="markSheetSkipped" id="markSheetSkipped"
                        onClick={handleSkippedChange} style={{marginLeft: 12}}
                        checked={markSheetSkipped == "skipped"} defaultChecked={false}
                      />
                      <label htmlFor="markSheetSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                    </div>
                  </div>
                  {markSheetSkipped == "mandatory" && <div style={{marginLeft:10, cursor:'pointer'}} disabled={markSheetSkipped == "skipped"} onClick={addMarkSheet}>
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
                {markSheetArray.fields && markSheetArray.fields.length>0 && markSheetArray.fields.map((item, i) => {
                  return (<div key={i} style={{border:'1px solid #afb6bd', borderRadius:8, padding:20, marginBottom:16}}>
                    <div className="pull-right" title="Remove" onClick={()=>deleteMarkSheet(i)} style={{color:'rgb(251, 104, 104)',cursor:'pointer', textAlign:'right', marginRight:'-12px', marginTop:'-12px'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">File</label>
                      <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={markSheetSkipped == "skipped"} name="file" accept=".pdf" onChange={($event)=>handleMarkSheetChange($event, i)} placeholder="Select File" autoComplete="off" required={markSheetSkipped == "mandatory"} />
                      {item.fileName && item.fileName!='' && <p style={{margin:'4px 0'}}><b>Selected File: </b>{item.fileName}</p>}
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">Subject</label>
                      <select className="doc-popup-form__input" autoComplete="off" name="subject" value={item.subject} onChange={($event)=>handleMarkSheetChange($event, i)} disabled={markSheetSkipped == "skipped"} required>
                        {subjects.map((data,i)=>{
                          return (<option key={i} value={data.name}>{data.name}</option>)
                        })}
                      </select>
                    </div>
                    <div style={{display:'flex'}}>
                      <div style={{paddingRight:10}}>
                        <label className="doc-popup-form__label">Month</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="month" value={item.month} onChange={($event)=>handleMarkSheetChange($event, i)} disabled={markSheetSkipped == "skipped"} required>
                          {monthArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="doc-popup-form__label">Year</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="year" value={item.year} onChange={($event)=>handleMarkSheetChange($event, i)} disabled={markSheetSkipped == "skipped"} required>
                          {yearArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                    </div>
                  </div>)
                })}
              </div>

              <div className="doc-popup-form-input-wrap">
                <div className='' style={{display:'flex', alignItems: 'center', justifyContent:'space-between', margin:'10px 0'}}>
                  <div>
                    <label className="doc-popup-form__label" style={{display:'inline', fontSize:18}}>
                      Certificate:
                    </label>
                    <div style={{display:'inline', margin:'0 12px'}}>
                      <input type="radio" value="mandatory" name="certificateSkipped" id="certificateMandatory"
                        onClick={handleSkippedChange}
                        checked={certificateSkipped === "mandatory"} defaultChecked={true}
                      />
                      <label htmlFor="certificateMandatory" style={{fontSize:16, fontWeight: 400}}>Mandatory</label>

                      <input type="radio" value="skipped" name="certificateSkipped" id="certificateSkipped"
                        onClick={handleSkippedChange} style={{marginLeft: 12}}
                        checked={certificateSkipped == "skipped"} defaultChecked={false}
                      />
                      <label htmlFor="certificateSkipped" style={{fontSize:16, fontWeight: 400}}>Skip</label>
                    </div>
                  </div>
                  {certificateSkipped == "mandatory" && <div style={{marginLeft:10, cursor:'pointer'}} disabled={certificateSkipped == "skipped"} onClick={addCertificate}>
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
                {certificateArray.fields && certificateArray.fields.length>0 && certificateArray.fields.map((item, i) => {
                  return (<div key={i} style={{border:'1px solid #afb6bd', borderRadius:8, padding:20, marginBottom:16}}>
                    <div className="pull-right" title="Remove" onClick={()=>deleteCertificate(i)} style={{color:'rgb(251, 104, 104)',cursor:'pointer', textAlign:'right', marginRight:'-12px', marginTop:'-12px'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">File</label>
                      <input id="uploadFile" style={{paddingTop:7}} className="doc-popup-form__input" type="file" disabled={certificateSkipped == "skipped"} name="file" accept=".pdf" onChange={($event)=>handleCertificateChange($event, i)} placeholder="Select File" autoComplete="off" required={certificateSkipped == "mandatory"} />
                      {item.fileName && item.fileName!='' && <p style={{margin:'4px 0'}}><b>Selected File: </b>{item.fileName}</p>}
                    </div>
                    <div style={{paddingBottom:10}}>
                      <label className="doc-popup-form__label">Type</label>
                      <select className="doc-popup-form__input" autoComplete="off" name="type" value={item.type} onChange={($event)=>handleCertificateChange($event, i)} disabled={certificateSkipped == "skipped"} required>
                        {types.map((data,i)=>{
                          return (<option key={i} value={data.name}>{data.name}</option>)
                        })}
                      </select>
                    </div>
                    <div style={{display:'flex'}}>
                      <div style={{paddingRight:10}}>
                        <label className="doc-popup-form__label">Month</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="month" value={item.month} onChange={($event)=>handleCertificateChange($event, i)} disabled={certificateSkipped == "skipped"} required>
                          {monthArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="doc-popup-form__label">Year</label>
                        <select className="doc-popup-form__input" autoComplete="off" name="year" value={item.year} onChange={($event)=>handleCertificateChange($event, i)} disabled={certificateSkipped == "skipped"} required>
                          {yearArray.map((data,i)=>{
                            return (<option key={i} value={data}>{data}</option>)
                          })}
                        </select>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
              <div style={{textAlign:'right', borderTop:'1px solid #959fb0', paddingTop:16}}>
                <button className='doc-button' type='submit' style={{marginLeft:10, fontSize:16}}>Submit</button> 
              </div>
            </div>
          </form>
        </div>   
      </div>
    </div>
  );
}

export default OperatorUpload;