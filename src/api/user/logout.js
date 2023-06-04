export default async function handler(req, res) {

    if (req.method == 'POST') {
        // set max-age = 0 to effectively delete the cookie
        res.setHeader("Set-Cookie", `lsersaUserToken=null; Max-Age=0; Path=/`);
        res.status(200).json({message: "Success"});
        return;

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}
