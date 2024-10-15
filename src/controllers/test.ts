import { Context } from "hono";
import { getPrisma } from "../db/prisma";

// Dummy user data for testing
const dummyUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  // Function to get all users with pagination
  export const getAllUsersDummy = async (c: Context) => {
    // Extract query parameters from the request (with default values if not provided)
    const page = c.req.query().page ?? '1'; // Defaults to page 1
    const perPage = c.req.query().perPage ?? '10'; // Defaults to 10 items per page

    // Convert the extracted values to numbers for proper arithmetic
    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);
  
    // Use slice to implement pagination (fetching a subset of users)
    const users = dummyUsers.slice((pageNumber - 1) * perPageNumber, pageNumber * perPageNumber);
  
    // Return the paginated users in the response with a 200 OK status
    return c.json({ data: users }, 200);
  };
  
  // Function to get a user by ID
  export const getUserByIdDummy = async (c: Context) => {
    // Extract the 'id' parameter from the request URL
    const { id } = c.req.param();
  
    // Find the user in the dummy data by matching the 'id'
    const user = dummyUsers.find((u) => u.id === id);
  
    // If the user is found, return the user data
    if (user) {
      return c.json({ data: user }, 200);
    } else {
      // If no user is found, return a 404 error
      return c.json({ error: 'User not found' }, 404);
    }
  };
  
  // Function to update a user's data by ID
  export const updateUserDummy = async (c: Context) => {
    // Extract the 'id' parameter from the request URL
    const { id } = c.req.param();
  
    // Parse the request body to get the new user data
    const userData = await c.req.json();
  
    // Find the index of the user to be updated in the dummy data
    const userIndex = dummyUsers.findIndex((u) => u.id === id);
  
    // If the user is found, update their data
    if (userIndex > -1) {
      // Merge the existing user data with the new data provided in the request
      dummyUsers[userIndex] = { ...dummyUsers[userIndex], ...userData };
      
      // Return the updated user data in the response
      return c.json({ data: dummyUsers[userIndex] }, 200);
    } else {
      // If no user is found, return a 404 error
      return c.json({ error: 'User not found' }, 404);
    }
  };
  
  // Function to delete a user by ID
  export const deleteUserDummy = async (c: Context) => {
    // Extract the 'id' parameter from the request URL
    const { id } = c.req.param();
  
    // Find the index of the user to be deleted in the dummy data
    const userIndex = dummyUsers.findIndex((u) => u.id === id);
  
    // If the user is found, remove them from the array
    if (userIndex > -1) {
      // Remove the user from the array using splice
      dummyUsers.splice(userIndex, 1);
  
      // Return a success message with a 200 OK status
      return c.json({ message: 'Successfully deleted user' }, 200);
    } else {
      // If no user is found, return a 404 error
      return c.json({ error: 'User not found' }, 404);
    }
  };
  