const express = require('express');
const verifyJWT = require('../middlewears/authMiddlewear');
const { addRequest, getAllRequests, handleRequests } = require('../controllers/requestsController');
const Router = express.Router();

Router.route('/addRequest').post(verifyJWT,addRequest);

Router.route('/getAllRequests').get(verifyJWT,getAllRequests);
Router.route('/handleRequest').post(verifyJWT,handleRequests)

Router.route('/denyRequest')


module.exports = Router