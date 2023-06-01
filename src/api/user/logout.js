export default async function handler(req, res) {

    if (req.method == 'POST') {
        res.clearCookie('lsersaUserToken', { path: '/' });
        res.status(200).json({message: "Success"});
        return;

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}
