//const schema = require(`${global.APP_ROOT}/schemas/person`);
//var Ajv = require('ajv');

class Person {

  static get type(){ return 'Person'; }

  constructor(model){
    model = model || {};
		//const avj = new Ajv(); // options can be passed, e.g. {allErrors: true}
		//this.validate = avj.compile(schema);
		//var valid = this.validate(model);
		//if (!valid) console.log(validate.errors);

    this.additionalName = model.additionalName;
		this.affiliation = model.affiliation;
    this.contactPoint = model.contactPoint;
    this.email = model.email;
    this.familyName = model.familyName;
    this.givenName = model.givenName;
    this.honorificPrefix = model.honorificPrefix;
		this.honorificSuffix = model.honorificSuffix;
    this.jobTitle = model.jobTitle;
    this.telephone = model.telephone;
    this.worksFor = model.worksFor;
  }

	//AKA Middlename
  get additionalName(){ return this.model.additionalName || '' }
  set additionalName(value){
		if(!value) return;
  }

  get affiliation(){ return this.model.affiliation }
  set affiliation(value){
  }

  get contactPoint(){ return this.model.contactPoint; }
  set contactPoint(value){
  }

  get email(){ return this.model.email; }
  set email(value){
  }

  get familyName(){ return this.model.familyName; }
  set familyName(value){
  }

  get givenName(){ return this.model.givenName; }
  set givenName(value){
  }

  get honorificPrefix(){ return this.model.honorificPrefix; }
  set honorificPrefix(value){
  }

  get honorificSuffix(){ return this.model.honorificSuffix; }
  set honorificSuffix(value){
  }

  get jobTitle(){ return this.model.jobTitle; }
  set jobTitle(value){
  }

  get telephone(){ return this.model.telephone; }
  set telephone(value){
  }

  get worksFor(){ return this.model.worksFor; }
  set worksFor(value){
  }


  //////////////////////
  // COMPUTED PROPERTIES
  //////////////////////

  get fullName(){
    let name = `${this.givenName} ${this.additionalName.charAt(0) || '\b'}${this.additionalName? '.' : ''} ${this.familyName}`;
    name = name.replace(/.?\x08/, "");
    return name;
  }

}

module.exports = Person;
