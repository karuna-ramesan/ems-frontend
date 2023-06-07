import React, { useContext, useEffect, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import HomeTable from '../Components/HomeTable'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../Components/LoadingSpinner'
import { deleteContext, editcontext, registerContext } from '../Components/ContextShare'
import { getusersapi, removeUser } from '../services/allApis';
function Home() {
  // edit context data using usecontext
  const {editdata,seteditdata} = useContext(editcontext)
  // delete context data using useContext
  const {deleteData,setdeleteData}=useContext(deleteContext)

  // state to hold search data
  const [searchKey,setsearchKey]=useState("")
  // console.log(searchKey);
  // state to ho;d all users
  const [allusers,setallusers]=useState([])

  // define delete user
  const deleteUser = async (id)=>{
    console.log('inside delete function');

    // make api call to service
    const res = await removeUser(id)
    console.log(res);
    if(res.status===200){
      // data successfully removed
      setdeleteData(res.data)
      // call getuser api
      getusersDetails()
    }
    else{
      console.log("Error");
    }


  }

  // define a function to call getallusers api
  const getusersDetails = async()=>{
    const serverResponse = await getusersapi(searchKey)
    // console.log(serverResponse);
    setallusers(serverResponse.data)
  }
  console.log(allusers);

  // get register context using useContext
  const {registerData,setregisterData}=useContext(registerContext)
  // create state to display spinner
  const [showSpin,setShowSpin] = useState(true)
  // navigate to another page - useNavigate
  const navigate = useNavigate()
  // to redirect to register page whwn add btn clicked
  const addUser=()=>{
    // navigate to register
    navigate('/register')

  }
  
  // set showspin as false after 2sec
  
  useEffect(()=>{

    // call getusers api
    getusersDetails()
    setTimeout(() => {
      setShowSpin(false)
      
    }, 2000);
  },[searchKey])




  return (

    
    <>
    {
      registerData?<Alert className='bg-success' variant='suceess' onClose={()=> setregisterData("")} dismissible>
        {registerData.fname.toUpperCase()} Succesfully Registered.....
      </Alert> :""
    }
    {
      deleteData?<Alert className='bg-danger' variant='danger' onClose={()=> setdeleteData("")} dismissible>
        {deleteData.fname.toUpperCase()} Succesfully Deleted.....
      </Alert> :""
    }
     

     {
      editdata?<Alert className='bg-danger' variant='danger' onClose={()=> seteditdata("")} dismissible>
        {editdata.fname.toUpperCase()} Succesfully updated.....
      </Alert> :""
    }
<div className='container mt-5'>
      <div className='first_div'>
        {/* search add btn */}
        <div className='search_add d-flex justify-content-between'>
          {/* search */}
          <div className='search col-md-4'>
            <Form className='d-flex '>
            <Form.Control  required type="text" placeholder="Search Employee name" onChange={e=>setsearchKey(e.target.value)}
          />
          <Button className='ms-2' variant='success'>Search</Button>
            </Form>
          </div>
          {/* add btn */}
          <div className='add'>
           <button onClick={addUser} className='btn btn-info'><i className='fa-solid fa-user-plus fa-fade me-2'></i>Add</button>

          </div>

        </div>
      </div>
      <div className='sec_div mt-3 mb-3'>

      {
        showSpin?
         (
          <div>
          <LoadingSpinner/>
        </div>
         ):(

    <div>
    <h2>List Of Employee</h2>
        {/* table add btn */}
        <HomeTable displayData={allusers} handleDelete = {deleteUser}/>
    </div>
      )}
      </div>

    </div>

    </>
  );
}

export default Home