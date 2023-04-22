import { TODAY } from '../lib/constants.js';

export default function handler(_, res) {
    res.status(200).json({ hello: TODAY })
}