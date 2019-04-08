import React, { Component } from 'react'
import { Table, Popconfirm, Button, notification, Input } from 'antd'
import { graphql, compose } from 'react-apollo'
import { GET_ALL_USER, REMOVE_USER, UPDATE_USER } from '../Query'
class UserList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editValue: '',
      editCell: '',
      editable: false
    }
    this.columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '30%'
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (t, r) => (this.state.editCell === r.id ? <Input defaultValue={r.name} onChange={this.onChange.bind(this)} /> : r.name),
      sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      sortDirections: ['ascend', 'descend']
    }, {
      title: 'Action',
      dataIndex: 'action',
      width: '30%',
      render: (t, r) => (
        this.state.editable && this.state.editCell === r.id ? (
          <div>
            <Button type='primary' icon='save' onClick={this.state.editValue !== '' ? this.save.bind(this) : this.cancel.bind(this)}>Save</Button>
            <Popconfirm placement='topLeft' title='Are you sure?' onConfirm={this.cancel.bind(this)} okText='Yes' cancelText='No'>
              <Button type='danger' icon='close'>Cancel</Button>
            </Popconfirm>
          </div>
        ) : (
          <div>
            <Button type='primary' onClick={this.modify.bind(this, r)} icon='edit'> Modify</Button>
            <Popconfirm placement='topLeft' title='Are you sure?' onConfirm={this.removeUser.bind(this, r)} okText='Yes' cancelText='No'>
              <Button type='danger' icon='delete'> Delete</Button>
            </Popconfirm>
          </div>
        )
      )
    }]
  }
  onChange (e) {
    let value = e.target.value
    this.setState({ editValue: value })
  }
  save () {
    let { editCell, editValue } = this.state
    this.props.mutate({
      mutation: UPDATE_USER,
      variables: { id: editCell, name: editValue },
      update: (store, { data: { updateUser } }) => {
        const data = store.readQuery({ query: GET_ALL_USER })
        data.users.map((user, i) => user.id === editCell ? data.users.splice(i, 1, updateUser) : null)
        store.writeQuery({ query: GET_ALL_USER, data })
        this.cancel()
      }
    }).then(a => this.openNotifi('success', 'Update User Completetion!'))
      .catch(e => this.openNotifi('error', 'Fail!'))
  }
  cancel () {
    this.setState({ editCell: '', editable: false, editValue: '' })
  }
  modify (r) {
    let { id } = r
    this.setState({ editCell: id, editable: true })
  }
  removeUser (r) {
    const { id } = r
    this.props.mutate({
      mutation: REMOVE_USER,
      variables: { id: id },
      update: (store, { data: { removeUser } }) => {
        const data = store.readQuery({ query: GET_ALL_USER })
        data.users.map((user, i) => user.id === removeUser.id ? data.users.splice(i, 1) : null)
        store.writeQuery({ query: GET_ALL_USER, data })
      }
    }).then(a => this.openNotifi('success', 'Delete User Completetion!'))
      .catch(e => this.openNotifi('error', 'Fail!'))
  }
  openNotifi (type, msg) {
    notification[type]({
      message: msg,
      placement: 'bottomLeft',
      duration: 1.25
    })
  }
  render () {
    return (
      <Table
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={this.props.data.users}
        columns={this.columns}
        rowKey={(r) => r.id}
      />
    )
  }
}
export default compose(graphql(GET_ALL_USER), graphql(REMOVE_USER), graphql(UPDATE_USER))(UserList)
