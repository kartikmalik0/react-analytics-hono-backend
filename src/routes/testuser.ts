import { Hono } from "hono";
import * as userController from "../controllers/test";

// Create a new Hono app for user routes
const testUserRoutes = new Hono();

/**
 * Route: GET /
 * Description: Fetch all users with optional pagination.
 * Controller: userController.getAllUsers
 * Example Request: GET /users?page=1&perPage=10
 */
testUserRoutes.get("/", userController.getAllUsersDummy);

/**
 * Route: GET /:id
 * Description: Fetch a single user by their ID.
 * Controller: userController.getUserById
 * Example Request: GET /users/1
 */
testUserRoutes.get("/:id", userController.getUserByIdDummy);

/**
 * Route: PUT /:id
 * Description: Update a user's information by their ID.
 * Controller: userController.updateUser
 * Example Request: PUT /users/1
 * Body: JSON containing updated user data.
 */
testUserRoutes.put("/:id", userController.updateUserDummy);

/**
 * Route: DELETE /:id
 * Description: Delete a user by their ID.
 * Controller: userController.deleteUser
 * Example Request: DELETE /users/1
 */
testUserRoutes.delete("/:id", userController.deleteUserDummy);

// Export the testUserRoutes to be used in the main app
export { testUserRoutes };
