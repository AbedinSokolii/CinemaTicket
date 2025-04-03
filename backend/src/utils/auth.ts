import User from '../resources/user/model'
import jwt from 'jsonwebtoken'

const jwtSecret = "test";

export const newToken = (user) => {
    return jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 4
    })
}

export const signup = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }

    try {
        const user = await User.create(req.body)
        const token = newToken(user)
        return res.status(201).send({ token })
    } catch (e) {
        return res.status(500).end()
    }
}

export const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' })
    }

    const invalid = { message: 'Invalid email and passoword combination' }

    try {
        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user) {
            return res.status(401).send(invalid)
        }

        const match = await user

        if (!match) {
            return res.status(401).send(invalid)
        }

        const token = newToken(user)
        return res.status(201).send({ token })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}
