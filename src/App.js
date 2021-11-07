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
      <>
        <p>{ user.username } : { user.email }</p>
        <input ref={ref} type="file" onChange={handleFileLoad} />
        <button onClick = { logOff} > Log Out</button>
      </>
    )
  } else {
    return (
      <button onClick={() => Auth.federatedSignIn( {provider: "Google"})}>Login via Google</button>
    );
  } 
}


export default App;
