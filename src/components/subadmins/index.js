import React, {useEffect ,useState } from 'react';
import './subadmins.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'

function SubadminsPage (props) {
  const [users, setUsers] = useState([]);
  const [unfilteredUsers, setUnfilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [popupType, setPopupType] = useState("create");
  const [searchUser , setSearchValue] = useState("");
  const history = useNavigate();
  const alert = useAlert();

  useEffect(()=>{
    getUsers()
  }, []);

  const getUsers = async () => {
    try {
      let response = await axios.get('/api/user/fetchAllUsers/0');
      // alert.success('Oh look, an alert!')
      setUsers(response.data.message || []);
      setUnfilteredUsers(response.data.message || []);
    } catch (err) {
      console.log(err);
      setUsers([]);
      setUnfilteredUsers([]);
      alert.error("error in fetching subadmins")
    }
  }

  const openPopup=()=> {
    document.getElementById('createSubadminPopup').style.display = 'block';
  }

  const hidePopUp=()=> {
    document.getElementById('createSubadminPopup').style.display = 'none';
    setSelectedUser({})
  }

  const handleCreate = () => {
    setUsername('');
    setPhoneNumber('');
    setPopupType('create');
    openPopup();
  }

  const handleUsernameChange=(e)=>{
    setUsername(e.target.value);
    setShowErrorMsg(false);
  }

  const handlePhoneNumberChange=(e)=>{
    setPhoneNumber(e.target.value);
    setShowErrorMsg(false);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(popupType == 'create' && username!=='' && username!==undefined && phoneNumber!=='' && phoneNumber!==undefined){
      var obj = {};
      obj.username = username;
      obj.phoneNumber  = phoneNumber;
      axios
      .post("/api/user/create", obj)
      .then(response => {
        alert.success("Subadmin created successfully")
        setShowErrorMsg(false);
        getUsers()
        hidePopUp();
      })
      .catch(error => {    
        alert.error('phone number is taken!');    
        console.log(error);
      });
    } else if(popupType == 'edit') {
      updateUser()
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setUsername(user.username);
    setPhoneNumber(user.phoneNumber);
    setPopupType('edit');
    openPopup()
  }

  const updateUser = async () => {
    if(username!=='' && username!==undefined && phoneNumber!=='' && phoneNumber!==undefined){
      var obj = {};
      obj.username = username;
      obj.phoneNumber  = phoneNumber;
      const user_id = selectedUser._id
      axios
      .put(`/api/user/update/${user_id}`, obj)
      .then(response => {
        if(!response.data.success){
          setError('Name or phone number is missing!');
          alert.error("error in updating subadmin")
          setShowErrorMsg(true);
        } else {
          alert.success("Subadmin updated successfully")
          setShowErrorMsg(false);
          getUsers()
          hidePopUp();
        }
      })
      .catch(error => {    

        console.log(error);
      });
    }
  }

  const handleDelete = async (user) => {
    if(user._id!=='' && user._id!==undefined){
      const user_id = user._id;
      axios
      .delete(`/api/user/delete/${user_id}`)
      .then(response => {
        if(!response.data.success){
          alert.error("error in deleting subadmin");
        } else {
          alert.success("Subadmin deleted successfully");
          getUsers();
        }
      })
      .catch(error => {      
        console.log(error);
      });
    }
  }


  var handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    var data = e.target.value;
    if( data && data !== ""){
      var searchedArray=unfilteredUsers.filter(el =>{
        if(el.phoneNumber!==undefined){
          return el.phoneNumber.toLowerCase().indexOf(data.toString().toLowerCase()) !== -1;
        }
      })
      setUsers(searchedArray)
    } else {
      setUsers(unfilteredUsers)
    }
  }

  return (
    <div>
      <div className='doc-card'>
        <div className="doc-card__header">
          <p>Subadmins</p>
            <button className='doc-button' onClick={handleCreate}>Create</button>
        </div>
        <div className="doc-card__header" style={{margin:0, padding:'0 16px'}}>
          <input style={{height:36,}} className="doc-popup-form__input" type="text" name="searchUser" value={searchUser} onChange={handleSearchChange} placeholder="Search by phone No." autoComplete="off" />
        </div>
        {users && users.length>0 ? <div className='doc-card__body'>
          <table className='doc-table'>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i)=> (<tr key={user._id}>
                <td>{i+1}</td>
                <td>{user.username}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <span className='view-button' style={{marginRight:8}} onClick={()=>handleEdit(user)}>Edit</span>
                  <span className='view-button2' onClick={()=>handleDelete(user)}>Delete</span>
                </td>
              </tr>))}
            </tbody>
          </table>  
        </div>
        :<div className='doc-card__body' style={{padding:10, minHeight:'140px', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <p style={{textAlign:'center'}}>No data found.</p>
      </div>}
      </div>
       {/*popup to subadmins creation*/}
       <div id="createSubadminPopup" className="nj-overly add-rebound-animation" >
          <div className="doc-popup my-popup">
            <div className="doc-popup-form">
              <form onSubmit={handleSubmit}>
                <div className="doc-popup-form__inner">
                  <div className="doc-popup-title">
                    <span>Create Subadmin</span>
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
                      Phone Number
                    </label>
                    <input type="text" className="doc-popup-form__input" name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="Phone number" required autoFocus="" />
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
    </div>
  );
}

export default SubadminsPage;