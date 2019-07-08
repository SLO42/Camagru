const express = require('express');
var cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
   extended: false
}));


router.post('./sendMail', (req, res) => {

	var text = `<div>
      <p>Yo someone liked your stuff!</p>
	</div>`;

	var sesAccessKey = 'sam.olive.lee@gmail.com';

	var transporter = nodemailer.createTransport({
	 host: 'smtp.gmail.com',
	 port: 465,
	 secure: true,
	 auth: {
		 type: 'OAuth2',
		 user: sesAccessKey,
		 refreshToken: '1/3IYd_TOP4_vd83JX2_iGb-VAzFENezDm1DGPqjC4PCTLtDFBx0AS5CqupSut_fOL',
		 accessToken: 'ya29.Gls8B4Ur3ALxhBezBwk0pmZG87_y85O0VdW1D-dFGOA_xxqi6AbUJ6FGPCF7ZkjwFlR_dreZaUPNK0Lob8xy_Fy8xYVbsMAm8Wv5IQIRhEeBoGuI1ROw-QPU9jkq'
	 }
   });

   const mailOptions = {
	to: "11sosam11@gmail.com",
	from: "no-reply@camagru.com",
	subject: `no-reply`,
	text: text,
	html: text
  };
  console.log("log this.");

  transporter.sendMail(mailOptions, function(error, info){
	if(error){
	   console.log(error.message);
	}
	res.status(200).send({
	  message: "success"
	})
   });

})

app.use('/api', router);

app.listen(API_PORT, () => {
	console.log('Server is running on port: ', API_PORT);
});
