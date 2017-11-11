let $leftPannel = document.querySelector('.left-pannel');
let $rightPannel = document.querySelector('.right-pannel');
let $jobPostingForm = document.querySelector('ui-job-posting-form');
let $jobPosting = document.querySelector('ui-job-posting');

let onMobile = window.innerWidth < 737;

window.onresize = (e) => {
  onMobile = window.innerWidth < 737;
  $rightPannel.hidden = onMobile;
}

$jobPostingForm.addEventListener('update', e => {
  console.log(e.detail)
  $jobPosting.hiringOrganization = e.detail.hiringOrganization
  $jobPosting.setAttribute('value', JSON.stringify(e.detail));
})

$jobPostingForm.addEventListener('finish', e => {

  var xhttp = new XMLHttpRequest();
  e.detail._csrf = document.querySelector('#csrfToken').value;
  e.detail.hiringOrganization = JSON.stringify(e.detail.hiringOrganization)
  e.detail.jobLocation = JSON.stringify(e.detail.jobLocation)

  var data = Object.keys(e.detail).map(function(key) {
      return key + '=' + e.detail[key];
  }).join('&');

  console.log(data)

  xhttp.open("POST", "/job-posting/create");
  xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.send(data);
})
