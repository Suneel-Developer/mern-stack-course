import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [apires, setApires] = useState("No Response")

  const [registerdata, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  })

  const [logindata, setLoginData] = useState({
    email: "",
    password: "",
  })


  const [userdata, setUserData] = useState(null)

  const checkApi = () => {
    fetch("http://localhost:8000", {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message)
        setApires(data.message)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    checkApi()
  }, [])


  // Register 
  const handleRegsiter = () => {
    // console.log(registerdata)

    fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerdata)
    })

      .then(res => res.json())
      .then(data => {
        alert(data.message)
      })
      .catch(err => { console.log(err) })
  }

  // Login 
  const handleLogin = () => {
    // console.log(logindata)

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logindata)
    })

      .then(res => res.json())

      .then(data => {
        alert(data.message)
        console.log(data.accesstoken)
        localStorage.setItem('accesstoken', data.accesstoken)
      })
      .catch(err => { console.log(err) })
  }

  // Get Saved Token 
  const getSavedToken = () => {
    const token = localStorage.getItem('accesstoken')
    console.log(token)
  }


  // Get userdata
  const getUserData = () => {
    const token = localStorage.getItem('accesstoken')

    fetch("http://localhost:8000/getuserProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

      .then(res => res.json())
      .then(data => {
        setUserData(data.user)
      })
      .catch(err => { console.log(err) })
  }



  return (
    <div className="App">
      <header className="App-header">
        <p>
          {apires}
        </p>


        {/* Register  */}
        <div>
          <h1>Regsiter Form</h1>
          <input type="text" placeholder='Username'
            onChange={(e) => {
              setRegisterData({ ...registerdata, name: e.target.value })
            }}
          />

          <input type="email" placeholder='Email'
            onChange={(e) => {
              setRegisterData({ ...registerdata, email: e.target.value })
            }} />

          <input type="password" placeholder='Password'
            onChange={(e) => {
              setRegisterData({ ...registerdata, password: e.target.value })
            }} />

          <input type="text" placeholder='Age'
            onChange={(e) => {
              setRegisterData({ ...registerdata, age: e.target.value })
            }} />

          <input type="text" placeholder='Gender'
            onChange={(e) => {
              setRegisterData({ ...registerdata, gender: e.target.value })
            }} />


          <button onClick={handleRegsiter}>Regsiter</button>



          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <h1>Login Form</h1>

          <input type="email" placeholder='Email'
            onChange={(e) => {
              setLoginData({ ...logindata, email: e.target.value })
            }} />

          <input type="password" placeholder='Password'
            onChange={(e) => {
              setLoginData({ ...logindata, password: e.target.value })
            }} />


          <button onClick={handleLogin}>Login</button>




          <button onClick={getSavedToken}>Get Saved Token</button>



          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <button onClick={getUserData}>Get Data</button>

          {
            userdata &&
            <div>
              <p>{userdata.name}</p>
              <p>{userdata.email}</p>
              <p>{userdata.age}</p>
              <p>{userdata.gender}</p>
            </div>

          }
        </div>

      </header>
    </div>
  );
}

export default App;
