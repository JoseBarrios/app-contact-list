window.PasswordInputViewController = class PasswordInputViewController extends TextInputViewController {

    //////////////////////
    // CONSTRUCTOR
    //////////////////////
    constructor(element, attributes){
        attributes = attributes || {};
        element.type = 'password';
        attributes.type = 'password';
        super(element, attributes);

        //Main element
        this.$element = element;

        //Instance properties
        this.defaultPlaceholder = '•••••••••••••';
        this.minChars = 8;
        this.defaultErrorMessage = `Minimum ${this.minChars}, must include numbers`

        //Validators must call display error
        this.validators.push(()=>{
            //make sure it has numbers
            var valid  = this.$element.value.match(/\d/);
            valid = valid === null? false : true;
            if(valid === false){this.displayError(this.defaultErrorMessage)}
            return valid;
        })
    }
}
