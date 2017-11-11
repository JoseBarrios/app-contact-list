const EMAIL = document.querySelector('#email').value;
const IMAGE = document.querySelector('#image').value;
const NAME = document.querySelector('#name').value;
const DESCRIPTION = document.querySelector('#description').value;
const CSRF_TOKEN = document.querySelector('#csrfToken').value;
const AMOUNT = parseInt(document.querySelector('#amount').value);
const PAYMENT_URL = document.querySelector('#paymentURL').value;
const STRIPE_KEY = document.querySelector('#stripeKey').value;
const READY_STATE = 4;
const OK_STATUS = 200;

const $STRIPE_BUTTON = document.querySelector('#stripeButton')
const $PAID_STAMP_IMG = document.querySelector('#paidStampImg')
const $SIGNATURE_IMG = document.querySelector('#signatureImg')
const $SIGNATURE_FOOTER = document.querySelector('#signatureFooter')
const $CONFIRMATION_MSG = document.querySelector('#confirmationMsg')

var paymentSuccessful = false;
const xmlhttp = new XMLHttpRequest();


var handler = StripeCheckout.configure({
  key: STRIPE_KEY,
  image: IMAGE,
  locale: 'auto',
  token: paymentComplete
});


$STRIPE_BUTTON.addEventListener('click', function(e) {
  e.preventDefault();
  $STRIPE_BUTTON.disabled = true;
  $STRIPE_BUTTON.style.cursor = 'not-allowed';
  $STRIPE_BUTTON.innerHTML = 'Processing...'
  // Open Checkout with further options:
  handler.open({
    name: NAME,
    amount: AMOUNT,
    //email: EMAIL,
    closed: closedCheckout
  });
});


function closedCheckout(e){
  let cycle = 0;
  let iterations = 0;
  let timer = window.setInterval(function(e){
    if(paymentSuccessful){
      window.clearInterval(timer)
    }
    else if(iterations < 10){
      $STRIPE_BUTTON.disabled = true;
      $STRIPE_BUTTON.style.cursor = 'not-allowed';
      if(cycle===1) $STRIPE_BUTTON.innerHTML = 'Processing&nbsp&nbsp&nbsp'
      if(cycle===2) $STRIPE_BUTTON.innerHTML = 'Processing.&nbsp&nbsp'
      if(cycle===3) $STRIPE_BUTTON.innerHTML = 'Processing..&nbsp'
      if(cycle===4) $STRIPE_BUTTON.innerHTML = 'Processing...'
      if(cycle===4) cycle=0;
    }
    else if(iterations > 20 && iterations < 30){
      $STRIPE_BUTTON.innerHTML = 'Not Completed'
      $STRIPE_BUTTON.style.borderColor = '#ff675f'
      $STRIPE_BUTTON.style.color = '#ff675f'
    }
    else if(iterations > 30){
      $STRIPE_BUTTON.disabled = false;
      $STRIPE_BUTTON.style.cursor = 'Pointer';
      $STRIPE_BUTTON.innerHTML = 'Pay with Credit Card'
      $STRIPE_BUTTON.style.borderColor = '#37a0e1'
      $STRIPE_BUTTON.style.color = '#37a0e1'
      window.clearInterval(timer)
      iterations=0;
      cycle=0;
    }
    cycle++;
    iterations++;
  },300);
}

xmlhttp.onreadystatechange = function(e){
  if (this.readyState == READY_STATE && this.status == OK_STATUS) {
    paymentSuccessful = true;
    //INITIAL STAMP STATE
    $PAID_STAMP_IMG.style.position = 'absolute'
    $PAID_STAMP_IMG.style.maxWidth = `500px`
    $PAID_STAMP_IMG.style.marginTop = `-50px`
    $PAID_STAMP_IMG.style.marginLeft = `-50px`
    $PAID_STAMP_IMG.style.display = 'block';
    initialSize = parseInt($PAID_STAMP_IMG.style.maxWidth);
    initialMarginTop = parseInt($PAID_STAMP_IMG.style.marginTop);
    initialMarginLeft = parseInt($PAID_STAMP_IMG.style.marginLeft);
    //REMOVE SIGNATURE
    $SIGNATURE_IMG.style.display = 'none';
    $SIGNATURE_FOOTER.style.display = 'none';
    $STRIPE_BUTTON.innerHTML = 'Payment Successful'
    //MESSAGE
    $CONFIRMATION_MSG.innerHTML = `We've sent your receipt to ${EMAIL}`
    $STRIPE_BUTTON.style.borderColor = '#129522'
    $STRIPE_BUTTON.style.color = '#129522'
    window.requestAnimationFrame(stamp)
  }
}

const FRAMES = 15;
let stampFrames = FRAMES;
let initialSize = null;
let initialMarginTop = null;
let initialMarginLeft = null;
function stamp(timestamp){
  let widthStep = 250/FRAMES;
  let marginTopStep = 40/FRAMES;
  let marginLeftStep = 100/FRAMES;
  stampFrames--;
  if(stampFrames >= 0){
    let currentWidth = parseInt($PAID_STAMP_IMG.style.maxWidth);
    $PAID_STAMP_IMG.style.maxWidth = `${currentWidth - widthStep}px`
    let currentMarginTop = parseInt($PAID_STAMP_IMG.style.marginTop);
    $PAID_STAMP_IMG.style.marginTop = `${currentMarginTop + marginTopStep}px`
    let currentMarginLeft = parseInt($PAID_STAMP_IMG.style.marginLeft);
    $PAID_STAMP_IMG.style.marginLeft = `${currentMarginLeft + marginLeftStep}px`
    window.requestAnimationFrame(stamp)
  } else{ //FINAL STATE
  }
}

function paymentComplete(stripeToken){
  // You can access the token ID with `token.id`.
  // Get the token ID to your server-side code for use.
  //window.requestAnimationFrame(smoothScrollToSavedPosition);
  stripeToken = JSON.stringify(stripeToken);
  xmlhttp.open("POST", PAYMENT_URL, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let queryString = `stripeToken=${stripeToken}&_csrf=${CSRF_TOKEN}&amount=${AMOUNT}`;
  xmlhttp.send(queryString);
}
