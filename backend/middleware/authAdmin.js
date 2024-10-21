import jwt from 'jsonwebtoken'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({ success: false, message: "Not Authorized, Login Again" })
        }

        // Corrected from JWT_SECERT to JWT_SECRET
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // Compare the email and not concatenating email + password
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: 'Not Authorized, Login Again' })
        }

        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin
