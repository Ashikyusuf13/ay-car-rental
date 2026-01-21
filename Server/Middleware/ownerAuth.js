import jwt from 'jsonwebtoken';
import User from '../Model/UserModel.js';

const ownerAuth = async (req, res, next) => {
    const { token } = req.cookies; // Use standard user token

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            const user = await User.findById(tokenDecode.id);
            if (!user) {
                return res.json({ success: false, message: 'User not found' });
            }

            if (user.role !== 'owner' && user.role !== 'admin') {
                return res.json({ success: false, message: 'Access Denied. Owner privileges required.' });
            }

            if (req.body) {
                req.body.userId = tokenDecode.id; // Inject userId into body
            }
            req.user = user; // Attach full user object if needed
            next();

        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default ownerAuth;
