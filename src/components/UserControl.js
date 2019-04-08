import React, { Component } from 'react'
import { Row, Col, Button, Input, Icon, notification } from 'antd'
import { graphql } from 'react-apollo'
import { ADD_USER, GET_ALL_USER } from '../Query'

class UserControl extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
    this.addUser = this.addUser.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  addUser () {
    // console.log(this.props)
    let { name } = this.state
    this.props.mutate({
      variables: { name },
      // refetchQueries: [{ query: GET_ALL_USER }],
      update: (store, { data: { addUser } }) => {
        const data = store.readQuery({ query: GET_ALL_USER })
        data.users.push(addUser)
        store.writeQuery({ query: GET_ALL_USER, data })
      }
    }).then(a => this.openNotifi('success', 'Add User Completetion!'))
      .catch(e => this.openNotifi('error', 'Fail!!!'))
  }
  openNotifi (type, msg) {
    notification[type]({
      message: msg,
      placement: 'bottomLeft',
      duration: 1.25
    })
  }
  onChange (e) {
    let value = e.target.value
    this.setState({ name: value })
    console.log(this.state.name)
  }
  render () {
    return (
      <Row>
        <Col span={20}>
          <Input
            name='name'
            value={this.state.name}
            placeholder='Enter your username'
            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onChange}
          />
        </Col>
        <Col className='button' span={4}>
          <Button type='primary' icon='user-add' onClick={this.addUser}>Add User</Button>
        </Col>
      </Row>
    )
  }
}

export default graphql(ADD_USER)(UserControl)
