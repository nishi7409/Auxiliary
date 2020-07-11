var curl = require('curlrequest');
const fs = require("fs");

const config = require("./settings/config.json");
const localPackage = require("./package.json")
const localPackageLock = require("./package-lock.json")

// This function will be called last once everything else has been updated.
function updatePackageJson() {

}

// This is called by index.js if a version update is indeed needed and auto updating is allowed.
function updateApplication() {
    // Does a final redudent check to ensure that the application truly needs updating. Package-lock and package.json should also match. If not, will not update.
    if (localPackageLock.version == localPackage.version) {
        curl.request({ url: 'https://raw.githubusercontent.com/nishi7409/Auxiliary/dev/package.json' }, function (packageError, file) {
            if (!packageError) {
                let requestedPackage = JSON.parse(file)
                // Compares to BOTH package.json and package-lock.json. Both should be updated.
                if (requestedPackage.version > localPackage.version && requestedPackage.version > localPackageLock.version) {
                    // Fetches index.js first, as this is a key file and is critical to maintain up to date.
                    curl.request({ url: 'https://raw.githubusercontent.com/nishi7409/Auxiliary/dev/index.js' }, function (indexError, file) {
                        if (!indexError) {
                            fs.writeFile("./index.js", file, function(writeError) {
                                if (writeError) {
                                    warn("Error writing to index.js")
                                } else {
                                    console.log("Index.js updated")
                                }
                            })
                        }
                    })
                }
            } else {
                warn("Error fetching package.json from Github")
            }
        })
    } else {
        warn("Internal versions do not match. Cannot proceed with updating until this is resolved.", "Package.json Version: "+localPackage.version, "Package-lock.json Version: "+localPackageLock.version)
    }
}

module.exports = { updateApplication }
