window.EmailInputViewController = class EmailInputViewController extends TextInputViewController {

    //////////////////////
    // CONSTRUCTOR
    //////////////////////
    constructor(element, attributes){
        attributes = attributes || {};
        element.type = 'email';
        attributes.type = 'email';
        super(element, attributes);

        //Main element
        this.$element = element;

        //Instance properties
        this.defaultPlaceholder = 'email@email.com';
        this.defaultErrorMessage = 'Plase enter a valid email';
        this.lowerCase = true;

        //Validators must call display error
        this.validators.push(()=>{
            var valid  = this.$element.value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
            valid = valid === null? false : true;
            if(valid === false){this.displayError(this.defaultErrorMessage)}
            return valid;
        })
    }
}
