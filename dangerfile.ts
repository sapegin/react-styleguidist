import { danger, warn } from 'danger';

const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('package-lock.json');

if (packageChanged && !lockfileChanged) {
	warn(`Changes were made to \`package.json\`, but not to \`package-lock.json\`.

If you’ve changed any dependencies (added, removed or updated any packages), please run \`npm install\` and commit changes in package-lock.json file. Make sure you’re using npm 5+.`);
}

if (!packageChanged && lockfileChanged) {
	warn(`Changes were made to \`package-lock.json\`, but not to \`package.json\`.

Please remove \`package-lock.json\` changes from your pull request. Try to run \`git checkout master -- package-lock.json\` and commit changes.`);
}
