window.FormViewController = class FormViewController {

  constructor(form){
    this.$form = form;
    this.$inputs = [];
    this.$form.querySelectorAll('input').forEach($input =>{
      switch($input.type){
        case 'text':
          var inputName = $input.name.toLowerCase();
          var isName = inputName === 'name' || inputName === 'firstname' || inputName === 'lastname';
          this.$inputs.push(isName? new NameInputViewController($input) : new TextInputViewController($input))
          break;
        case 'email':
          this.$inputs.push(new EmailInputViewController($input))
          break;
        case 'password':
          this.$inputs.push(new PasswordInputViewController($input))
          break;
      }
    })

    //FOR SOME REASON THE INPUTS ARE NOT BEING POSTED
    this.$button = document.querySelector('#submitButton');
    this.$button.addEventListener('click', e => {
      e.preventDefault();
      var numInputs = this.$inputs.length;
      var validForm = true;
      var firstIncorrect = null;
      for(var i=0; i < numInputs; i++){
        this.$inputs.forEach($input => {
          $input.format();
          var valid = $input.validate();
          if(valid === false){
            if(validForm===true){
              firstIncorrect = $input;
            }
            validForm = false;
          }
        })
      }
      if(validForm){
        this.$button.disabled = false;
        this.$form.submit();
      }else {
        this.$button.disabled = true;
        var enableButton = setTimeout(e => {

          this.$button.disabled = false;
          clearTimeout(enableButton);
          firstIncorrect.$element.focus();
        }, 1000)
      }
    })
  }

  get elements(){
    return this.$inputs;
  }
}
