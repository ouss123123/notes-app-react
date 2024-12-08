import { useState} from "react"
import axios from 'axios'
import '../styles/form.css'

const Login = (props) => {
    const [cin,setcin] = useState("J575010")
    const [password,setpassword] = useState('024680')
    
    const handleBtn = (e) => {
        e.preventDefault()
        axios.post(`https://notes.devlop.tech/api/login`,{"cin" : cin,
            "password" : password
        })
        .then(res => {   
            console.log(res);
             
            localStorage.setItem('firstName',res.data.user.first_name)
            localStorage.setItem('lastName',res.data.user.last_name)
            localStorage.setItem('token',res.data.token)
            props.setisConnected(true)
        })
    }



    const handleCin = (e) => {
        setcin(e.target.value);
    }

    const handlePw = (e) => {
        setpassword(e.target.value)
    }


    return(
        <div className="formContainer">
            <form>
                <h2>SIGN IN TO YOUR ACCOUNT</h2>
                <label>CIN</label>
                <input type="text" value={cin} placeholder="entrez votre cin" onChange={handleCin} />
                <br />
                <label>Passowrd</label>
                <input type="password" value={password} placeholder="entrez votre password" onChange={handlePw} />
                <br />
                <button className="login" onClick={handleBtn}>Login</button>
            </form>
        </div>
    )
}

export default Login