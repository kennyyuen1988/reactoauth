import logo from './logo.svg';
import './App.css';

import { Auth } from 'aws-amplify'

function App() {
  async function checkUser(){
    const user = await Auth.currentAuthenticatedUser()
    console.log('user:', user);
    console.log('email:', user.attributes.email);
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button 
          onClick={() => Auth.federatedSignIn({ provider:"Google" })} 
        >Sign in with Google</button>

        <button 
          onClick={checkUser} 
        >Check User</button>

        <button 
          onClick={() => Auth.signOut()}
        >Sign Out</button>
      </header>
    </div>
  );
}

export default App;
