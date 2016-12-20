//adding the 'chai' assertion lib from the json object file
const chai = require('chai');
chai.use(require('chai-fs'));
//adding methods that chai requires
// const should = chai.should();
// const expect = require('chai').expect;
// const assert = require('chai').assert;

//linking the functions.js file from the parent folder where we will have a class
const Functions = require("../index");
const func = new Functions();

//first unit test
describe("Demo", () => {
    // it("should return a number", (done) => {
    //     func.getRandomNumber()
    //         .then(result => {
    //             console.log(result);
    //             result.should.be.an("number");
    //             done();
    //         })
    // });

    it("should create a file", (done) => {
        func.create(aFile)
            .then(result => {
                expect(path).to.have.dirname("aFile", "it exists"); 
            })
    });
});