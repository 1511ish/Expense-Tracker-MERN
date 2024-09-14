
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// exports.usergethomePage = (request, response, next) => {
//     response.sendFile('test.html', { root: 'views' });
// }

function isStringInvalid(string) {
    if (string == undefined || string.length === 0)
        return true;
    else
        return false;
}

function generateAccessToken(id, ispremiumuser) {
    return jwt.sign({ userId: id, isPremium: ispremiumuser }, 'secretkey');
}

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (isStringInvalid(name) || isStringInvalid(password) || isStringInvalid(password)) {
            return res.status(400).json({ message: 'Bad parameters, Something is missing' })
        }
        const salt = await bcrypt.genSalt();
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).json({ err: err });
            }

            const user = new User({
                name: name,
                email_Id: email,
                password: hash,
            })
            user.save()
                .then(result => {
                    res.status(201).json({ message: 'Successfully created new user' });
                    console.log('SUCCESSFULLY ADDED');
                })
                .catch(err => console.log(err));
        })
    }
    catch (err) {
        res.status(500).json(err);
    }
}

exports.login = async (req, res) => {
    console.log("login working.....");
    const { email, password } = req.body;
    if (isStringInvalid(email) || isStringInvalid(password)) {
        return res.status(400).json({ message: 'email or password is missing', success: false })
    }
    try {
        let userExist = await User.findOne({ email_Id: email });
        if (!userExist) {
            res.status(404).json({message:'User not found'});
        } else {
            const isPasswordValid = await bcrypt.compare(password, userExist.password);
            if (isPasswordValid) {
                const userId = userExist._id.toString();
                const token = generateAccessToken(userId, userExist.ispremiumuser);
                message = `${userExist.name} is logged in successfully.`;
                return res.status(200).json({ token: token, user: userExist, message: message });
            } else {
                // response.status(401).send('Authentication failed');
                return res.status(400).json({ success: false, message: 'Password is incorrect' });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err, success: false });
    }

}

exports.checkStatus = async (req, res) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            console.log("no token provided..");
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

        // Respond with the premium status
        return res.status(200).json({ isPremium: decoded.isPremium });      
    } catch (error) {
        // Catch any errors related to token verification
        console.error('Error verifying token:', error);
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};


