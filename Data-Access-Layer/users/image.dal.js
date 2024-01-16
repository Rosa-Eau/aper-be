const Image = require("../../models/users/image")


const storeImage = async (imageToStore) => {
    try {
        const storedImage = await Image.create(imageToStore);
        return storedImage;
    }
    catch (err) {
        console.log(err)
    }
};

const getImage = async(Email) =>{
    try {
        const image = await Image.findOne({email: Email})
        return image;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {storeImage, getImage}