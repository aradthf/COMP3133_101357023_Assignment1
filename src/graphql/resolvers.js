import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";


const makeToken = (user) => {
  if (!process.env.JWT_SECRET) return null;

  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

export const resolvers = {
  Query: {
   

    login: async (_, { input }) => {
      try {
        const { usernameOrEmail, password } = input;

        const user = await User.findOne({
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!user) {
          return {
            success: false,
            message: "User not found",
            token: null,
            user: null,
          };
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          return {
            success: false,
            message: "Invalid password",
            token: null,
            user: null,
          };
        }

        const token = makeToken(user);

        return {
          success: true,
          message: "Login successful",
          token,
          user,
        };
      } catch (err) {
        return {
          success: false,
          message: err.message,
          token: null,
          user: null,
        };
      }
    },

   

    getAllEmployees: async () => {
      try {
        const employees = await Employee.find().sort({ created_at: -1 });
        return {
          success: true,
          message: "Employees fetched",
          employees,
        };
      } catch (err) {
        return {
          success: false,
          message: err.message,
          employees: [],
        };
      }
    },

    

    searchEmployeeByEid: async (_, { eid }) => {
      try {
        const employee = await Employee.findById(eid);

        if (!employee) {
          return {
            success: false,
            message: "Employee not found",
            employee: null,
          };
        }

        return {
          success: true,
          message: "Employee found",
          employee,
        };
      } catch (err) {
        return {
          success: false,
          message: "Invalid employee id",
          employee: null,
        };
      }
    },

  

    searchEmployeesByDesignationOrDepartment: async (
      _,
      { designation, department }
    ) => {
      try {
     

        const filter = {};

        if (designation && designation.trim() !== "") {
          filter.designation = designation;
        }

        if (department && department.trim() !== "") {
          filter.department = department;
        }

        const employees = await Employee.find(filter).sort({ created_at: -1 });

        return {
          success: true,
          message: "Search completed",
          employees,
        };
      } catch (err) {
        return {
          success: false,
          message: err.message,
          employees: [],
        };
      }
    },
  },

  Mutation: {
   

    signup: async (_, { input }) => {
      try {
        const { username, email, password } = input;

        if (!username || !email || !password) {
          return {
            success: false,
            message: "username, email, and password are required",
            token: null,
            user: null,
          };
        }

        if (password.length < 6) {
          return {
            success: false,
            message: "Password must be at least 6 characters",
            token: null,
            user: null,
          };
        }

        const existing = await User.findOne({
          $or: [{ username }, { email }],
        });

        if (existing) {
          return {
            success: false,
            message: "Username or email already exists",
            token: null,
            user: null,
          };
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
          username,
          email,
          password: hashed,
        });

        const token = makeToken(user);

        return {
          success: true,
          message: "Signup successful",
          token,
          user,
        };
      } catch (err) {
        return {
          success: false,
          message: err.message,
          token: null,
          user: null,
        };
      }
    },

    

    addEmployee: async (_, { input }) => {
      try {
        const employee = await Employee.create(input);

        return {
          success: true,
          message: "Employee added",
          employee,
        };
      } catch (err) {

        if (err.code === 11000) {
          return {
            success: false,
            message: "Employee email already exists",
            employee: null,
          };
        }

        return {
          success: false,
          message: err.message,
          employee: null,
        };
      }
    },

    updateEmployeeByEid: async (_, { eid, input }) => {
      try {
        const updated = await Employee.findByIdAndUpdate(eid, input, {
          new: true,
          runValidators: true,
        });

        if (!updated) {
          return {
            success: false,
            message: "Employee not found",
            employee: null,
          };
        }

        return {
          success: true,
          message: "Employee updated",
          employee: updated,
        };
      } catch (err) {
        if (err.code === 11000) {
          return {
            success: false,
            message: "Employee email already exists",
            employee: null,
          };
        }

        return {
          success: false,
          message: err.message,
          employee: null,
        };
      }
    },

    
    deleteEmployeeByEid: async (_, { eid }) => {
      try {
        const deleted = await Employee.findByIdAndDelete(eid);

        if (!deleted) {
          return {
            success: false,
            message: "Employee not found",
            employee: null,
          };
        }

        return {
          success: true,
          message: "Employee deleted",
          employee: deleted,
        };
      } catch (err) {
        return {
          success: false,
          message: "Invalid employee id",
          employee: null,
        };
      }
    },
  },
};