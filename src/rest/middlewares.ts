import type { Request, Response, NextFunction } from "express"

const { API_ACCESS_TOKEN } = process.env

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // Verify the headers.
    const authorization = req.headers["authorization"]
    if (!authorization) {
      res.status(403).send("Forbidden")
    } else {
      const accessToken = authorization.split(" ")[1]
      if (!accessToken || accessToken !== API_ACCESS_TOKEN) {
        res.status(403).send("Invalid authorization token")
      } else {
        req.authenticated = true
        next()
      }
    }
  } catch (error) {
    next(error)
  }
}
