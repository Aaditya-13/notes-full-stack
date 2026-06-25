import rateLimit from "express-rate-limit";

// for search, create notes etc
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per 15 minutes
  message: {
    success: false,
    message: "You are making too many requests. Calm down and try again in 15 minutes."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// for register, login & guest login
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 20, // Limit each IP to only 10 login/register attempts per hour
  message: {
    success: false,
    message: "Too many login attempts from this IP. The vault is locked for 1 hour."
  }
});