import { useState, useEffect, useRef } from 'react';
import Amplify from '@aws-amplify/core';
import { Auth, Storage } from 'aws-amplify';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {

    Amplify.configure({
        // Auth: {
        //     identityPoolId: 'ca-central-1:1e2b9164-0bf8-483b-9819-6d3c210ba1ef', //REQUIRED - Amazon Cognito Identity Pool ID
        //     region: 'ca-central-1', // REQUIRED - Amazon Cognito Region
        //     //userPoolId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito User Pool ID
        //     //userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
        // },
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
            <a className="menu-link is-active" href="#">Upload Files</a>
            <a className="menu-link notify" href="#">Your History</a>
            <a className="menu-link" href="#">Remarks</a>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          <div className="header-profile">
            <h6>Welcome! { user.email }</h6>
            <img className="profile-img" src="https://images.unsplash.com/photo-1600353068440-6361ef3a86e8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="" />
          </div>
        </div>
        <p>Please upload your video:</p>
        <input ref={ref} type="file" onChange={handleFileLoad} />
        <button onClick = { logOff} > Log Out</button>
      </div>
    );
  } else {
    return (
      <div className="app" style={{height:"250px"}}>
        <div className="header">
          <div className="menu-circle"></div>
          <div className="header-menu">
            <a className="menu-link is-active" href="#">Login</a>
          </div>
        </div>
        <div className="desc">Please Login your google account</div>
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
