#!/usr/bin/env node --harmony
/**
 * The prototype of the Bee CLI fo the Admin System
 */
//including the libraries required
const prompt = require('prompt'); //requred for reading the username and passwords
const program = require('commander'); //required for creating the cli app - not sure if i need it
const mkdirp = require('mkdirp'); //required for makinf a directory.
const fs = require('fs-extra'); //required to remove a file
const git = require('gift');
const exec = require('child_process').exec;
let username;
let password;
let currentLoc;


function promiseResolve() {
    createDir()
        .then(() => {
            return Promise.all([gitClone()]);
        })
        // .then(() => {
        //     return Promise.all([deleteDir()]);
        // })
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
            exec("git clone https://github.com/agrigorescu/hello-world.git gitProjectClone", (error, stdout, stderr) => {
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
 * This functioin will make changes to the git repo using and object
 */
// function updateGitClone(){
//     fs.appendFile('testing-testing.txt', JSON.stringify(changesToGit), (err) => {
//         if (err) {
//             reject(err);
//         }else {
//             resolve(console.log('The "data to append" was appended to file!'));
//         }

// });
//}

/**
* This function deletes the directory
*/
function deleteDir() {
    return new Promise(
        (resolve, reject) => {
            console.log(currentLoc);
            fs.remove(currentLoc, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success!!')
                    resolve();
                }
            })
        }
    )
};

// function deleteDir() { 
//          let currentLoc = process.cwd(); //assigning the current location to a varible
//          console.log(currentLoc);
//          currentLoc +='/'+"gitProjectClone"; //appending the directory name to the path
//          console.log(currentLoc);
//          // actually deleting the directory using a nde library
//          fs.remove(currentLoc,(err) => {
//              if (err) {
//              return console.error(err);
//             } else {
//              console.log('success!');
//             }
//         })
// };

/**
 * This function asks for the username and password for heroku
 */

// function userNameAndPassword(){
//         prompt.get(['username', 'password'], function (err, result) {
//             // Log the results. 
//             console.log('Command-line input received:');
//             console.log('  username: ' + result.username);
//             console.log('  email: ' + result.email);
//             username = result.username;
//             password = result.password;
//         });
//     };


program
    //declaring the options the program will take


    //setting the actions of the program
    .action(promiseResolve())
//   .action(userNameAndPassword())

