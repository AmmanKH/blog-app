const {verifyToken} = require("../services/authentications")
const User= require("../models/user")
function checkAuthenticationCookie(cookieName) {
    return async (req, res, next) => {
        const tokenValue = req.cookies[cookieName];
        if (!tokenValue) {
            return next();
        }
        try {
            const userPayload = verifyToken(tokenValue);
            const user  = await User.findById(userPayload.id).lean();
            // console.log(user);
            
            req.user = user;

        }
        catch (error) { }
        return next();
    }
}
module.exports={checkAuthenticationCookie};