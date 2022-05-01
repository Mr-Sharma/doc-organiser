import React, {useEffect ,useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';

function CompanyPaymentPage () {
  const [rollNumber, setRollNumber] = useState("");
  const [admissionApprovalAvailable, setAdmissionApprovalAvailable] = useState(false);
  const [answerSheetAvailable, setAnswerSheetAvailable] = useState(false);
  const [certificateAvailable, setCertificateAvailable] = useState(false);
  const [cformAvailable, setcformAvailable] = useState(false);
  const [markSheetAvailable, setMarkSheetAvailable] = useState(false);
  const [packingSlipAvailable, setPackingSlipAvailable] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [documents, setDocuments] = useState({'admissionApproval':false, 'answerSheet':false, 'certificate':false, 'cform':false, 'markSheet':false, 'packingSlip':false});

  const history = useNavigate();
  const alert = useAlert()

  useEffect(() => {
    setAdmissionApprovalAvailable(false);
    setAnswerSheetAvailable(false);
    setCertificateAvailable(false);
    setcformAvailable(false);
    setMarkSheetAvailable(false);
    setPackingSlipAvailable(false);
    setShowDetails(false);
    openPopup()
  }, []);

  const openPopup=()=> {
    const data = JSON.parse(sessionStorage.getItem('isRegistered'));
    if(data) {
      document.getElementById('termsPopup').style.display = 'block';
    } 
  }

  const hidePopUp=()=> {
    document.getElementById('termsPopup').style.display = 'none';
  }

  const handleRollNumberChange = (e) => {
    e.preventDefault();
    setRollNumber(e.target.value);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(rollNumber) {
      try {
        let response = await axios.get('/api/company/documents/'+rollNumber);
        var data;
        if(response.data && response.data.message) {
          data = response.data.message;
          setAdmissionApprovalAvailable(data.admissionApproval && data.admissionApproval.length>0 ? true : false);
          setAnswerSheetAvailable(data.answerSheet && data.answerSheet.length>0 ? true : false);
          setCertificateAvailable(data.certificate && data.certificate.length>0 ? true : false);
          setcformAvailable(data.cform && data.cform.length>0 ? true : false);
          setMarkSheetAvailable(data.markSheet && data.markSheet.length>0 ? true : false);
          setPackingSlipAvailable(data.packingSlip && data.packingSlip.length>0 ? true : false);
        }
        if(data && (data.admissionApproval && data.admissionApproval.length>0) || (data.answerSheet && data.answerSheet.length>0) 
          || (data.certificate && data.certificate.length>0) || (data.cform && data.cform.length>0) 
          || (data.markSheet && data.markSheet.length>0) || (data.packingSlip && data.packingSlip.length>0)) {
          setShowDetails(true);
        } else {
          alert.error("No data found");
        }
      } catch (err) {
        alert.error("No data found");
        setShowDetails(false);
      }
    }
  }

  const handleCheckboxChange = (e) => {
    e.preventDefault();
    let data = {...documents};
    data[e.target.name] = !data[e.target.name];
    setDocuments(data);
  }

  const handlePay = (e) => {
    e.preventDefault();
    console.log("DOCUMENT", documents)
    if(documents.admissionApproval || documents.answerSheet || documents.certificate || documents.cform || documents.markSheet || documents.packingSlip) {
      sessionStorage.setItem('documentsPaid',JSON.stringify(documents));
      sessionStorage.setItem('RollNumberPaid', rollNumber);
      history('/company/download');
    }
  }

  return (
    <div>
      <div className="doc-popup-form" style={{maxWidth:'600px', marginTop:'10%'}}>
        {!showDetails ? <form onSubmit={handleSubmit}>
          <div className="doc-popup-form__inner">
            <div className="doc-popup-title">
              <span>Download Documents</span>
            </div>
            <div className="doc-popup-form-input-wrap">
              <label className="doc-popup-form__label">
                Roll Number:
              </label>
              <input className="doc-popup-form__input" autoComplete="off" name="rollNumber" value={rollNumber} onChange={handleRollNumberChange} placeholder="Enter roll number" required />
            </div>
            <div style={{textAlign:'right'}}>
              <button className='doc-button' type='submit' style={{marginLeft:10}}>Submit</button> 
            </div>
          </div>
        </form>:
        // Payment Form
        <form onSubmit={handlePay}>
          <div className="doc-popup-form__inner">
            <div className="doc-popup-title">
              <span>Payment</span>
            </div>
            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
              <label className="help-control help-control__checkbox">
                Admission Approval
                <input
                  type="checkbox"
                  id={`admissionApproval`}
                  key={'admissionApproval'+documents['admissionApproval']}
                  checked={documents['admissionApproval']}
                  name="admissionApproval"
                  onChange={handleCheckboxChange}
                  disabled={!admissionApprovalAvailable}
                />
                <div className="help-control__indicator"></div>
              </label>
              {!admissionApprovalAvailable && <div style={{fontSize:14, color:'#f44336', marginLeft:5}}>- Not available</div>}
            </div>

            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
              <label className="help-control help-control__checkbox">
                Answer Sheet
                <input
                  type="checkbox"
                  id={`answerSheet`}
                  key={'answerSheet'+documents['answerSheet']}
                  checked={documents['answerSheet']}
                  name="answerSheet"
                  onChange={handleCheckboxChange}
                  disabled={!answerSheetAvailable}
                />
                <div className="help-control__indicator"></div>
              </label>
              {!answerSheetAvailable && <div style={{fontSize:14, color:'#f44336', marginLeft:5}}>- Not available</div>}
            </div>

            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
              <label className="help-control help-control__checkbox">
                Certificate
                <input
                  type="checkbox"
                  id={`certificate`}
                  key={'certificate'+documents['certificate']}
                  checked={documents.certificate}
                  name="certificate"
                  onChange={handleCheckboxChange}
                  disabled={!certificateAvailable}
                />
                <div className="help-control__indicator"></div>
              </label>
              {!certificateAvailable && <div style={{fontSize:14, color:'#f44336', marginLeft:5}}>- Not available</div>}
            </div>

            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
              <label className="help-control help-control__checkbox">
                C Form
                <input
                  type="checkbox"
                  id={`cform`}
                  key={'cform'+documents['cform']}
                  checked={documents['cform']}
                  name="cform"
                  onChange={handleCheckboxChange}
                  disabled={!cformAvailable}
                />
                <div className="help-control__indicator"></div>
              </label>
              {!cformAvailable && <div style={{fontSize:14, color:'#f44336', marginLeft:5}}>- Not available</div>}
            </div>

            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
              <label className="help-control help-control__checkbox">
                Mark Sheet
                <input
                  type="checkbox"
                  id={`markSheet`}
                  key={'markSheet'+documents['markSheet']}
                  checked={documents['markSheet']}
                  name="markSheet"
                  onChange={handleCheckboxChange}
                  disabled={!markSheetAvailable}
                />
                <div className="help-control__indicator"></div>
              </label>
              {!markSheetAvailable && <div style={{fontSize:14, color:'#f44336', marginLeft:5}}>- Not available</div>}
            </div>

            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
              <label className="help-control help-control__checkbox">
                Packing Slip
                <input
                  type="checkbox"
                  id={`packingSlip`}
                  key={'packingSlip'+documents['packingSlip']}
                  checked={documents['packingSlip']}
                  name="packingSlip"
                  onChange={handleCheckboxChange}
                  disabled={!packingSlipAvailable}
                />
                <div className="help-control__indicator"></div>
              </label>
              {!packingSlipAvailable && <div style={{fontSize:14, color:'#f44336', marginLeft:5}}>- Not available</div>}
            </div>
            <div style={{textAlign:'right'}}>
              <button className='doc-button' type='submit' style={{marginLeft:10}}>Pay</button> 
            </div>
          </div>
        </form>}
      </div>

      {/*popup for terms and condition */}
      <div id="termsPopup" className="nj-overly add-rebound-animation" >
        <div className="doc-popup my-popup" style={{maxWidth:900}}>
          <div className="doc-popup-form" style={{maxWidth:900}}>
            <div>
              <div className="doc-popup-form__inner">
                <div className="doc-popup-title">
                  <span>Agree to terms and conditions</span>
                  {/* <span onClick={hidePopUp} className="doc-popup__close">
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
                  </span> */}
                </div>
                <div className="doc-popup-form-input-wrap" style={{maxHeight:'64vh', overflow:'auto', fontSize:16}}>
                  <div>
                    Lorem ipsum dolor sit amet. Aut voluptatem sint sit dolores neque ut atque aspernatur qui laboriosam veritatis ut magnam ullam. Ut sint sunt quo ipsam mollitia sit reprehenderit asperiores! Sed esse laboriosam et omnis odit in quam vero sit quia autem! Aut error dignissimos ut fuga odit At Quis dolores aut exercitationem internos 33 voluptate rerum et earum perferendis ea voluptatum iure.
                    Est voluptatem facilis sed provident quas 33 quia molestiae non mollitia pariatur. Et doloremque eligendi vel exercitationem omnis qui fuga mollitia nam eveniet assumenda non iste enim ad vero delectus ut molestiae odit. Aut esse nesciunt rem consequatur quas eos cumque alias in nihil esse in quia quidem et incidunt quia. Aut repudiandae placeat ea dolor maxime et aliquid enim in odit labore non aliquam sequi.
                    Non quia possimus qui labore repudiandae et doloribus galisum. Vel dolorum suscipit est fugiat numquam eum commodi praesentium qui amet ratione a iure aperiam. Eum quia ullam ea consectetur Quis quae amet sed modi velit. Ad eaque voluptatibus sit dignissimos debitis et illo dolores ut atque nobis a tempore illum et voluptatem quidem non iusto esse.
                    Lorem ipsum dolor sit amet. Aut voluptatem sint sit dolores neque ut atque aspernatur qui laboriosam veritatis ut magnam ullam. Ut sint sunt quo ipsam mollitia sit reprehenderit asperiores! Sed esse laboriosam et omnis odit in quam vero sit quia autem! Aut error dignissimos ut fuga odit At Quis dolores aut exercitationem internos 33 voluptate rerum et earum perferendis ea voluptatum iure.
                    Est voluptatem facilis sed provident quas 33 quia molestiae non mollitia pariatur. Et doloremque eligendi vel exercitationem omnis qui fuga mollitia nam eveniet assumenda non iste enim ad vero delectus ut molestiae odit. Aut esse nesciunt rem consequatur quas eos cumque alias in nihil esse in quia quidem et incidunt quia. Aut repudiandae placeat ea dolor maxime et aliquid enim in odit labore non aliquam sequi.
                    Non quia possimus qui labore repudiandae et doloribus galisum. Vel dolorum suscipit est fugiat numquam eum commodi praesentium qui amet ratione a iure aperiam. Eum quia ullam ea consectetur Quis quae amet sed modi velit. Ad eaque voluptatibus sit dignissimos debitis et illo dolores ut atque nobis a tempore illum et voluptatem quidem non iusto esse.
                    Lorem ipsum dolor sit amet. Aut voluptatem sint sit dolores neque ut atque aspernatur qui laboriosam veritatis ut magnam ullam. Ut sint sunt quo ipsam mollitia sit reprehenderit asperiores! Sed esse laboriosam et omnis odit in quam vero sit quia autem! Aut error dignissimos ut fuga odit At Quis dolores aut exercitationem internos 33 voluptate rerum et earum perferendis ea voluptatum iure.
                    Est voluptatem facilis sed provident quas 33 quia molestiae non mollitia pariatur. Et doloremque eligendi vel exercitationem omnis qui fuga mollitia nam eveniet assumenda non iste enim ad vero delectus ut molestiae odit. Aut esse nesciunt rem consequatur quas eos cumque alias in nihil esse in quia quidem et incidunt quia. Aut repudiandae placeat ea dolor maxime et aliquid enim in odit labore non aliquam sequi.
                    Non quia possimus qui labore repudiandae et doloribus galisum. Vel dolorum suscipit est fugiat numquam eum commodi praesentium qui amet ratione a iure aperiam. Eum quia ullam ea consectetur Quis quae amet sed modi velit. Ad eaque voluptatibus sit dignissimos debitis et illo dolores ut atque nobis a tempore illum et voluptatem quidem non iusto esse.
                    Lorem ipsum dolor sit amet. Aut voluptatem sint sit dolores neque ut atque aspernatur qui laboriosam veritatis ut magnam ullam. Ut sint sunt quo ipsam mollitia sit reprehenderit asperiores! Sed esse laboriosam et omnis odit in quam vero sit quia autem! Aut error dignissimos ut fuga odit At Quis dolores aut exercitationem internos 33 voluptate rerum et earum perferendis ea voluptatum iure.
                    Est voluptatem facilis sed provident quas 33 quia molestiae non mollitia pariatur. Et doloremque eligendi vel exercitationem omnis qui fuga mollitia nam eveniet assumenda non iste enim ad vero delectus ut molestiae odit. Aut esse nesciunt rem consequatur quas eos cumque alias in nihil esse in quia quidem et incidunt quia. Aut repudiandae placeat ea dolor maxime et aliquid enim in odit labore non aliquam sequi.
                    Non quia possimus qui labore repudiandae et doloribus galisum. Vel dolorum suscipit est fugiat numquam eum commodi praesentium qui amet ratione a iure aperiam. Eum quia ullam ea consectetur Quis quae amet sed modi velit. Ad eaque voluptatibus sit dignissimos debitis et illo dolores ut atque nobis a tempore illum et voluptatem quidem non iusto esse.
                    Lorem ipsum dolor sit amet. Aut voluptatem sint sit dolores neque ut atque aspernatur qui laboriosam veritatis ut magnam ullam. Ut sint sunt quo ipsam mollitia sit reprehenderit asperiores! Sed esse laboriosam et omnis odit in quam vero sit quia autem! Aut error dignissimos ut fuga odit At Quis dolores aut exercitationem internos 33 voluptate rerum et earum perferendis ea voluptatum iure.
                    Est voluptatem facilis sed provident quas 33 quia molestiae non mollitia pariatur. Et doloremque eligendi vel exercitationem omnis qui fuga mollitia nam eveniet assumenda non iste enim ad vero delectus ut molestiae odit. Aut esse nesciunt rem consequatur quas eos cumque alias in nihil esse in quia quidem et incidunt quia. Aut repudiandae placeat ea dolor maxime et aliquid enim in odit labore non aliquam sequi.
                    Non quia possimus qui labore repudiandae et doloribus galisum. Vel dolorum suscipit est fugiat numquam eum commodi praesentium qui amet ratione a iure aperiam. Eum quia ullam ea consectetur Quis quae amet sed modi velit. Ad eaque voluptatibus sit dignissimos debitis et illo dolores ut atque nobis a tempore illum et voluptatem quidem non iusto esse.
                    Lorem ipsum dolor sit amet. Aut voluptatem sint sit dolores neque ut atque aspernatur qui laboriosam veritatis ut magnam ullam. Ut sint sunt quo ipsam mollitia sit reprehenderit asperiores! Sed esse laboriosam et omnis odit in quam vero sit quia autem! Aut error dignissimos ut fuga odit At Quis dolores aut exercitationem internos 33 voluptate rerum et earum perferendis ea voluptatum iure.
                    Est voluptatem facilis sed provident quas 33 quia molestiae non mollitia pariatur. Et doloremque eligendi vel exercitationem omnis qui fuga mollitia nam eveniet assumenda non iste enim ad vero delectus ut molestiae odit. Aut esse nesciunt rem consequatur quas eos cumque alias in nihil esse in quia quidem et incidunt quia. Aut repudiandae placeat ea dolor maxime et aliquid enim in odit labore non aliquam sequi.
                    Non quia possimus qui labore repudiandae et doloribus galisum. Vel dolorum suscipit est fugiat numquam eum commodi praesentium qui amet ratione a iure aperiam. Eum quia ullam ea consectetur Quis quae amet sed modi velit. Ad eaque voluptatibus sit dignissimos debitis et illo dolores ut atque nobis a tempore illum et voluptatem quidem non iusto esse.
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <button className='doc-button' type='submit' style={{marginLeft:10}} onClick={hidePopUp}>Agree</button> 
                </div>
              </div>
            </div>
          </div>   
        </div>
      </div>
    </div>
  );
}

export default CompanyPaymentPage;