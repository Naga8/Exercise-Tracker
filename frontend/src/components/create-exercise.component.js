import React, { Component } from 'react';
import Paypal from './Paypal';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class CreateExercise extends Component {
  constructor(props) {
    super(props);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.transactionSuccess = this.transactionSuccess.bind(this);
    this.transactionError = this.transactionError.bind(this);
    this.transactionCanceled = this.transactionCanceled.bind(this);

    this.state = {
      username: '',
      description: '',
      price: '',
      date: new Date(),
      showPrice: false,
      showSubmit: true,
      users: [],
      transactionStatus: '',
      styles: {}
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/users/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map(user => user.username),
            username: response.data[0].username
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangePrice(e) {
    this.setState({
      showPrice: true,
      price: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onSubmit(e) {
    e.preventDefault();
    const exercise = {
      username: this.state.username,
      description: this.state.description,
      price: this.state.price,
      date: this.state.date
    }

    axios.post('http://localhost:5000/exercises/add', exercise)
      .then(res => console.log(res.data));

    window.location = '/';
  }
  transactionSuccess() {
    this.setState({
      showPrice: false,
      showSubmit: false,
      transactionStatus: "Payment Succeeded",
      styles: {color: "green"}
    })
    }

    transactionError() {
      this.setState({
        transactionStatus: "Paypal error!!",
        styles: {color: "red"}
      })
    }

    transactionCanceled() {
      this.setState({
        transactionStatus: "Payment cancelled!!",
        styles: {color: "red"}
      })
    }

  render() {
    return (
    <div>
      <h3>Create New Exercise Log</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Username: </label>
          <select ref="userInput"
              required
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}>
              {
                this.state.users.map(function(user) {
                  return <option 
                    key={user}
                    value={user}>{user}
                    </option>;
                })
              }
          </select>
        </div>
        <div className="form-group"> 
          <label>Description: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
            />
          </div>
              <br/>
        <div className="form-group" onChange={this.onChangePrice}>
          <label>Membership: </label>
          <br/>
          <input 
              type="radio" 
              className="radio"
              style={{marginLeft: "20px"}}
              value="100"
              name="plan"
              />Basic($100)
              <input 
              type="radio" 
              style={{marginLeft: "40px"}}
              className="radio"
              value="200"
              name="plan"
              />Premium($200)
        </div>
        {this.state.showPrice &&
        <div>
          <Paypal
              toPay={this.state.price}
              onSuccess={this.transactionSuccess}
              transactionError={this.transactionError}
              transactionCanceled={this.transactionCanceled}
          />
          <p>Please complete payment to enable submit button</p>
          
        </div>
        }
        <p style={this.state.styles}>{this.state.transactionStatus}</p>
        </div>

        <div className="form-group" style={{paddingTop: "10px"}}>
          <input  type="submit" value="Submit" className="btn btn-primary" disabled={this.state.showSubmit}/> 
        </div>
      </form>
      
    </div>
    )
  }
}