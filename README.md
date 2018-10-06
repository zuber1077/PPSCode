#PPSCode Pear to pear code sharing along with video call and communication platform 
    *Using Nodejs mongoose ..


~ npm i

~ npm start
create config.js file
module.exports = {
    mailer: {
        service: 'EMAILP', // email provide eg. Gmail
        auth: {
            user: 'YOUR EMAIL', // your email address eg. test@gmail.com
            pass: 'YOUR EMAIL PASSWORD' 
        }
    },
    db: 'mongodb://127.0.0.1/<>' // mongoose DataBase eg.  mongodb://127.0.0.1/dbname
}