import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/actions";

const LopInPage = ({ closeModal, switchModal }) => {
  const formFields = {
    mobile: '',
    password: ''    
  }
  const [fieldsNames, setFieldsNames] = useState(formFields)
  const dispatch = useDispatch();
  const signInerror = useSelector((state) => state.signIn.signIn);
  const [mobileAlert, setMobileAlert] = useState(false)
  const [mobileServerFlg, setMobileServerFlg] = useState(false)
  const [passwordServerFlg, setPasswordServerFlg] = useState(false)
  const [event, setEvent] = useState()
  

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(fieldsNames.mobile == '' || fieldsNames.mobile == null) return setMobileAlert(true)
    try {
      setMobileAlert(false)
      setMobileServerFlg(false)
      setPasswordServerFlg(false)
      await dispatch(signIn(fieldsNames));
      setEvent(e)
      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    if(signInerror){
      if(signInerror.length > 0 && signInerror[0]?.data){
        setMobileServerFlg(false)
        setPasswordServerFlg(false)
        closeModal(event)
      } else {
        if(signInerror.length > 0 && signInerror[0]?.error == 'this mobile is not register'){
          setMobileServerFlg(true)
          setPasswordServerFlg(false)
        } else if(signInerror.length > 0 && signInerror[0]?.error == 'Invalid password'){
          setMobileServerFlg(false)
          setPasswordServerFlg(true)
        }
      }
    }    
  }, [onSubmitHandler])

  return (
    <div className="bg-white p-8 shadow-lg w-full max-w-md h-full overflow-auto relative">
    <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">Close</button>
    <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
    {mobileServerFlg && (<span className="bg-red-900ks">This mobile is not register, please click on Sign Up link</span>)}
    {passwordServerFlg  && (<span className="bg-red-900ks">Please enter correct details</span>)}
    <form>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">Mobile</label>
        <input value={fieldsNames.mobile} onChange={(e)=>setFieldsNames({...fieldsNames, mobile: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" type="email" id="email" placeholder="Email" />
        {mobileAlert && (<span>Please enter mobile no.</span>)}
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
        <input value={fieldsNames.password} onChange={(e)=>setFieldsNames({...fieldsNames, password: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" type="password" id="password" placeholder="Password" />
      </div>
      <button type="button" onClick={onSubmitHandler} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200">Sign In</button>
      {/* <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">Sign In</button>
      <p className="text-center text-gray-600 mt-4">or sign in with</p>
      <div className="flex justify-center mt-4">
        <button className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-red-600 transition duration-200" type="button">Google</button>
        <button className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-200" type="button">Facebook</button>
      </div> */}
      <p className="text-center text-gray-600 mt-4">Don't have an account? <a href="#" onClick={switchModal} className="text-blue-500">Sign Up</a></p>
    </form>
  </div>
  )
}

export default LopInPage