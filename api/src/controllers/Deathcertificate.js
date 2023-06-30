const { body, check, sanitize, validationResult } = require("express-validator");
const generateUniqueId = require('generate-unique-id');
const _DeathCertModel = require("../models/DeathCertificateModel")
const invoke = require('../../app/invoke-transaction.js');
const query = require('../../app/query.js');
var log4js = require('log4js');
const date = require('date-and-time')
const XLSX = require("xlsx");
var logger = log4js.getLogger('SampleWebApp');
// const UserModel = require("../models/Birth");
require('../../config.js');
const prometheus = require('prom-client');

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// PROMETHEUS METRICS CONFIGURATION /////////////
///////////////////////////////////////////////////////////////////////////////


async function store(req, res, next) {

    try {

        await check("ApplicationID").notEmpty().withMessage('Application ID must be requerd').run(req);
        await check("Death_ID").notEmpty().withMessage('Death_ID filed must be requerd').run(req);
        await check("Certificate_ID").notEmpty().withMessage('Certificate_ID of the father filed must be requerd').run(req);
        await check("Name").notEmpty().withMessage('Name of the mother filed must be requerd').run(req);
        await check("Gender").notEmpty().withMessage('Gender filed must be requerd').run(req);
        await check("Date_Of_Death").notEmpty().withMessage('Date of Death filed must be requerd').run(req);
        await check("Place_of_Death").notEmpty().withMessage('Place_of_Death select gender').run(req);
        await check("Name_of_Mother").notEmpty().withMessage('Name_of_Mother filed must be requerd').run(req);
        await check("Name_of_Father_Husband").notEmpty().withMessage('Name_of_Father_Husband filed must be requerd').run(req);
        await check("Address_Deceased").notEmpty().withMessage('Address_Deceased filed must be requerd').run(req);
        await check("Permanent_address_of_Deceased").notEmpty().withMessage('Permanent_address_of_Deceased filed must be requerd').run(req);
        await check("Registration_Number").notEmpty().withMessage('Registration_Number filed must be requerd').run(req);
        await check("Date_of_Registration").notEmpty().withMessage('Date_of_Registration filed must be requerd').run(req);
        await check("Date_of_Issue").notEmpty().withMessage('Date_of_Issue filed must be requerd').run(req);

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "deathcert";
        var channelName = "mychannel";
        var fcn = "createDeathCert";

        var args = [];
        const id = generateUniqueId({ length: 64 });

        args.push(req.body.ApplicationID, id, req.body.Death_ID, req.body.Certificate_ID, req.body.Name, req.body.Gender, req.body.Date_of_Death, req.body.Place_of_Death, req.body.Name_of_Mother, req.body.Name_of_Father_Husband, req.body.Address_Deceased, req.body.Permanent_address_of_Deceased, req.body.Registration_Number, req.body.Date_of_Registration, req.body.Date_of_Issue);

        const start = Date.now();
        let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

        let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getDeathCert', [req.body.ApplicationID, id]);
        console.log("ghfghgfhfgh", peers, channelName, chaincodeName, fcn, args, "admin", "Org1");
        console.log("getUser...................", getUser);
        console.log("message", message);
        const latency = Date.now() - start;
        if (typeof message != "string") {

            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    appID: req.body.ApplicationID,
                    Death_ID: req.body.Death_ID,
                    Certificate_ID: req.body.Certificate_ID,
                    Name: req.body.Name,
                    docType: "deathCert",
                    Gender: req.body.Gender,
                    Date_of_Death: req.body.Date_of_Death,
                    Place_of_Death: req.body.Place_of_Death,
                    Name_of_Mother: req.body.Name_of_Mother,
                    Name_of_Father_Husband: req.body.Name_of_Father_Husband,
                    Address_Deceased: req.body.Address_Deceased,
                    Permanent_address_of_Deceased: req.body.Permanent_address_of_Deceased,
                    Registration_Number: req.body.Registration_Number,
                    Date_of_Registration: req.body.Date_of_Registration,
                    Date_of_Issue: req.body.Date_of_Issue
                },

            }


            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(400).json({
                status: 400,
                success: false,
                message: "Deaththday certificate not inserte!",
                data: data
            })

        } else {

            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    appID: req.body.ApplicationID,
                    Death_ID: req.body.Death_ID,
                    Certificate_ID: req.body.Certificate_ID,
                    Name: req.body.Name,
                    docType: "deathCert",
                    Gender: req.body.Gender,
                    Date_of_Death: req.body.Date_of_Death,
                    Place_of_Death: req.body.Place_of_Death,
                    Name_of_Mother: req.body.Name_of_Mother,
                    Name_of_Father_Husband: req.body.Name_of_Father_Husband,
                    Address_Deceased: req.body.Address_Deceased,
                    Permanent_address_of_Deceased: req.body.Permanent_address_of_Deceased,
                    Registration_Number: req.body.Registration_Number,
                    Date_of_Registration: req.body.Date_of_Registration,
                    Date_of_Issue: req.body.Date_of_Issue
                },

            }

            _DeathCertModel.create({
                        Key:id,
                        TransactionID: message,
                        ApplicationID:req.body.ApplicationID,
                        Death_ID: req.body.Death_ID,
                        Certificate_ID: req.body.Certificate_ID,
                        Name: req.body.Name,
                        Gender: req.body.Gender,
                        Date_of_Death: req.body.Date_of_Death,
                        Place_of_Death: req.body.Place_of_Death,
                        Name_of_Mother: req.body.Name_of_Mother,
                        Name_of_Father_Husband: req.body.Name_of_Father_Husband,
                        Address_Deceased: req.body.Address_Deceased,
                        Permanent_address_of_Deceased: req.body.Permanent_address_of_Deceased,
                        Registration_Number: req.body.Registration_Number,
                        Date_of_Registration: req.body.Date_of_Registration,
                        Date_of_Issue: req.body.Date_of_Issue,
                    });


            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Death certificate inserted successfully!",
                data: data
            })
        }

    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}

