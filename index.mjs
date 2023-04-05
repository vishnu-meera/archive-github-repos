import axios from 'axios';
import inquirer from 'inquirer';

async function fetchRepos(username, token) {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const reposUrl = `https://api.github.com/users/${username}/repos`;
  const response = await axios.get(reposUrl, { headers });

  return response.data;
}

async function archiveRepo(username, token, repoName) {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const repoUrl = `https://api.github.com/repos/${username}/${repoName}`;
  const response = await axios.patch(repoUrl, { archived: true }, { headers });

  return response.status === 200;
}

(async function () {
  console.log('GitHub Repository Archiver');

  const { username, token } = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your GitHub username:',
    },
    {
      type: 'password',
      name: 'token',
      message: 'Enter your GitHub personal access token:',
    },
  ]);

  const repos = await fetchRepos(username, token);

  console.log('\nYour repositories:');
  repos.forEach((repo, index) => {
    console.log(`${index + 1}. ${repo.name}`);
  });

  const { selectedRepos } = await inquirer.prompt({
    type: 'checkbox',
    name: 'selectedRepos',
    message: 'Select the repositories to archive:',
    choices: repos.map((repo) => repo.name),
  });

  for (const repoName of selectedRepos) {
    if (await archiveRepo(username, token, repoName)) {
      console.log(`${repoName} archived successfully!`);
    } else {
      console.log(`Failed to archive ${repoName}.`);
    }
  }
})();
