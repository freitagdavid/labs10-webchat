import React, { Component } from 'react';
import { withFirebase } from "../Firebase";
import { Link, withRouter, Route} from "react-router-dom"
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Typography from '@material-ui/core/Typography';
import './CustomerSignUp.css';
import axios from 'axios';


const CustomerSignUpPage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <CustomerSignUpForm firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);


class CustomerSignUpFormBase extends Component {
  constructor(props) {
    super(props);
      
     this.state = {     
    	email:"",
	password:"",
	password1:"",
	company_id:2,     
	name:"",
	uid:"",     
	summary:"",     
	error:null,
	registered:false,     
    };


  }

 onSubmit = event => {
    const {email, password } = this.state;
	
    if(this.state.password !== this.state.password1){
    	this.setState({error:{message:"Passwords don't match"}, password:"", password1:""});
    }

    else{
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
            console.log(authUser.user.uid);
		
	this.props.firebase.auth.currentUser.getIdToken()
          .then(idToken => {
            console.log("idToken from curentUser: ", idToken);
            axios.defaults.headers.common['Authorization'] = idToken;
		
	    console.log('company is: ', this.state.company_id);		  
	    const data ={company_id: this.state.company_id, name: this.state.name, email: this.state.email, summary: this.state.summary, uid:authUser.user.uid}	
		
	    	//add customer details to customer table
		const request = axios.post('/api/customers', data);

        	request.then(response => {
                console.log('newly added customer', response.data);
                        //this.setState({allreps: r.data});
			
			
           		this.props.history.push({
                  	pathname: ROUTES.CHAT_PAGE,
                  	state: {
                      uid: authUser.user.uid,     // authUser returned from Firebase
                      // ****
                      company_id: this.state.company_id   // ***This will need to change once company_id is dynamic
                      // ****
                  	}
                	});
                })
                .catch(error =>{
                        console.log(error.message);
                        this.setState({error:error});
                })	  
		
          })
          .catch(error => {
            this.setState({ error:error });
          })
    
  });
   } 
	     event.preventDefault();
 }	 


  onChange = event => {
	
	this.setState({ [event.target.name]: event.target.value });
  };


render() {
    const {email, password, password1, error, name, summary} = this.state; 
    const condition = password === '' || password1 === '' || email === '' || name === '' || summary === '';


    return (
      <div className="customer-signup"> 
      	<MuiThemeProvider> 
          {this.state.logged ? 
            (<Typography variant='display1' align='center' gutterBottom>
              Successfully Logged In</Typography>):(
            <div>
              <div className="customer-signup-top-bar">
                <img src="https://i.ibb.co/Mpy1WhB/3029ba78-770c-49a3-aaa6-6a6cfc58b56c.png" alt="logo" />
              </div>
            
	            <form onSubmit={this.onSubmit}>
	              <TextField
                  style = {{width: '65%'}}
                  hintText="Enter your Email"
                  floatingLabelText="Email"
                  name="email"
                  type="text"   
                  required={true}
                  value={this.state.email}
                  onChange={this.onChange}
                />
                <br/>       
        
                <TextField
                  style = {{width: '65%'}}
                  hintText="Enter your password"
                  floatingLabelText="Password"
                  required={true}
                  name="password"
                  type="password"  
                  value={this.state.password}
                  onChange={this.onChange}
                />
                <br/>
              
                <TextField
                  style = {{width: '65%'}}
                  hintText="Re-enter your password"
                  floatingLabelText="Re-enter password"
                  name="password1"
                  type="password"
                  required={true}  
                  value={this.state.password1}
                  onChange={this.onChange}
                />
                <br/>
        
                <TextField
                  style = {{width: '65%'}}
                  hintText="Enter your name"
                  floatingLabelText="Name"
                  required={true}
                  name="name"
                  type="text" 
                  value={this.state.name}
                  onChange={this.onChange}
                />
                <br/>

                <TextField
                  style = {{width: '65%'}}
                  hintText="summary"
                  floatingLabelText="What can we help you with?"
                  required={true}
                  name="summary"
                  type="text"   
                  value={this.state.summary}
                  onChange={this.onChange}
                />
                <br/>	

                <RaisedButton
                    label="SignUp" 
                    primary={true} 
                    type="submit"
                    disabled={condition} 
              />       
              
        {error && <p>{error.message}</p>}    
            </form>
            </div>)}
        </MuiThemeProvider>
      </div>);
  }
}

const CustomerSignUpLink = () => (
  <p>
    Don't have an accoun?
  </p>
);




const CustomerSignUpForm = withRouter(withFirebase(CustomerSignUpFormBase));

export default CustomerSignUpPage;

export { CustomerSignUpForm, CustomerSignUpLink };



