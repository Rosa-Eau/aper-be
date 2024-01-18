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

const getUserByEmail = async(email) =>{
  const user = await User.findOne({email});
  return user;
}

  const updateUser = async (userData) => {
    const user = await User.findOneAndUpdate(
       { email: userData.Email },
      { $set: userData.toUpdate },
      { new: true }
    );
    return user;
  };
  
const updateUserDetails = async(userData)=>{
  const user = await User.findOneAndUpdate(
    {_id : userData._id},
   { $set: userData.toUpdate },
   { new: true }
 );
 return user;
}

  const findUserById = async (id) =>{
    const user = await User.findById(id);
    return user;
  }
  
  const deleteMembership = async(id)=>{
    const user = await User.deleteOne({_id : id});
    return user;
  }

  const findUserByPenName = async (penName) => {
    const user = await User.findOne({ penName });
    return user;
};
module.exports = {
    storeUser,
    findUserByUsername,
    updateUser,
    findUserById,
    getUserByEmail,
    deleteMembership,
    updateUserDetails,
    findUserByPenName
};