import React, { useState } from "react";
import "../Pages/pages.css";
import { Link } from "react-router-dom";
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
import useSignup from "../hooks/useSignup";

const Signup = () => {
    const [inputs,setInputs] = useState({
        username: '',
        email:'',
        password:'',
        gender:'Male',
    })
    const {loading,signup} = useSignup();
  const handleSubmit = async (e)=> {
    e.preventDefault();
    console.log(inputs)
    await signup(inputs)
  };
  return (
    <div className="main-page">
      <div className="main-page-left"></div>
      <div className="main-page-right">
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
                  value={inputs.username}
                        onChange={(e) => setInputs({...inputs, username: e.target.value})}
                />
              </FormItem>
              <FormItem label={<Label required>Email</Label>}>
                <Input
                  type="email"
                  required
                  value={inputs.email}
                        onChange={(e) => setInputs({...inputs, email: e.target.value})}
                />
              </FormItem>
              <FormItem label={<Label required>Gender</Label>}>
                <Select
                  value={inputs.gender}
                        onChange={(e) => setInputs({...inputs, gender: e.target.value})}
                >
                  <Option >Male</Option>
                  <Option >Female</Option>
                </Select>
              </FormItem>
              <FormItem label={<Label required>Password</Label>}>
                <Input
                  type="password"
                  required
                  value={inputs.password}
                        onChange={(e) => setInputs({...inputs, password: e.target.value})}
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
