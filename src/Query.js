import gql from 'graphql-tag'

export const GET_ALL_USER = gql`
  query users {
    users {
      id
      name
    }
  }
`
export const ADD_USER = gql`
  mutation addUser($name: String!) {
    addUser(name: $name) {
      id
      name
    }
  }
`
export const REMOVE_USER = gql`
  mutation removeUser ($id: String!) {
    removeUser(id: $id){
      id,
      name
    }
  }
`
export const UPDATE_USER = gql`
  mutation updateUser ($id: String!, $name: String!) {
    updateUser(id: $id, name: $name){
      id,
      name
    }
  }
`
