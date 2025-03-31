const AWS = require('aws-sdk')

function uploadToS3(data,fileName){
  const BUCKET_NAME = `${process.env.BUCKET_NAME}`
  const IAM_ACCESS_KEY = `${process.env.IMA_ACCESS_KEY}`;
  const IAM_USER_SECRET=`${process.env.IMA_SECRET_KEY}`

  let s3Bucket = new AWS.S3({
    accessKeyId : IAM_ACCESS_KEY,
    secretAccessKey : IAM_USER_SECRET,
  })

 
    var params = {
      Bucket:BUCKET_NAME,
      Key:fileName,
      Body:data,
      ACL:'public-read'
    }

    return new Promise((res,rej)=>{
      s3Bucket.upload(params,(err,s3response)=>{
        if(err){
          console.log('something went wrong when uploading in createBucket ',err)
          rej(err)
        }else{
          console.log('Success',s3response)
           res(s3response.Location);
        }
      })

    }
    )
  
}
module.exports = uploadToS3;