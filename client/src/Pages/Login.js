import React, { useState } from 'react';
import './pages.css';
import { Form, FormGroup, FormItem,Input,Label ,Button} from '@ui5/webcomponents-react';
import Alert from '../Components/Alert.js'

const Login = () => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [alert,setAlert] = useState(null)
    const showAlert = (message,type)=>{
        setAlert({
           mes:message,
           type:type,
        })
       setTimeout(() => {
               setAlert(null);
               window.location.reload();
       }, 1500);
   }
    const handleSubmit =(e)=>{
        e.preventDefault();
        if((!username) || (!email) || (!password))
        {
            showAlert("Please fill all detials", "danger");
            return
        }
        console.log(username)
        console.log(email)
        console.log(password)
    }
  return (
    <div className="main-page">
        <div className="main-page-left">
          
        </div>
        <div className="main-page-right">
        <Alert alert={alert}/>
            <div className="login-form">
            
            <Form
            backgroundDesign="Transparent"
            style={{
                alignItems: 'center'
            }}
            titleText="Login Form"
            >
            <FormGroup titleText="Login Data">
                <FormItem label={<Label required>Name</Label>}>
                <Input required value={username} onChange={e=>setUsername(e.target.value)}/>
            </FormItem>
            <FormItem label={<Label required>Email</Label>}>
                <Input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/>
            </FormItem>
            <FormItem label={<Label required>Password</Label>}>
                <Input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/>
            </FormItem>
            </FormGroup>
        <Button
            design="Emphasized"
            
            onClick={handleSubmit}
            style={{
                width: '200px',
                marginLeft: '20px'
            }}
            >Submit
        </Button>
    
    </Form>
    
            </div>
        </div>
    </div>
  )
}

export default Login