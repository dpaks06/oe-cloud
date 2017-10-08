/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
var request = require('request');
var loopback = require('loopback');

var chai = require('chai');
var expect = chai.expect;
var chalk = require('chalk');
var async = require('async');

const domainName = process.env.DOMAIN_NAME;

const serviceName = process.env.APP_IMAGE_NAME;
const serviceHost = serviceName + '.' + domainName;
const baseUrl = 'https://' + serviceHost + '/api/'; 

const schedulerName = process.env.SCHEDULER_NAME;
const schedulerHost = schedulerName + '.' + domainName;
const baseSchedulerUrl = 'https://' + schedulerHost + '/api/';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var token;

var defaultContext = {
    ctx: {
        tenantId: 'default',
        remoteUser: 'admin'
    }
};

describe(chalk.blue(''), function () {
    before('login using admin', function (done) {
        var loginUser = function (cb) {
            var loginData = {'username':'admin','password':'admin'};
            request.post(
                baseUrl + 'BaseUsers/login', {
                json: loginData
                },
                function (error, response, body) {
                    if (error || body.error) {
                        console.log('error:', error || body.error);
                        return cb(error || body.error);
                    }
                    expect(response.statusCode).to.equal(200);
                    console.log('login using admin - success - ', body.id);
                    token = body.id;
                    cb();
                }
            );
        };

        var createNotes = function (cb) {
            var data = { 
                'title': 'noteTitle',
                'content': 'noteContent'
            };
            var instances = [1,2,3,4,5,6,7,8,9,10];
            async.each(instances, function (instance, eachCb) {
                request.post(
                    baseUrl + 'TestNotes&access_token=' + token, {
                    json: data
                    },
                    function (error, response, body) {
                        if (error || body.error) {
                            console.log('error:', error || body.error);
                            return eachCb(error || body.error);
                        }
                        expect(response.statusCode).to.equal(200);
                        console.log('TestNote instances creation - success');
                        eachCb();
                    }
                );  
            }, function (err) {
                if (err) {
                    console.log('error in creating TestNote instance: ', err);
                    return cb(err);
                }
                console.log('all TestNote instances created successfully');
                cb();
            });
        };

        loginUser(function (err) {
            if (err) {
                console.log('err in login: ', err);
                return done(err);
            }
            console.log('login using admin - success');
            createNotes(function (err) {
                if(err) {
                    console.log('err in creating TestNote instances: ', err);
                    return(err);
                }
                console.log('creating TestNote instances: success');
                return done();
            });
        });
    });

    it('create one time job that is supposed to succeed and check it finishes successfully', function (done) {
        var date = new Date();
        var jobData = {
            "jobModelName": "TestNote",
            "jobFnName": "changeTitle",
            "jobFnParams": ["My new Title"],
            "frequency": "Once",
            "jobDate": date,
            "priority": "1"
        };
        request.post(
            baseSchedulerUrl + 'Jobs&access_token=' + token, {
            json: data
            },
            function (error, response, body) {
                if (error || body.error) {
                    console.log('error:', error || body.error);
                    return done(error || body.error);
                }
                expect(response.statusCode).to.equal(200);
                console.log('Job instance creation - success');
                return continueLogic(body.id, done);
            }
        );
        
        var continueLogic = function (jobId, done) {
            request.get(
                baseSchedulerUrl + 'Monitorings?filter={"where":{"jobId": "' + jobId + '"}}&access_token=' + token, {
                },
                function (error, response, body) {
                    if (error || body.error) {
                        console.log('error:', error || body.error);
                        return done(error || body.error);
                    }
                    expect(response.statusCode).to.equal(200);
                    console.log('Getting monitoring instances - success');
                    return finalCheck(body, done);
                }
            );
        };

        var finalCheck = function (body, done) {
            return done();
        };
    });
});