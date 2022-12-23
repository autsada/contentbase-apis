import { Router } from "express"

import { auth } from "./middlewares"
import { createAccount } from "./controllers"

export const restRouter = Router()

restRouter.post("/account", auth, createAccount)
