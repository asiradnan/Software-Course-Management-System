import jwt from "jsonwebtoken"

export const getIdFromToken = async (request) =>{
    try {
        const token = request.cookies.get("token")
        if (token == null) return null
        const decodedToken = jwt.verify(token.value, process.env.SECRET)
        return decodedToken.id
    } catch (error) {
        console.log( error)
    }
    
}

// import { verify } from "jsonwebtoken";

// export const getIdFromToken = (request) => {
//     try {
//         // Get token from cookies
//         const token = request.cookies.get("token")?.value || "";
        
//         // Verify and decode token
//         const decodedToken = verify(token, process.env.SECRET);
        
//         return decodedToken.id;
//     } catch (error) {
//         throw new Error("Invalid or expired token");
//     }
// };