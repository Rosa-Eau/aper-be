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


  
module.exports = {
    storeUser,
    findUserByUsername
};