# :blue_book: Contacts v1 | [demo](http://barrios.io/contacts)

![image](https://cdn.filestackcontent.com/fVsKX5xcSqqYr8VUZtbb)


----




## Description
Contacts is an open-sourced, web-based application for managing a contact list. It was built using NodeJS, MongoDB and web-components. To see a demo go to: [barrios.io/contacts ](http://barrios.io/contacts)

## Installation

Requires
```console
Node 8.9.1
Mongo 3.2.10
```

Installing this project is simple, run the following commands:

```console
$ git clone https://github.com/JoseBarrios/app-contact-list.git

$ cd app-contact-list

# Install dependencies
$ npm install

# Run MongoDB locally
$ sudo mongod &  # start mongodb locally

# Create config files, see examples in the config folder
$ touch config/mongo-secret.json config/cookies-secret.json 

# Fire up the project!
$ npm start      
```

Open : http://localhost:3000/contacts

**NOTE**: You must have MongoDB installed and working locally in order to run this project.

## Questions

Got questions? Reach me at contacts@barrios.io
