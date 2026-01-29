const glob = require('glob');
const path = require('path');
const fs = require('fs');

const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const communitySchema = require('../conferences_schema_v2.json');

const ajv = new Ajv();
addFormats(ajv);

const validate = ajv.compile(communitySchema);

const conferenceFiles = glob.sync(path.resolve(__dirname, '../conferences/') + '/*.json');

let failed = false;

console.log('Testing conference files');
conferenceFiles.forEach(file => {
  const baseName = path.basename(file);
  const isValid = validate(JSON.parse(fs.readFileSync(file)));

  if (!isValid) {
    failed = true;
    console.error(`X ${baseName}`);
    console.error(JSON.stringify(validate.errors, undefined, 2));
    console.error('\n');
  } else {
    console.log(`✓ ${baseName}`);
  }
});

if (failed) {
  process.exit(1);
}
