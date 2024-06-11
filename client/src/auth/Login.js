import React, { useState } from "react";
import "../Pages/pages.css";
import { Link } from "react-router-dom";
import { ThemeProvider } from '@ui5/webcomponents-react';
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Label,
  Button,
} from "@ui5/webcomponents-react";
import Alert from "../Components/Alert.js";
import axios from "axios"

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      mes: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if ((!username) || (!email) || (!password)) {
      showAlert("Please fill all detials", "danger");
      return;
    }
    // console.log(username);
    // console.log(email);
    // console.log(password);
    try {
        await axios.post(`http://localhost:8000/api/auth/login`,{username,email,password})
    .then(res=>{
        console.log(res);
        showAlert("Login Successfull", "success");
        
    })
    } catch (error) {
        console.log("Error in Login page :",error)
        showAlert(error.response.data.error,"danger")
    }
  };
  return (
    <ThemeProvider>
    <div className="main-page">
      <div className="main-page-left"></div>
      <div className="main-page-right">
        <Alert alert={alert} />
        <div className="login-form">
          <Form
            backgroundDesign="Transparent"
            style={{
              alignItems: "center",
            }}
            titleText="login Form"
          >
            <FormGroup titleText="login Data">
            <FormItem label={<Label required>Name</Label>}>
                <Input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormItem>
              <FormItem label={<Label required>Email</Label>}>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormItem>
              <FormItem label={<Label required>Password</Label>}>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormItem>
              <FormItem>
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    Create account
                  </Link>
              </FormItem>
            </FormGroup>
          </Form>
          <Button
            design="Emphasized"
            onClick={handleSubmit}
            style={{
              width: "200px",
              marginLeft: "20px",
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default Login;
