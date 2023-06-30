/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class StillbirthCert extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

   

    async createStillbirthCert(ctx, appID, id, Stillbirth_ID, Certificate_ID, Name, Gender, Date_of_Birth, Place_of_Birth, Name_of_Mother, Name_of_Father, Permanent_address_of_parents, Municipality, Registration_Number, Date_of_Registration, Date_of_Issue) {
        try {
            // var hash = sha256(new Date());
            const stillbirthCert = {
                appID,
                Stillbirth_ID,
                Certificate_ID,
                Name,
                Gender,
                Date_of_Birth,
                Place_of_Birth,
                Name_of_Mother,
                Name_of_Father,
                docType: 'birthCert',
                Permanent_address_of_parents,
                Municipality,
                Registration_Number,
                Date_of_Registration,
                Date_of_Issue
            };

            await ctx.stub.putState(id, Buffer.from(JSON.stringify(stillbirthCert)));
            } catch (error) {
                console.log("error", error);   
            }
    }

    async allList(ctx) {

        try {
            let queryString = {};
            queryString.selector = {
                docType: 'StillbirthCert'
             
            };
            let iterator =  await ctx.stub.getQueryResult(JSON.stringify(queryString));
            let data = await this.filterQueryData(iterator);
            
            return JSON.parse(data);
        } catch (error) {
            console.log("error", error);
        }

    }


   
    async filterQueryData(iterator){
        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    async getStillbirthCert(ctx, appID, id) {
        const stillbirthCertAsBytes = await ctx.stub.getState(id);
        if (!stillbirthCertAsBytes || stillbirthCertAsBytes.length === 0) {
            throw new Error(`Stillbirth certificate with ID: ${id} does not exist`);
        }
    
        const stillbirthCert = JSON.parse(stillbirthCertAsBytes.toString());
        if (stillbirthCert.appID !== appID) {
            throw new Error(`Stillirth certificate with ID: ${id} does not belong to appID: ${appID}`);
        }
    
        return stillbirthCertAsBytes.toString();
    }
}

module.exports = StillbirthCert;
