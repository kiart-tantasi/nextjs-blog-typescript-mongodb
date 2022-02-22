import jwt from "jsonwebtoken";

export const tokenValidation = (token: string) => {
    const privateKey = process.env.PRIVATE_KEY as string;
    let valid;
    
    jwt.verify(token, privateKey, function(err) {
        if (err) {
            valid = false;
        } else {
            valid = true;
        }
    });
    
    return valid;
}