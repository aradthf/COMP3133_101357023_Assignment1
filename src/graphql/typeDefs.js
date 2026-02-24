
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type EmployeeResponse {
    success: Boolean!
    message: String!
    employee: Employee
  }

  type EmployeesResponse {
    success: Boolean!
    message: String!
    employees: [Employee!]!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type Query {
    login(input: LoginInput!): AuthResponse!
    getAllEmployees: EmployeesResponse!
    searchEmployeeByEid(eid: ID!): EmployeeResponse!
    searchEmployeesByDesignationOrDepartment(
      designation: String
      department: String
    ): EmployeesResponse!
  }

  type Mutation {
    signup(input: SignupInput!): AuthResponse!
    addEmployee(input: AddEmployeeInput!): EmployeeResponse!
    updateEmployeeByEid(eid: ID!, input: UpdateEmployeeInput!): EmployeeResponse!
    deleteEmployeeByEid(eid: ID!): EmployeeResponse!
  }
`;