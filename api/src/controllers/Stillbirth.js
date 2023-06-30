const { body, check, sanitize, validationResult } = require("express-validator");
const generateUniqueId = require('generate-unique-id');
const _StillBirthModel = require("../models/StillbirthModel")
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
const writeLatencyGauge = new prometheus.Gauge({ name: 'write_latency', help: 'latency for write requests' });
const requestCountGauge = new prometheus.Gauge({ name: 'request_count', help: 'requests count' });
const readLatencyGauge = new prometheus.Gauge({ name: 'read_latency', help: 'latency for read requests' });
const queriesCountGauge = new prometheus.Gauge({ name: 'queries_count', help: 'queries count' });
const totalTransaction = new prometheus.Gauge({ name: 'total_transaction', help: 'Counter for total transaction' })
const failedTransaction = new prometheus.Gauge({ name: 'failed_transaction', help: 'Counter for failed transaction' })
const successfulTransaction = new prometheus.Gauge({ name: 'successful_transaction', help: 'counter for successful transaction' })


async function store(req, res, next) {

    try {

        await check("ApplicationID").notEmpty().withMessage('Application ID must be requerd').run(req);
        await check("Stillbirth_ID").notEmpty().withMessage('Stillbirth_ID filed must be requerd').run(req);
        await check("Certificate_ID").notEmpty().withMessage('Certificate_ID filed must be requerd').run(req);
        await check("Name").notEmpty().withMessage('Namefiled must be requerd').run(req);
        await check("Gender").notEmpty().withMessage('please select Gender').run(req);
        await check("Date_of_Birth").notEmpty().withMessage('Date_of_Birth must be requerd').run(req);
        await check("Place_of_Birth").notEmpty().withMessage('Place_of_Birth filed must be requerd').run(req);
        await check("Name_of_Mother").notEmpty().withMessage('Name_of_Mother must be requerd').run(req);
        await check("Name_of_Father").notEmpty().withMessage('Name_of_Father filed must be requerd').run(req);
        await check("Permanent_address_of_parents").notEmpty().withMessage('Permanent_address_of_parents filed must be requerd').run(req);
        await check("Municipality").notEmpty().withMessage(' Municipality filed must be requerd').run(req);
        await check("Registration_Number").notEmpty().withMessage(' Registration_Number filed must be requerd').run(req);
        await check("Date_of_Registration").notEmpty().withMessage(' Date_of_Registration date must be requerd').run(req);
        await check("Date_of_Issue").notEmpty().withMessage('date_of_Issue must be requerd').run(req);

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "birthcert";
        var channelName = "mychannel";
        var fcn = "createBirthCert";

        var args = [];
        const id = generateUniqueId({ length: 64 });

        args.push(req.body.ApplicationID, id, req.body.Stillbirth_ID, req.body.Certificate_ID, req.body.Name, req.body.Gender, req.body.Date_of_Birth, req.body.Place_of_Birth, req.body.Name_of_Mother, req.body.Name_of_Father, req.body.Permanent_address_of_parents, req.body.Municipality, req.body.Registration_Number, req.body.Date_of_Registration, Date_of_Issue);

        const start = Date.now();
        let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

        let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getBirthCert', [req.body.ApplicationID, id]);
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
                    Stillbirth_ID: req.body.Stillbirth_ID,
                    Certificate_ID: req.body.Certificate_ID,
                    Name: req.body.Name,
                    docType: "birthCert",
                    Gender: req.body.Gender,
                    Date_of_Birth: req.body.Date_of_Birth,
                    Place_of_Birth: req.body.Place_of_Birth,
                    Name_of_Mother: req.body.Name_of_Mother,
                    Name_of_Father: req.body.Name_of_Father,
                    Permanent_address_of_parents: req.body.Permanent_address_of_parents,
                    Municipality: req.body.Municipality,
                    Registration_Number: req.body.Registration_Number,
                    Date_of_Registration: req.body.Date_of_Registration,
                    Date_of_Issue: req.body.Date_of_Issue
                },

            }

            writeLatencyGauge.inc(latency)
            requestCountGauge.inc()
            successfulTransaction.inc()
            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(400).json({
                status: 400,
                success: false,
                message: "Birthday certificate not inserte!",
                data: data
            })

        } else {

            let data = {
                key: id,
                // tx_id: message,
                Record: {
                    appID: req.body.ApplicationID,
                    Stillbirth_ID: req.body.Stillbirth_ID,
                    Certificate_ID: req.body.Certificate_ID,
                    Name: req.body.Name,
                    docType: "birthCert",
                    Gender: req.body.Gender,
                    Date_of_Birth: req.body.Date_of_Birth,
                    Place_of_Birth: req.body.Place_of_Birth,
                    Name_of_Mother: req.body.Name_of_Mother,
                    Name_of_Father: req.body.Name_of_Father,
                    Permanent_address_of_parents: req.body.Permanent_address_of_parents,
                    Municipality: req.body.Municipality,
                    Registration_Number: req.body.Registration_Number,
                    Date_of_Registration: req.body.Date_of_Registration,
                    Date_of_Issue: req.body.Date_of_Issue
                },

            }

            _BirthCertModel.create({
                        Key:id,
                        TransactionID: message,
                        ApplicationID:req.body.ApplicationID,
                        Stillbirth_ID: req.body.Stillbirth_ID,
                        Certificate_ID: req.body.Certificate_ID,
                        Name: req.body.Name,
                        docType: "birthCert",
                        Gender: req.body.Gender,
                        Date_of_Birth: req.body.Date_of_Birth,
                        Place_of_Birth: req.body.Place_of_Birth,
                        Name_of_Mother: req.body.Name_of_Mother,
                        Name_of_Father: req.body.Name_of_Father,
                        Permanent_address_of_parents: req.body.Permanent_address_of_parents,
                        Municipality: req.body.Municipality,
                        Registration_Number: req.body.Registration_Number,
                        Date_of_Registration: req.body.Date_of_Registration,
                        Date_of_Issue: req.body.Date_of_Issue,
                    });

            writeLatencyGauge.inc(latency)
            requestCountGauge.inc()
            successfulTransaction.inc()
            // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Birth certificate inserted successfully!",
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
        await check("Stillbirth_ID").notEmpty().withMessage('Stillbirth_ID filed must be requerd').run(req);
        await check("Certificate_ID").notEmpty().withMessage('Certificate_ID filed must be requerd').run(req);
        await check("Name").notEmpty().withMessage('Namefiled must be requerd').run(req);
        await check("Gender").notEmpty().withMessage('please select Gender').run(req);
        await check("Date_of_Birth").notEmpty().withMessage('Date_of_Birth must be requerd').run(req);
        await check("Place_of_Birth").notEmpty().withMessage('Place_of_Birth filed must be requerd').run(req);
        await check("Name_of_Mother").notEmpty().withMessage('Name_of_Mother must be requerd').run(req);
        await check("Name_of_Father").notEmpty().withMessage('Name_of_Father filed must be requerd').run(req);
        await check("Permanent_address_of_parents").notEmpty().withMessage('Permanent_address_of_parents filed must be requerd').run(req);
        await check("Municipality").notEmpty().withMessage(' Municipality filed must be requerd').run(req);
        await check("Registration_Number").notEmpty().withMessage(' Registration_Number filed must be requerd').run(req);
        await check("Date_of_Registration").notEmpty().withMessage(' Date_of_Registration date must be requerd').run(req);
        await check("Date_of_Issue").notEmpty().withMessage('date_of_Issue must be requerd').run(req);
         

        const errors = validationResult(req);
        console.log("errors..........", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "stillbirthcert";
        var channelName = "mychannel";
        var fcn = "createStillbirthCert";

        let oldData = await query.queryChaincode("admin", channelName, chaincodeName, 'getBirthCert', [req.body.ApplicationID, req.body.Key]);

        if (typeof oldData != "object") {

            var args = [];
            const id = generateUniqueId({ length: 64 });

            args.push(req.body.ApplicationID, id, req.body.Stillbirth_ID, req.body.Certificate_ID, req.body.Name, req.body.Gender, req.body.Date_of_Birth, req.body.Place_of_Birth, req.body.Name_of_Mother, req.body.Name_of_Father, req.body.Permanent_address_of_parents, req.body.Municipality, req.body.Registration_Number, req.body.Date_of_Registration, Date_of_Issue);

            const start = Date.now();
            let message = await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);

            let getUser = await query.queryChaincode("admin", channelName, chaincodeName, 'getBirthCert', [req.body.ApplicationID, id]);
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
                        Stillbirth_ID: req.body.Stillbirth_ID,
                        Certificate_ID: req.body.Certificate_ID,
                        Name: req.body.Name,
                        docType: "birthCert",
                        Gender: req.body.Gender,
                        Date_of_Birth: req.body.Date_of_Birth,
                        Place_of_Birth: req.body.Place_of_Birth,
                        Name_of_Mother: req.body.Name_of_Mother,
                        Name_of_Father: req.body.Name_of_Father,
                        Permanent_address_of_parents: req.body.Permanent_address_of_parents,
                        Municipality: req.body.Municipality,
                        Registration_Number: req.body.Registration_Number,
                        Date_of_Registration: req.body.Date_of_Registration,
                        Date_of_Issue: req.body.Date_of_Issue
                    },

                }

                writeLatencyGauge.inc(latency)
                requestCountGauge.inc()
                successfulTransaction.inc()
                // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

                return res.status(400).json({
                    status: 400,
                    success: true,
                    message: "Birth certificate not verified",
                    data: data
                })

            } else {

                let data = {
                    key: id,
                    old_key: req.body.Key,
                    // tx_id: message,
                    Record: {
                        appID: req.body.ApplicationID,
                        Stillbirth_ID: req.body.Stillbirth_ID,
                        Certificate_ID: req.body.Certificate_ID,
                        Name: req.body.Name,
                        docType: "birthCert",
                        Gender: req.body.Gender,
                        Date_of_Birth: req.body.Date_of_Birth,
                        Place_of_Birth: req.body.Place_of_Birth,
                        Name_of_Mother: req.body.Name_of_Mother,
                        Name_of_Father: req.body.Name_of_Father,
                        Permanent_address_of_parents: req.body.Permanent_address_of_parents,
                        Municipality: req.body.Municipality,
                        Registration_Number: req.body.Registration_Number,
                        Date_of_Registration: req.body.Date_of_Registration,
                        Date_of_Issue: req.body.Date_of_Issue
                    },

                }
                _BirthCertModel.create({
                        Key:id,
                        TransactionID: message,
                        ApplicationID:req.body.ApplicationID,
                        Stillbirth_ID: req.body.Stillbirth_ID,
                        Certificate_ID: req.body.Certificate_ID,
                        Name: req.body.Name,
                        docType: "birthCert",
                        Gender: req.body.Gender,
                        Date_of_Birth: req.body.Date_of_Birth,
                        Place_of_Birth: req.body.Place_of_Birth,
                        Name_of_Mother: req.body.Name_of_Mother,
                        Name_of_Father: req.body.Name_of_Father,
                        Permanent_address_of_parents: req.body.Permanent_address_of_parents,
                        Municipality: req.body.Municipality,
                        Registration_Number: req.body.Registration_Number,
                        Date_of_Registration: req.body.Date_of_Registration,
                        Date_of_Issue: req.body.Date_of_Issue,
                        UpdateRecordKey:req.body.Key,
                });

                writeLatencyGauge.inc(latency)
                requestCountGauge.inc()
                successfulTransaction.inc()
                // const response = yield helper_1.default.registerAndGerSecret(user.email, user.orgname);

                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: " still Birth certificate verified and updated successfully!",
                    data: data
                })
            }


        }

        return res.status(400).json({
            status: 400,
            success: false,
            message: " still Birth certificate not verified",
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

async function importData(req, res, next) {

    try {
        var peers = ["peer0.org1.example.com"];
        var chaincodeName = "stillbirthcert";
        var channelName = "mychannel";
        var fcn = "createStillbirthCert";

        const wb = XLSX.readFile(req.file.path);
        const sheets = wb.SheetNames;


        if (sheets.length > 0) {
            const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

            const birtData = data.map(row => ([
                generateUniqueId({ length: 64 }),
                row['Stillbirth_ID'],
                row['Certificate_ID'],
                row['Name'],
                row['Gender'],
                date.format(new Date((row['Date_of_Birth'] - 25569) * 86400 * 1000), 'DD-MM-YYYY'),
                row['Place_of_Birth'],
                row['Name_of_Mother'],
                row['name_of_Father'],
                row['Permanent_address_of_parents'],
                row['Municipality'],
                row['Registration_Number'],
                row['Date_of_Registration'],
                row['Date_of_Issue']
            ]))
            const start = Date.now();
            const latency = Date.now() - start;
            const _importData = [];

            birtData.forEach(async (args, i) => {
                setTimeout(async () => {
                    await invoke.invokeChaincode("admin", channelName, chaincodeName, fcn, args);
                }, i * 1000);

                _importData.push({
                    key: args[0],
                    Record: {
                        Stillbirth_ID: args[1],
                        Certificate_ID: args[2],
                        Name: args[3],
                        docType: "birthCert",
                        Gender: args[4],
                        Date_of_Birth: args[5],
                        Place_of_Birth: args[6],
                        Name_of_Mother: args[7],
                        name_of_Father: args[8],
                        Permanent_address_of_parents: args[9],
                        Municipality: args[10],
                        Registration_Number: args[11],
                        Date_of_Registration: args[12],
                        Date_of_Issue: args[13]
                    }
                })
            });


            return res.status(200).json({
                status: 200,
                success: true,
                message: "Birthday certificate validated successfully!",
                data: _importData
            })

        }

        return res.status(200).json({
            status: 400,
            success: false,
            message: "Somthing went wrong!",
            data: ""
        })


    }
    catch (error) {
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
        var chaincodeName = "stillbirthcert";
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
        const latency = Date.now() - start;
        readLatencyGauge.inc(latency)
        queriesCountGauge.inc()
        data = JSON.parse(message)
        return res.status(200).json({
            status: 200,
            success: true,
            message: "All still birth certificate found successfully",
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
        var chaincodeName = "stillbirthcert";
        let args = req.query.args;;
        let fcn = 'getStillbirthCert';

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
        readLatencyGauge.inc(latency)
        queriesCountGauge.inc()
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
exports.importData = importData;
