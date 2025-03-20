const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key d2ba33715d404373b44c407f35fdb9e4");

const handleClarifaiApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            model_id: "face-detection",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                res.status(400).json('Unable to work with api');
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                res.status(400).json('Unable to work with api');
                return;
            }
            res.json(response);
        }
    );
}

const updateEntries = (db) => (req, res) => {
	const { id } = req.body;
	db('users')
	.where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => res.json(entries[0].entries))
	.catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = { updateEntries, handleClarifaiApiCall };