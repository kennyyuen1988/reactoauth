import { useState, useEffect, useRef } from 'react';
import Amplify from '@aws-amplify/core';
import { Auth, Storage } from 'aws-amplify';
//import upload from './component/upload';
import avatar from './asset/default_avatar.jpg';
import './App.css';


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    Amplify.configure({
        Storage: {
            AWSS3: {
                bucket: 'kenny-react-bucket-ca', //REQUIRED -  Amazon S3 bucket name
                region: 'ca-central-1', //OPTIONAL -  Amazon service region
            }
        }
    });

  }, [])

  useEffect(() => {

    checkUser();

  }, [])

  async function checkUser() {
    try {
      const currentUser = await Auth.currentUserPoolUser();
      setUser({username: currentUser.username, ...currentUser.attributes})
      console.log(currentUser);     
    } catch (error) {
      console.log(error);
    }
  }

  function logOff() {
    Auth.signOut();
  }

  const ref = useRef(null);

  const handleFileLoad = () => {
    const filename = ref.current.files[0].name;
    console.log(filename);
    Storage.put(filename, ref.current.files[0]).then(resp => {
      console.log(resp);
      console.log(user.email,'uploaded', filename, 'successful!');
    }).catch(err => {console.log(err);});
  }

  if(user) {
    return(
      <div className="app">
        <div className="header">
          <div className="menu-circle"></div>
          <div className="header-menu">
            <button href="#" className="menu-link is-active">Upload Files</button>
            {/*<button href="#" className="menu-link notify">Your History</button>
            <button href="#" className="menu-link">Remarks</button>*/}
          </div>
          {/*<div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>*/}
          <div className="header-profile">
            <h6>Welcome! { user.email }</h6>
            <div className="dropdown profilePic">
              <img className="profile-img" src={avatar} alt="" />
            </div>
          </div>
        </div>
        <div className="desc2">Please upload your video:</div>
        <input className="uploadBtn" ref={ref} type="file" onChange={handleFileLoad} />
        <button className="logOut" onClick = { logOff} > Log Out</button>
      </div>
    );
  } else {
    return (
      <div className="app" style={{height:"250px"}}>
        <div className="header">
          <div className="menu-circle"></div>
          <div className="header-menu">
            <button href="#" className="menu-link is-active">Login</button>
          </div>
        </div>
        <div className="desc">Please Login your google account!</div>
        <button id="loginViaGoogle" onClick={() => Auth.federatedSignIn( {provider: "Google"})}>
          <div className="google-btn">
            <div className="google-icon-wrapper">
              <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="logo" />
            </div>
            <p className="btn-text"><b>Sign in with google</b></p>
          </div>
        </button>
      </div>
    );
  } 
}


export default App;
