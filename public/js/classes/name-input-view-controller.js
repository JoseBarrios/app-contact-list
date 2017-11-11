window.NameInputViewController = class NameInputViewController extends TextInputViewController {

    //////////////////////
    // CONSTRUCTOR
    //////////////////////
    constructor(element, attributes){
        attributes = attributes || {};
        element.type = 'text';
        attributes.type = 'name';
        super(element, attributes);

        //Main element
        this.$element = element;

        //Instance properties
        this.defaultPlaceholder = this.$element.placeholder;
        this.defaultErrorMessage = 'Plase enter a valid name';
        this.capitalizeWords = true;
    }
}
