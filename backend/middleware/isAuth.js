const jwt = require('jsonwebtoken')

// Middleware to protect routes by verifying JWT tokens
module.exports = (req, res, next) => {
    // Get the Authorization header from the incoming request
    const authHeader = req.get('Authorization')
    
    // If no Authorization header is present, the user is not authenticated
    if (!authHeader) {
        const error = new Error('Not authenticated')
        throw error  // Throw an error to be caught by error handling middleware
    }
    
    // The Authorization header is expected to have the format: 'Bearer <token>'
    // Split by space and take the second part which is the actual token string
    const token = authHeader.split(' ')[1]
    
    // Variable to hold the decoded token data after verification
    let decodedToken
    
    try {
        // Verify the token using the secret key
        // This will decode the token if valid or throw an error if invalid/expired
        decodedToken = jwt.verify(token, 'secretkey')
        console.log(decodedToken, 'decoded token') // Optional: for debugging purposes
    } catch (err) {
        // If token verification fails, throw the error to be handled elsewhere
        throw err
    }
    
    // If for some reason token verification did not produce decoded data
    if (!decodedToken) {
        const error = new Error('Not authenticated')
        throw error
    }
    
    // Attach useful user data from the token payload to the request object
    // So subsequent middleware or route handlers can access user info easily
    req.userId = decodedToken.userId
    req.userName = decodedToken.name
    
    // Call next middleware or route handler since authentication succeeded
    next()
}
