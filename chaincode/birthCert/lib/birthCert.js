/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BirthCert extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

   

    async createBirthCert(ctx, appID, id, Birth_ID, Certificate_ID, Name, Gender, Date_of_Birth, Place_of_Birth, Name_of_Mother, Name_of_Father, Permanent_address_of_parents, Municipality, Registration_Number, Date_of_Registration, Date_of_Issue) {
        try {
            // var hash = sha256(new Date());
            const birthCert = {
                appID,
                Birth_ID,
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

            await ctx.stub.putState(id, Buffer.from(JSON.stringify(birthCert)));
            } catch (error) {
                console.log("error", error);   
            }
    }

    async allList(ctx) {

        try {
            let queryString = {};
            queryString.selector = {
                docType: 'birthCert'
             
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

    async getBirthCert(ctx, appID, id) {
        const birthCertAsBytes = await ctx.stub.getState(id);
        if (!birthCertAsBytes || birthCertAsBytes.length === 0) {
            throw new Error(`Birth certificate with ID: ${id} does not exist`);
        }
    
        const birthCert = JSON.parse(birthCertAsBytes.toString());
        if (birthCert.appID !== appID) {
            throw new Error(`Birth certificate with ID: ${id} does not belong to appID: ${appID}`);
        }
    
        return birthCertAsBytes.toString();
    }
}

module.exports = BirthCert;
