/**
 * 
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * 
 */

var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var bootstrap = require('./bootstrap');
var loopback = require('loopback');
var app = bootstrap.app;
var models = bootstrap.models;
var parentModelName = "CountryModel";
var childModelName = "CityModel";

describe(chalk.blue('Decision table belongsTo relation check'), function () {
  this.timeout(20000);
  var parentModel;
  var childModel;
  before('Create DecisionTables and models for belopngsTo relation check', function (done) {

    models.ModelDefinition.create({
      'name': parentModelName,
      'base': 'BaseEntity',
      'properties': {
        'name': 'string'
      }
    }, bootstrap.defaultContext, function (err, model) {
      if (err) {
        done(err);
      } else {
        models.ModelDefinition.create({
          'name': childModelName,
          'base': 'BaseEntity',
          'properties': {
            'name': {
              'type': 'string',
            },
            'countryName': {
              'type': 'string',
            }
          },
          'relations': {
            'country': {
              'type': 'belongsTo',
              'model': parentModelName,
              'foreignKey': 'countryId'
            }
          }
        }, bootstrap.defaultContext, function (err, model) {
          if (err) {
            done(err);
          } else {
            parentModel = loopback.getModel(parentModelName, bootstrap.defaultContext);
            childModel = loopback.getModel(childModelName, bootstrap.defaultContext);
            models.DecisionTable.create({
              "name": "RelationValidator",
              "document": {
                "documentName": "RelationValidator.xlsx",
                "documentData": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,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"
              }
            }, bootstrap.defaultContext, function (err, data) {
              if (err) {
                return done(err);
              }
              expect(data.name).to.be.equal("RelationValidator");
              var modelRuleData = {
                "modelName": childModelName,
                "disabled": false,
                "validationRules": ["RelationValidator"]
              }
              models.ModelRule.create(modelRuleData, bootstrap.defaultContext, function (err, result) {
                if (err) {
                  return done(err);
                }
                expect(result.modelName).to.be.equal(childModel.modelName);
                done();
              });
            });
          }
        });
      }
    });
  });

  it('Successfully creates childModel data as belongsTo validation passes', function (done) {
    var childPayload = { "name": "Sydney", "id": "sy1", "countryId": "aus1", "countryName": "Australia" };
    var parentPayload = { "name": "Australia", "id": "aus1" };
    parentModel.create(parentPayload, bootstrap.defaultContext, function (err, parentInst) {
      if (err) {
        return done(err);
      }
      childModel.create(childPayload, bootstrap.defaultContext, function (err, childInst) {
        if (err) {
          return done(err);
        }
        expect(childInst.name).to.be.equal(childPayload.name);
        expect(childInst.id).to.be.equal(childPayload.id);
        expect(childInst.countryId).to.be.equal(childPayload.countryId);
        expect(childInst.countryName).to.be.equal(childPayload.countryName);
        expect(childInst.countryName).to.be.equal(parentPayload.name);
        done();
      });
    });
  });

  it('Fails to create childModel data as belongsTo validation is not met', function (done) {
    var childPayload = { "name": "Wellington", "id": "wl1", "countryId": "nz1", "countryName": "Nova Zeelandia" };
    var parentPayload = { "name": "New Zealand", "id": "nz1" };
    parentModel.create(parentPayload, bootstrap.defaultContext, function (err, parentInst) {
      if (err) {
        return done(err);
      }
      childModel.create(childPayload, bootstrap.defaultContext, function (err, childInst) {
        expect(err).not.to.be.undefined;
        done();
      });
    });
  });
});