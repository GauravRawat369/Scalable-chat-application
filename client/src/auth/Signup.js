import React, { useState } from "react";
import "../Pages/pages.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Form,
  FormGroup,
  FormItem,
  Input,
  Label,
  Button,
  Select,
  Option,
} from "@ui5/webcomponents-react";
import Alert from "../Components/Alert.js";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [alert, setAlert] = useState("Male");
  const showAlert = (message, type) => {
    setAlert({
      mes: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !gender) {
      showAlert("Please fill all detials", "danger");
      return;
    }
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(gender);
    await axios.post(`http://localhost:8000/api/auth/signup`,{email,username,password,gender})
    .then(res =>{
        console.log(res);
        if(res.data.status === "error")
        {
            showAlert(res.data.message, "danger");
            return

        }
        showAlert("Signup Successfull", "success");
    })
  };
  return (
    <div className="main-page">
      <div className="main-page-left"></div>
      <div className="main-page-right">
        <Alert alert={alert} />
        <div className="signup-form">
          <Form
            backgroundDesign="Transparent"
            style={{
              alignItems: "center",
            }}
            titleText="Signup Form"
          >
            <FormGroup titleText="">
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
              <FormItem label={<Label required>Gender</Label>}>
                <Select
                  onChange={(e) => setGender(e.target.value)}
                >
                  <Option>Male</Option>
                  <Option>Female</Option>
                </Select>
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
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Already have account?
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
  );
};

export default Signup;
