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
var parentModelName = "SupplierModel";
var childModelName = "AccountModel";

describe(chalk.blue('Decision table hasOne relation check'), function () {
  var parentModel;
  var childModel;
  before('Create DecisionTables and models for hasOne relation check', function (done) {

    models.ModelDefinition.create({
      'name': childModelName,
      'base': 'BaseEntity',
      'properties': {
        'num': 'number'
      }
    }, bootstrap.defaultContext, function (err, model) {
      if (err) {
        done(err);
      } else {
        models.ModelDefinition.create({
          'name': parentModelName,
          'base': 'BaseEntity',
          'properties': {
            'name': {
              'type': 'string',
            },
            'accountNumber': {
              'type': 'number',
            }
          },
          'relations': {
            'account': {
              'type': 'hasOne',
              'model': childModelName,
              'foreignKey': 'supplierId'
            }
          }
        }, bootstrap.defaultContext, function (err, model) {
          if (err) {
            done(err);
          } else {
            parentModel = loopback.getModel(parentModelName, bootstrap.defaultContext);
            childModel = loopback.getModel(childModelName, bootstrap.defaultContext);
            models.DecisionTable.create({
              "name": "RelationPopulator",
              "document": {
                "documentName": "RelationPopulator.xlsx",
                "documentData": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,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"
              }
            }, bootstrap.defaultContext, function (err, data) {
              if (err) {
                return done(err);
              }
              expect(data.name).to.be.equal("RelationPopulator");
              var modelRuleData = {
                "modelName": parentModelName,
                "disabled": false,
                "defaultRules": ["RelationPopulator"]
              }
              models.ModelRule.create(modelRuleData, bootstrap.defaultContext, function (err, result) {
                if (err) {
                  return done(err);
                }
                expect(result.modelName).to.be.equal(parentModel.modelName);
                done();
              });
            });
          }
        });
      }
    });
  });

  it('Decision table HasOne relation check', function (done) {
    var childPayload = { "num": 111, "id": "acc1", "supplierId": "sup1" };
    var parentPayload = { "name": "supName", "id": "sup1" };
    childModel.create(childPayload, bootstrap.defaultContext, function (err, childInst) {
      if (err) {
        return done(err);
      }
      parentModel.create(parentPayload, bootstrap.defaultContext, function (err, result) {
        if (err) {
          return done(err);
        }
        expect(result.accountNumber).to.be.equal(childPayload.num);
        done();
      });
    });
  });
});