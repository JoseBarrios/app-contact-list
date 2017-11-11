let jobPosting = document.querySelector('ui-job-posting');
let value = JSON.parse(jobPosting.getAttribute('value'));

let jobBoardURL = '/?jobID='+value.identifier;
window.history.pushState({}, '', jobBoardURL);
