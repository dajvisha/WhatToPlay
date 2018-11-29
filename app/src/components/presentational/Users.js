import React, { Component } from 'react';
import './../../styles/Users.css'

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySelectUser: false,
        } 
        this.actionSelectUser = this.actionSelectUser.bind(this);
    }

    actionSelectUser() {
        this.setState(prevState => ({
            displaySelectUser: !prevState.displaySelectUser
        }));
    }

    render() {
        return (
            <div className="users-bar">
                <button onClick={this.props.interactModal}>Hi! {this.props.userName}</button>
            </div>);
    }
}

export default Users
