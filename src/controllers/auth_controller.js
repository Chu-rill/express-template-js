const {
  login_user,
  register_user,
  delete_user,
  get_all_users,
} = require("../logic/auth_logic");
const {
  login_query_validator,
  register_query_validator,
} = require("../validation/auth");
//
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { error } = login_query_validator.validate({
      username,
      password,
    });
    if (error) {
      return {
        status: "error",
        error: true,
        message: error.details[0].message,
        statusCode: 400,
      };
    }

    const response = await login_user(username, password);

    res.status(response.statusCode).send(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const { error } = register_query_validator.validate({
      username,
      password,
      email,
    });
    if (error) {
      return {
        status: "error",
        error: true,
        message: error.details[0].message,
        statusCode: 400,
      };
    }

    const response = await register_user(username, password, email);

    res.status(response.statusCode).send(response);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteUser = async (req, res) => {
  // Get the user ID from request parameters
  const { userId } = req.params;
  try {
    const response = await delete_user(userId);
    // If the user is deleted successfully, clear the JWT cookie
    if (response.status === "success") {
      res.cookie("jwt", "", { maxAge: 0 });
    }

    // Send the appropriate response to the client
    res.status(response.statusCode).send(response);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  const user_id = req.params;

  try {
    const response = await get_all_users(); // Call the get_all_users function

    // Send the appropriate response to the client
    res.status(response.statusCode).send(response);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};
