import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Form, Row, Alert } from 'react-bootstrap'
import Select from 'react-select'
import LoadingSpinner from '../Components/LoadingSpinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { updateUser, viewprofile } from '../services/allApis';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../services/base_url';
import { editcontext } from '../Components/ContextShare';


function Edit() {

  // get editcontext
  const {editdata,seteditdata} = useContext(editcontext)

  // get parameter from url
  const {id} = useParams()
  // console.log(id);

  // statse to hold existing image
  const [existingImg,setexistingImg]=useState("")


  // get details of given id from server
  const getUserProfile = async ()=>{
    // call  viewprofile of service
    const {data} = await viewprofile(id)
    setuserdata(data);
    setStatus(data.status)
    setexistingImg(data.profile)
  }
   // error msg
   const [errorMsg,setErrorMsg]= useState("")
   
   // use navigate
   const navigate = useNavigate()
 
 
   const [showSpin,setShowSpin]=useState(true)
   // dropdown status
 
   const options = [
     { value: 'Active', label: 'Active' },
     { value: 'InActive', label: 'InActive' },
   ]
 
   // create state to hold user input data
   const [userdata,setuserdata]=useState({
     fname:"",
     lname:"",
     email:"",
     mobile:"",
     gender:"",
     location:""
 })
 // create state for status
 const [status,setStatus]=useState("Active")
 
 // create state for image
 const [image,setImage] = useState("")
 
 // state ot hold profile picture
 const [preview,setPreview] = useState("")
 
 
 
   // to update userdata when user enter the input using html
   const userDetails = (e)=>{
     const {name,value} = e.target
     setuserdata({...userdata,[name]:value})
 
   }
 
    // to update status state
    const updateState = (e)=>{
     setStatus(e.value)
   }
   // to upadate image
   const setProfile = (e)=>{
     setImage(e.target.files[0])
     
   }
   // console.log(userdata);
   console.log(status);
   console.log(image);

   useEffect(()=>{
    getUserProfile()

   },[id])
 
  
  
  
   useEffect(()=>{
     setexistingImg("")
     if(image){
       // update preview picture
       setPreview(URL.createObjectURL(image))
     }
     setTimeout(() => {
       setShowSpin(false)
       
     }, 2000);
   },[image])
 
   // defining register submission
   const handleSubmit = async(e)=>{
     // prevent the click event to stop reload
     e.preventDefault()
     // get user input data from the form
     const {fname,lname,email,mobile,gender,location}=userdata
     if(fname===""){
       toast.error("First name required!!!")
     }
     else if(lname===""){
       toast.error("last name required!!!")
     }
     else if(email===""){
       toast.error("E mail required!!!")
     }
     
     else if(mobile===""){
       toast.error("Mobile required!!!")
     }
     else if(gender===""){
       toast.error("Gender required!!!")
     }
     else if(image===""){
       toast.error("Profile image required!!!")
     }
     else if(location===""){
       toast.error("Location required!!!")
     }
     else{
 
       // make edit api call
       // headerConfig
       const headerConfig = {
         "Content-Type":"multipart/form-data"
       }
       // body - formdata
       const data = new FormData()
       data.append("user_profile",image || existingImg)
       data.append("fname",fname)
       data.append("lname",lname)
       data.append("email",email)
       data.append("mobile",mobile)
       data.append("gender",gender)
       data.append("status",status)
       data.append("location",location)
       // api call

       const response = await updateUser(id,data,headerConfig)
 
      if(response.status===200){
      
 
       // share response data to other component via context

       seteditdata(response.data)
      //  setregisterData(response.data)
 
       // navigate to home page
   navigate('/')
      }
      else{
       setErrorMsg("Error")
      }
     }
 
   }
 
 
   
   return (
     <>
     {
       errorMsg? <Alert variant='danger' className='bg-danger' onClose={()=>setErrorMsg("")} dismissible> 
       {errorMsg}</Alert>:""
     }
 
 
 
 
      {/*spinner  */}
     
     {
     showSpin? (
    <div>
      <LoadingSpinner/>
    </div>
     ):(
    
    <div className='container mt-5'>
       <h2 className='text-center mt-3'>Register Employee Details</h2>
       <Card className='shadow mt-3 p-5'>
         <div className='text-center mb-3'>
         <img className='border p-1 rounded-circle' width={'100px'} height={'100px'} 
         src={preview?preview:`${BASE_URL}/uploads/${existingImg}`} alt="" />
         </div>
         <Form>
           <Row>
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>First name</Form.Label>
           <Form.Control name="fname" value={userdata.fname} onChange={userDetails}
             required
             type="text"
             placeholder="First name"
           />
             </Form.Group>
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>Last name</Form.Label>
           <Form.Control name="lname" value={userdata.lname} onChange={userDetails}
             required
             type="text"
             placeholder="last name"
           />
             </Form.Group>
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>Email Address</Form.Label>
           <Form.Control name="email" value={userdata.email} onChange={userDetails}
             required
             type="text"
             placeholder="Email"
           />
             </Form.Group>
 
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>Mobile</Form.Label>
           <Form.Control name="mobile" value={userdata.mobile} onChange={userDetails}
             required
             type="text"
             placeholder="Mobile"
           />
             </Form.Group>
             {/* gender */}
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>Gender</Form.Label>
           <Form.Check
             type={'radio'}
             label={'Male'}
             name="gender"
             value={"Male"}
             checked={userdata.gender==="Male"?true:false}
             onChange={userDetails}
           />
            <Form.Check
             type={'radio'}
             label={'Female'}
             name="gender"
             value={"Female"}
             checked={userdata.gender==="Female"?true:false}

             onChange={userDetails}
           />
             </Form.Group>
 
 
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>Select employee status</Form.Label>
             <Select className='form-control text-dark' options={options} defaultInputValue={status} onChange={updateState} />
          
             </Form.Group>
             {/* upload photo */}
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>Choose Profile Picture</Form.Label>
           <Form.Control name='user_profile'
             
             type="file"
             onChange={setProfile}
            
           />
             </Form.Group>
 
             {/* location */}
 
             <Form.Group className='col-lg-6 mb-2'>
             <Form.Label>Enter Employee Location</Form.Label>
           <Form.Control name="location" value={userdata.location} onChange={userDetails}
             required
             type="text"
             placeholder="Employee Location"
           />
             </Form.Group>
             {/* submit button */}
             <Button onClick={handleSubmit} className='btn btn-info mt-3'>Submit</Button>
           </Row>
         </Form>
       </Card>
 
     </div>
     )}
     <ToastContainer position='top-center'/>
       
     </>
   )
}

export default Edit
