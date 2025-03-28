const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
module.exports = async(req,res)=>{

    const client = Sib.ApiClient.instance
    
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.SECRET_KEY;
    
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const { email } = req.body;  // Extract user email

        if (!email) {
            return res.status(400).json({ message: "Email is required!" });
        }


    
    const sender = {
        email : 'bkumar.mba22@gmail.com',
        name  :  'Reset Password'
    }
    
    const receivers = [
        {
            email : email
        }
    ]
    
    tranEmailApi.sendTransacEmail({
        sender,
        to : receivers,
        subject : 'SendInBlue integration successful',
        textContent : 'Please remeber your pasword'
    }).then(res=>{
        console.log(res)
        return res.status(200).json({ message: "Reset email sent successfully!" });

    }).catch(err=>{
        console.error("SendInBlue integration unsuccessful:", err);
        return res.status(500).json({ message: "Failed to send email." });
    })
}
