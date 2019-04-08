import React, { Component } from 'react'
import './App.css'
import UserList from './components/UserList'
import { Row, Col } from 'antd'
import UserControl from './components/UserControl'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      users: []
    }
    this.addUser = this.addUser.bind(this)
  }
  addUser (user) {

  }
  render () {
    return (
      <div className='container'>
        <div className='control'>
          <UserControl addUser={this.addUser} />
        </div>
        <Row>
          <Col span={24}>
            <UserList data={this.state.users} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default App