async function update(req, res, next) {

    try {

        await check("ApplicationID").notEmpty().withMessage('Application ID must be requerd').run(req);
        await check("Death_ID").notEmpty().withMessage('Death_ID filed must be requerd').run(req);
        await check("Certificate_ID").notEmpty().withMessage('Certificate_ID of the father filed must be requerd').run(req);
        await check("Name").notEmpty().withMessage('Name of the mother filed must be requerd').run(req);
        await check("Gender").notEmpty().withMessage('Gender filed must be requerd').run(req);
        await check("Date_Of_Death").notEmpty().withMessage('Date of Death filed must be requerd').run(req);
        await check("Place_of_Death").notEmpty().withMessage('Place_of_Death select gender').run(req);
        await check("Name_of_Mother").notEmpty().withMessage('Name_of_Mother filed must be requerd').run(req);
        await check("Name_of_Father_Husband").notEmpty().withMessage('Name_of_Father_Husband filed must be requerd').run(req);
        await check("Address_Deceased").notEmpty().withMessage('Address_Deceased filed must be requerd').run(req);
        await check("Permanent_address_of_Deceased").notEmpty().withMessage('Permanent_address_of_Deceased filed must be requerd').run(req);
        await check("Registration_Number").notEmpty().withMessage('Registration_Number filed must be requerd').run(req);
        await check("Date_of_Registration").notEmpty().withMessage('Date_of_Registration filed must be requerd').run(req);
        await check("Date_of_Issue").notEmpty().withMessage('Date_of_Issue filed must be requerd').run(req);

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "deathcert";
        var channelName = "mychannel";
        var fcn = "createDeathCert";

        let oldData = await query.queryChaincode("admin", channelName, chaincodeName, 'getDeathCert', [req.body.ApplicationID, req.body.Key]);

        if (typeof oldData != "object") {

            var args = [];
            const id = generateUniqueId({ length: 64 });


            args.push(req.body.ApplicationID, id, req.body.Death_ID, req.body.Certificate_ID, req.body.Name, req.body.Gender, req.body.Date_of_Death, req.body.Place_of_Death, req.body.Name_of_Mother, req.body.Name_of_Father_Husband, req.body.Address_Deceased, req.body.Permanent_address_of_Deceased, req.body.Registration_Number, req.body.Date_of_Registration, req.body.Date_of_Issue);

            
            const start = Date.now();
            let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

            let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getDeathCert', [req.body.ApplicationID, id]);
            console.log("ghfghgfhfgh", peers, channelName, chaincodeName, fcn, args, "admin", "Org1");
            console.log("getUser", getUser);
            console.log("message", message);
            const latency = Date.now() - start;
            if (typeof message != "string") {

                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                        appID: req.body.ApplicationID,
                        Death_ID: req.body.Death_ID,
                        Certificate_ID: req.body.Certificate_ID,
                        Name: req.body.Name,
                        docType: "deathCert",
                        Gender: req.body.Gender,
                        Date_of_Death: req.body.Date_of_Death,
                        Place_of_Death: req.body.Place_of_Death,
                        Name_of_Mother: req.body.Name_of_Mother,
                        Name_of_Father_Husband: req.body.Name_of_Father_Husband,
                        Address_Deceased: req.body.Address_Deceased,
                        Permanent_address_of_Deceased: req.body.Permanent_address_of_Deceased,
                        Registration_Number: req.body.Registration_Number,
                        Date_of_Registration: req.body.Date_of_Registration,
                        Date_of_Issue: req.body.Date_of_Issue
                    },

                }


                return res.status(400).json({
                    status: 400,
                    success: true,
                    message: "Death certificate not verified",
                    data: data
                })

            } else {

                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                        appID: req.body.ApplicationID,
                        Death_ID: req.body.Death_ID,
                        Certificate_ID: req.body.Certificate_ID,
                        Name: req.body.Name,
                        docType: "deathCert",
                        Gender: req.body.Gender,
                        Date_of_Death: req.body.Date_of_Death,
                        Place_of_Death: req.body.Place_of_Death,
                        Name_of_Mother: req.body.Name_of_Mother,
                        Name_of_Father_Husband: req.body.Name_of_Father_Husband,
                        Address_Deceased: req.body.Address_Deceased,
                        Permanent_address_of_Deceased: req.body.Permanent_address_of_Deceased,
                        Registration_Number: req.body.Registration_Number,
                        Date_of_Registration: req.body.Date_of_Registration,
                        Date_of_Issue: req.body.Date_of_Issue
                        },

                }
                _DeathCertModel.create({
                    Key:id,
                    TransactionID: message,
                    ApplicationID:req.body.ApplicationID,
                    Death_ID: req.body.Death_ID,
                    Certificate_ID: req.body.Certificate_ID,
                    Name: req.body.Name,
                    docType: "deathCert",
                    Gender: req.body.Gender,
                    Date_of_Death: req.body.Date_of_Death,
                    Place_of_Death: req.body.Place_of_Death,
                    Name_of_Mother: req.body.Name_of_Mother,
                    Name_of_Father_Husband: req.body.Name_of_Father_Husband,
                    Address_Deceased: req.body.Address_Deceased,
                    Permanent_address_of_Deceased: req.body.Permanent_address_of_Deceased,
                    Registration_Number: req.body.Registration_Number,
                    Date_of_Registration: req.body.Date_of_Registration,
                    Date_of_Issue: req.body.Date_of_Issue,
                });

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Death certificate verified and updated successfully!",
                    data: data
                })
            }


        }

        return res.status(400).json({
            status: 400,
            success: false,
            message: "Death certificate not verified",
            data: ""
        })


    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}


async function index(req, res, next) {
    try {

        var channelName = "mychannel";
        var chaincodeName = "deathcert";
        let args = req.query.args;
        let fcn = 'allList';


        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode("admin", channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');


        data = JSON.parse(message)
        return res.status(200).json({
            status: 200,
            success: true,
            message: "All Death certificate found successfully",
            data: data
        })

    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}

async function show(req, res, next) {
    try {

        var channelName = "mychannel";
        var chaincodeName = "deathcert";
        let args = req.query.args;;
        let fcn = 'getDeathCert';

        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        const start = Date.now();
        let message = await query.queryChaincode("admin", channelName, chaincodeName, fcn, args);
        // message = message.replace(/'/g, '"');
        const latency = Date.now() - start;

        logger.debug("Data............", message);
        if (typeof message != "object") {

            data = JSON.parse(message)
            data = {
                key: args[1],
                Record: data
            }

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Validated successfully!",
                data: data
            })

        } else {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Not valid!",
                data: ""
            })

        }


    } catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: "Somethings went wrong",
            error: error.message
        })
    }
}


exports.store = store;
exports.update = update;
exports.index = index;
exports.show = show;
