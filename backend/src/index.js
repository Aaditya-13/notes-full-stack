import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import 'dotenv/config'

connectDB()
.then(() => {
  app.on("error", (error) => {
    console.log(error);
    throw error
  })

  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server Running on Port ${process.env.PORT}`);
  })

})
.catch((err) => {
  console.log("MONGODB Connection Failed!!");
})


