let $leftPannel = document.querySelector('.left-pannel');
let $rightPannel = document.querySelector('.right-pannel');
let $jobPostingCards = document.querySelectorAll('ui-job-posting-card');
let $jobPosting = document.querySelector('ui-job-posting');
let onMobile = window.innerWidth < 737;

let fadeIn = (element) => {
  return new Promise((resolve, reject) => {
    let opacityTarget = 1;
    element.style.opacity = 0;
    function increase(timestamp) {
      let currentOpacity = Number(element.style.opacity);
      if (currentOpacity < 1) {
        currentOpacity += 0.1;
        element.style.opacity = currentOpacity.toString();
        window.requestAnimationFrame(increase);
      }
      if(currentOpacity > 1){ resolve(); }
    }
    window.requestAnimationFrame(increase);
  })
}

let fadeOut = (element) => {
  return new Promise((resolve, reject) => {
    let opacityTarget = 0;
    element.style.opacity = 1;
    function decrease(timestamp) {
      let currentOpacity = Number(element.style.opacity);
      if (currentOpacity > 0) {
        currentOpacity -= 0.5;
        element.style.opacity = currentOpacity.toString();
        window.requestAnimationFrame(decrease);
      }
      if(currentOpacity <= 0){ resolve(); }
    }
    window.requestAnimationFrame(decrease);
  })
}



if(onMobile){ $rightPannel.hidden = onMobile; }


let jobID = getParameterByName('jobID');
if(!jobID && !onMobile){
  $jobPostingCards[0].setAttribute('selected', 'true');
}


window.onresize = (e) => {
  onMobile = window.innerWidth < 737;
  $rightPannel.hidden = onMobile;
}

let unselectCards = function(exception){
  $jobPostingCards.forEach(jobPostingCard => {
    if(jobPostingCard !== exception){
      jobPostingCard.setAttribute('selected', 'false');
    }
  });
}

$jobPostingCards.forEach(jobPostingCard => {

  jobPostingCard.addEventListener('selected', e => {
    if(onMobile){
			location.href="/job-posting/"+e.detail.identifier;
    }
    else {
      fadeOut($rightPannel).then(() => {
        $rightPannel.scrollTop = 0;
        $jobPosting.setAttribute('value', JSON.stringify(e.detail));
        $jobPosting.setAttribute('action', e.detail.action);
        let url = updateUrlParameter('/', 'jobID', e.detail.identifier)
        window.history.pushState({}, '', url);
        document.title = 'Hiring | '+e.detail.title;
        fadeIn($rightPannel);
      });
    }
    unselectCards(jobPostingCard)
  })


  //SELECT JOB POSTING CARD, IF IT MATCHES PASSED QUERY
  let value = jobPostingCard.getAttribute('value');
  let jobPosting = JSON.parse(value);
  let currentJobID = jobPosting.identifier;
  if(jobID === currentJobID){
    jobPostingCard.setAttribute('selected', 'true');
  }
})

function getParameterByName(name, url){
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updateUrlParameter(uri, key, value) {
  // remove the hash part before operating on the uri
  var i = uri.indexOf('#');
  var hash = i === -1 ? ''  : uri.substr(i);
  uri = i === -1 ? uri : uri.substr(0, i);

  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";

  if (!value) {
    // remove key-value pair if value is empty
    uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1);
    }
    // replace first occurrence of & by ? if no ? is present
    if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
  } else if (uri.match(re)) {
    uri = uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    uri = uri + separator + key + "=" + value;
  }
  return uri + hash;
}

//TODO
//We shouldn't load all the jobPostings, so use iFrame, or HTTPRequest?
