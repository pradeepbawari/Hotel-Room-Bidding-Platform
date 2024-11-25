import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../redux/actions";

const SignUp = ({ closeModal, switchModal }) => {

  const formFields = {
    email: '',
    mobile: '',
    username: '',    
    password: '',
    userId: null
    
  }
  const [fieldsNames, setFieldsNames] = useState(formFields)
  const dispatch = useDispatch();
  const signUperror = useSelector((state) => state.signUp.signUp);
  const [mobileAlert, setMobileAlert] = useState(false)
  const [mobileServerFlg, setMobileServerFlg] = useState(false)
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(fieldsNames.mobile == '' || fieldsNames.mobile == null) return setMobileAlert(true)
    try {
      setMobileAlert(false)
      setMobileServerFlg(false)
      await dispatch(signUp(fieldsNames))
      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    if(signUperror){
      if(signUperror.length > 0 && signUperror[0]?.data){
        setMobileServerFlg(false)
        closeModal()
      } else {
        if(signUperror.length > 0 && signUperror[0]?.error == 'this mobile already used'){
          setMobileServerFlg(true)
        } else {
          closeModal()
        }
      }
    }    
  }, [onSubmitHandler])

  return (
    <div className="bg-white p-8 shadow-lg w-full max-w-md h-full overflow-auto relative">
      <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">Close</button>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
          <input value={fieldsNames.username} onChange={(e)=>setFieldsNames({...fieldsNames, username: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" type="text" id="name" placeholder="Full Name" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input value={fieldsNames.email} onChange={(e)=>setFieldsNames({...fieldsNames, email: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" type="email" id="email" placeholder="Email" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input value={fieldsNames.password} onChange={(e)=>setFieldsNames({...fieldsNames, password: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" type="password" id="password" placeholder="Password" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="mobile">Mobile</label>
          <input value={fieldsNames.mobile} onChange={(e)=>setFieldsNames({...fieldsNames, mobile: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" type="number" id="mobile" placeholder="Mobile" required />
          {fieldsNames?.mobile != '' && mobileServerFlg && (<span>This mobile already registered</span>) }
          {mobileAlert && (<span>Please Enter mobile number</span>)}
        </div>
        <button type="button" onClick={onSubmitHandler} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200">Sign Up</button>
        {/* <p className="text-center text-gray-600 mt-4">or sign up with</p>
        <div className="flex justify-center mt-4">
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-red-600 transition duration-200" type="button">Google</button>
          <button className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-200" type="button">Facebook</button>
        </div> */}
        <p className="text-center text-gray-600 mt-4">Already have an account? <a href="#" onClick={switchModal} className="text-blue-500">Sign In</a></p>
      </form>
    </div>
  );
};

export default SignUp;
