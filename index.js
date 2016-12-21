#!/usr/bin/env node --harmony
/**
 * The prototype of the Bee CLI fo the Admin System
 */
//including the libraries required
const prompt = require('prompt'); //requred for reading the username and passwords
const program = require('commander'); //required for creating the cli app - not sure if i need it
const mkdirp = require('mkdirp'); //required for makinf a directory.
const fs = require('fs-extra'); //required to remove a file
const exec = require('child_process').exec; //this is user to be able to run command line commands
const shell = require('shelljs/global');
const path = require("path");//to get the path
let username;
let password;
let currentLoc;

/**
 * This function include calls to all the promises required to run the app
 */
function promiseResolve() {
    createDir()
        .then(() => {
            return Promise.all([gitClone()]);
        })
        .then(() => {
            return Promise.all([updateGitClone()]);
        })
        .then(() => {
            return Promise.all([changeWorkingDirectory()]);
        })
        .then(() => {
            return Promise.all([createHerokuApp()]);
        })
        .then(() => {
            return Promise.all([addHerokuProvisionsSendgrid()]);
        })
        .then(() => {
            return Promise.all([addHerokuProvisionsMongoLab()]);
        })
        .then(() => {
            return Promise.all([addHerokuProvisionsRedis()]);
        })
        .then(() => {
            return Promise.all([addHerokuProvisionsCloudinary()]);
        })
        .then(() => {
            return Promise.all([pushHerokuApp()]);
        })
        .then(() => {
            return Promise.all([deleteDir()]);
        })
        .then(() => {
            console.log("Done");
            process.exit();
        })
        .catch(err => {
            console.log(err.message);
            process.exit();
        })

};


/** 
* This function creates a directory
* in the working directory
*/
function createDir() {
    return new Promise(
        (resolve, reject) => {
            currentLoc = process.cwd(); //assigning the current location to a varible
            console.log(currentLoc);
            currentLoc += '/' + "gitProjectClone"; //appending the directory name to the path
            console.log(currentLoc);
            // actually creating the directory using a nde library
            mkdirp(currentLoc, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('File created!')
                    resolve();
                }
            })
        }
    )
};

/**
 * This function clones the git repo. 
 * The link to the repo is hardcoded.
 * In future versions should be read from the console
 */

function gitClone() {
    return new Promise(
        (resolve, reject) => {
            exec("git clone https://github.com/agrigorescu/admin-contact-demo-object.git gitProjectClone", (error, stdout, stderr) => {
                if(error){
                    console.log("error " + error);
                    reject(error);
                } else {
                    console.log("stdout " + stdout);
                    console.log("stderr " + stderr);
                    resolve();
                }
            })
        }
    )
};

/**
 * Load the changes that are to be made in an object. 
 */

let changesToGit = {
    name: "Brand Name",
    maxUsers: '2',
    maxStories: '2',
    maxSurveys: '2',
    maxDocs: '2',
    imageUpload: "link to the image"
}

/**
 * This function will create a file with the information provided
 */
function createNewFileWithChanges(programName, dir){
    return new Promise(
        (resolve, reject) => {
            fs.writeFile(programName, dir, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(result);
                    console.log("Created : " + programName.substring(1));
                    resolve();
                }
            });
        }
    )     
}

/**
 * This function will make changes to the git repo using an object
 */
function updateGitClone(){
    return new Promise(
        (resolve, reject) => {
            createNewFileWithChanges(currentLoc + '/test.txt', JSON.stringify(changesToGit, null, 2) + '\n')
            .then(() => {
                console.log('The data was added to file!');
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    })
}

/**
* This function deletes the directory
*/
function deleteDir() {
    return new Promise(
        (resolve, reject) => {
            console.log(currentLoc);
            fs.remove(currentLoc, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('Delete Success!!')
                    resolve();
                }
            })
        }
    )
};

/**
 * This function moved into the cloned git repo 
 */
function changeWorkingDirectory(username, password){
    return new Promise(
        (resolve, reject) => {
            cd('gitProjectClone');
            console.log(process.cwd());
            resolve();
        }
    )
};

/**
 * This function creates a heroku app 
 */
function createHerokuApp() {
    return new Promise(
        (resolve, reject) => {
            exec("heroku create", (error, stdout, stderr) => {
                if(error){
                    console.log("error " + error);
                    reject(error);
                } else {
                    console.log("stdout " + stdout);
                    console.log("stderr " + stderr);
                    resolve();
                }
            })
        }
    )
};

/**
 * This set of functions adds provisions to the heroku app 
 */
//The first function add Sendgrid
function addHerokuProvisionsSendgrid(username, password){
    return new Promise(
        (resolve, reject) => {
            exec("heroku addons:create sendgrid:starter", (error, stdout, stderr) => {
                if(error){
                    console.log("error " + error);
                    reject(error);
                } else {
                    console.log("stdout " + stdout);
                    console.log("stderr " + stderr);
                    resolve();
                }
            })
        }
    )
};

//The second function will add MongoLab
function addHerokuProvisionsMongoLab(username, password){
    return new Promise(
        (resolve, reject) => {
            exec("heroku addons:create mongolab:sandbox", (error, stdout, stderr) => {
                if(error){
                    console.log("error " + error);
                    reject(error);
                } else {
                    console.log("stdout " + stdout);
                    console.log("stderr " + stderr);
                    resolve();
                }
            })
        }
    )
};

//The next function will add Redis DB
function addHerokuProvisionsRedis(username, password){
    return new Promise(
        (resolve, reject) => {
            exec("heroku addons:create heroku-redis:hobby-dev", (error, stdout, stderr) => {
                if(error){
                    console.log("error " + error);
                    reject(error);
                } else {
                    console.log("stdout " + stdout);
                    console.log("stderr " + stderr);
                    resolve();
                }
            })
        }
    )
};

//This funciton will add Cloudinary
function addHerokuProvisionsCloudinary(username, password){
    return new Promise(
        (resolve, reject) => {
            exec("heroku addons:create cloudinary:starter", (error, stdout, stderr) => {
                if(error){
                    console.log("error " + error);
                    reject(error);
                } else {
                    console.log("stdout " + stdout);
                    console.log("stderr " + stderr);
                    resolve();
                }
            })
        }
    )
};

/**
 * This function pushes the app to heroku
 */
function pushHerokuApp(username, password){
    return new Promise(
        (resolve, reject) => {
            console.log("Pushing to Heroku");
            exec("git push heroku master", (error, stdout, stderr) => {
                if(error){
                    console.log("error " + error);
                    reject(error);
                } else {
                    console.log("stdout " + stdout);
                    console.log("stderr " + stderr);
                    resolve();
                }
            })
        }
    )
}

//making this a program to be run via the command line
program
    //setting the actions of the program
    .action(promiseResolve())

