const User = require("../../models/users/signUp");

const storeUser = async (userToStore) => {
    try {
        console.log(userToStore)
        const storedUser = await User.create(userToStore);
        return storedUser;
    }
    catch (err) {
        console.log(err)
    }
};

const findUserByUsername = async (username) => {
    const user = await User.findOne(username);
    return user;
  };

  const updateUser = async (userData) => {
    const user = await User.findOneAndUpdate(
       { email: userData.Email },
      { $set: userData.toUpdate },
      { new: true }
    );
    return user;
  };
  
  const findUserById = async (id) =>{
    const user = await User.findById(id);
    return user;
  }
  
module.exports = {
    storeUser,
    findUserByUsername,
    updateUser,
    findUserById
};