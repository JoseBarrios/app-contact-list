window.TextInputViewController = class TextInputViewController {

    //////////////////////
    //
    // CONSTRUCTOR
    //
    //////////////////////

    //Chrome TextInput Types
    //  - Text
    //  - Email
    //  - Password
    //  - Date (not yet supported)
    //  - Search (not yet supported)
    //  - Tel (not yet supported)
    //  - URL (not yet supported)

    //TextInput attributes
    //  - Type
    //  - Required (not yet supported);


    constructor(element, attributes){
        this.$element = element;
        this.attributes = attributes || {};

        //Attributes (which set behaviour)
        this.type = attributes.type? attributes.type : this.$element.type;
        this.required = attributes.required? attributes.required : this.$element.required;

        //Instance properties
        this.originalValue = this.$element.value || null;
        this.originalZIndex = this.$element.style.zIndex || 1;
        this.originalPlaceholder = this.$element.placeholder || null;
        this.defaultPlaceholder = 'Invalid input';
        this.defaultErrorMessage = 'Invalid input';
        this.capitalizeFirstWord = false;
        this.capitalizeWords = false;
        this.lowerCase = false;
        this.minChars = null;
        this.maxChars = null;


        //Array of validators
        this.validators = [];

        this.validators.push(()=>{
            if(this.minChars){
                if(this.$element.value.length < this.minChars){
                    this.displayError(`Must be at least ${this.minChars} characters`)
                    return false;
                }
            }
            return true;
        })

        this.validators.push(()=>{
            if(this.maxChars){
                if(this.$element.value.length > this.maxChars){
                    this.displayError(`Must be at most ${this.maxChars} characters`)
                    return false;
                }
            }
            return true;
        })


        //EVENT HANDLERS
        this.$element.addEventListener('focus', e => {
            this.$element.value = '';//Remove input
            this.$element.style.zIndex = 9000;
        });
        this.$element.addEventListener('blur', e => {
            this.$element.style.zIndex = this.originalZIndex;
            this.$element.placeholder = this.defaultPlaceholder;
        });
    }


    //////////////////////
    //
    //  PUBLIC METHODS
    //
    //////////////////////

    set errorMessage(msg){
        this.defaultErrorMessage = msg;
    }


    format() {
            //RUN ENFORCERS FIRST
        if(this.capitalizeWords){
            this._forceWordCapitalization();
        }
        //ENFORCER
        if(this.lowerCase){
            this._forceLowerCase();
        }
    }

    validate() {
        this.format();
        //RUN ALL VALIDATORS
        var testResult = true;
        this.validators.forEach(validateItem => {
            //Break if invalid found
            if(!validateItem()){ testResult = false; }
        })
        //is valid?
        return testResult;
    }


    displayError(msg){
        this.$element.value = '';
        this._appendAnimationClass('shake')
        this.$element.placeholder = msg || this.defaultErrorMessage;;
        var removeAnimation = setTimeout(e => {
            this._removeAnimationClass('shake');
            clearTimeout(removeAnimation);
        }, 1000)
    }


    //////////////////////
    //
    //  PRIVATE METHODS
    //
    //////////////////////


    _forceWordCapitalization(){
        var capitalizedWords = [];
        var words = this.$element.value.split(' ');
        words.forEach((word, index) => {
            capitalizedWords.push(word.charAt(0).toUpperCase() + word.slice(1));
        })
        this.$element.value = capitalizedWords.join(' ');
    }


    _forceLowerCase(){
        var capitalizedWords = [];
        var words = this.$element.value.split(' ');
        words.forEach((word, index) => {
            capitalizedWords.push(word.toLowerCase());
        })
        this.$element.value = capitalizedWords.join(' ');
    }

    _appendAnimationClass(newClass){
        var classArray = this.$element.className.split(' ')
        var targetIndex = classArray.indexOf(newClass);
        if(targetIndex !== -1){ //Already has class
            classArray.splice(targetIndex, 1);
            this.$element.className = classArray.join(' ')
            this.$element.className += ` ${newClass}`;
        }
        else {
            this.$element.className += ` ${newClass}`;
        }

    }

    _removeAnimationClass(className){
        var classArray = this.$element.className.split(' ')
        var targetIndex = classArray.indexOf(className);
        if(targetIndex !== -1){
            classArray.splice(targetIndex, 1);
            this.$element.className = classArray.join(' ')
        }
    }
}
