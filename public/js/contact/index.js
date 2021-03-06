window.addEventListener('WebComponentsReady', function(e) {

	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	//////////////////////
	//
	// GET VIEW REFERENCES
	//
	///////////////////////
	var $firstListItem = document.querySelector('.contact-list-person-container');
	var $contactListDivider = document.querySelector('#contactListDivider');
	var $contactListMessageText = document.querySelector('#contactListMessageText');
	var $searchInput = document.querySelector('#roladexSearchInput');
	var $deleteQueryButton = document.querySelector('#roladexSearchInputRightIcon');
	var $allResultsContainer = document.querySelector('#contactListContainer');
	var $filteredResultsContainer = document.querySelector('#searchResultListContainer');
	var $addContact = document.querySelector('#addContact');

	var $form = document.querySelector('form');
	var $givenName = document.querySelector("#givenName");
	var $familyName = document.querySelector("#familyName");
	var $telephone = document.querySelector("#telephone");
	var $email = document.querySelector("#email");
	var $emergencyGivenName = document.querySelector("#emergencyGivenName");
	var $emergencyFamilyName = document.querySelector("#emergencyFamilyName");
	var $emergencyTelephone = document.querySelector("#emergencyTelephone");

	var $list = document.querySelectorAll('.contact-list-person-container');
	var $card = document.querySelector('ui-contact-card');

	var query = window.location.search.substring(1);
	query = parseQueryString(query);
	if(query.select){
		selectByID(query.select);
	}



	//////////////////////////////////
	//
	// ADD EVENT LISTENERS
	//
	//////////////////////////////////
	let onMobile = window.innerWidth < 737;
	window.onresize = (e) => { onMobile = window.innerWidth < 737; }


	$list.forEach(item => { item.addEventListener('click', getPerson); });
	$addContact.addEventListener('click', create);


	function getPerson(e){
		let personID = e.target.id;
		let clickedOnName = (personID === "contactListPersonPrimaryText" || personID === "contactListPersonSecondaryText");
		personID = clickedOnName? e.target.parentElement.id : personID;

		if(onMobile){
			let url = '/contacts/'+personID
			window.location.href = url;
		}
		//DESKTOP
		else {
			deselectAll();
			let target = clickedOnName? e.target.parentElement : e.target;
			people.forEach(person => {
				if(person._id === personID){
					target.classList.add('selected')
					renderCard(person);
				}
			})
		}
	}


	function create(e){
		if(onMobile){
			let url = '/contacts/create/mobile';
			window.location.href = url;
		} else {
			$card.clear();
			$card.editing = true;
		}
	}

	//DELETE SEARCH INPUT
	$deleteQueryButton.addEventListener('click', function(e){
		$searchInput.value = '';
		var event = document.createEvent('Event');
		event.initEvent('input', true, true);
		$searchInput.dispatchEvent(event);
	})

	//SEARCH INPUT
	$searchInput.addEventListener('input', function(e){
		$filteredResultsContainer.innerHTML = '';
		if(e.target.value){
			$allResultsContainer.style.display = 'none';
			$filteredResultsContainer.style.display = 'initial';
		} else{
			$allResultsContainer.style.display = 'initial';
			$filteredResultsContainer.style.display = 'none';
		}
		let query = e.target.value;
		let results = search(query, people);
		renderSearchResults(results);
	})

	if(searchQuery){
		$searchInput.value = searchQuery;
		var event = document.createEvent('Event');
		event.initEvent('input', true, true);
		$searchInput.dispatchEvent(event);
	}


	$card.addEventListener('delete', (e) => {
		let person = e.target.person;
		if(person._id){
      $form.action = '/contacts/'+person._id+'/delete'
      $form.submit();
    } else {
			window.location.href = '/contacts'
    }
	});

	$card.addEventListener('update', (e) => {
		let person = e.detail.person;
		$givenName.value = person.givenName || '';
		$familyName.value = person.familyName || '';
		$telephone.value = person.telephone || '';
		$email.value = person.email || '';

		if(person.knows && person.knows.length){
			let emergencyContact = person.knows[0];
			$emergencyGivenName.value = emergencyContact.givenName || '';
			$emergencyFamilyName.value = emergencyContact.familyName || '';
			$emergencyTelephone.value = emergencyContact.telephone || '';
		}

		//ITS AN UPDATE OR DELETE
		if(person._id){
			let display = onMobile? "mobile" : "desktop";
			$form.action = `/contacts/${person._id}/update/${display}`
			$form.submit();
		}
		//ITS CREATE
		else {
			$form.action = '/contacts/create'
			$form.submit();
		}
	})




	////////////////////////////////////////////////////////////////
	//
	// FUNCITONS
	//
	///////////////////////////////////////////////////////////////////

	function deselectAll(){
		$list.forEach(item => {
			item.classList.remove('selected')
		})
	}

	function renderCard(person){
		$card.person = person;
		$card.setAttribute('person', JSON.stringify(person));
	}

	function selectByID(id){
		deselectAll();

		$list.forEach(item => {
			if(item.id === id){
				console.log(item)
				item.classList.add('selected')
			}
		})

		people.forEach(person => {
			if(person._id === id){
				renderCard(person);
			}
		})

	}


	function selectItem(e){
		deselectAll();
		let personID = e.target.id;
		people.forEach(person => {
			if(person._id === personID){
				e.target.classList.add('selected')
				renderCard(person);
			}
		})
	}

	function search(query, people) {
		let found = [];
		people.forEach(person => {
			var givenName = person.givenName.toLowerCase();
			var familyName = person.familyName.toLowerCase();
			query = query.toLowerCase();
			let fullName = `${givenName} ${familyName}`;
			if(fullName.includes(query)){
				found.push(person)
			}
		})
		return found;
	}


	function renderSearchResults(results){
		let newAlphabet = alphabet.slice(0);
		results.forEach(result => {
			let firstLetter = result[sortPrimary].charAt(0).toUpperCase();
			if(newAlphabet.includes(firstLetter)){
				let charIndex = newAlphabet.indexOf(firstLetter);
				let char = newAlphabet.splice(charIndex, 1);
				newAlphabet = newAlphabet.filter(item => item !== char)
				let divider = $contactListDivider.cloneNode(true);
				divider.innerHTML = firstLetter.toUpperCase();
				$filteredResultsContainer.appendChild(divider);
			}

			let personClone = $firstListItem.cloneNode(true);
			personClone.id = result._id;
			//Adds comma if primary listing is last name, nothing otherwise
			let comma = sortPrimary === 'familyName'? ',' : '';
			personClone.querySelector('#contactListPersonPrimaryText').innerHTML = result[sortPrimary] + comma;
			personClone.querySelector('#contactListPersonSecondaryText').innerHTML = result[sortSecondary];
			if(onMobile){
				personClone.addEventListener('click', getPerson);
			} else {
				personClone.addEventListener('click', selectItem);
			}
			$filteredResultsContainer.appendChild(personClone);
		})

		let message = $contactListMessageText.cloneNode(true);
		message.innerHTML = `${results.length} Contacts Found`
		$filteredResultsContainer.appendChild(message);
	}


	function parseQueryString(query) {
		var vars = query.split("&");
		var query_string = {};
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			// If first entry with this name
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = decodeURIComponent(pair[1]);
				// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string") {
				var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
				query_string[pair[0]] = arr;
				// If third or later entry with this name
			} else {
				query_string[pair[0]].push(decodeURIComponent(pair[1]));
			}
		}
		return query_string;
	}

})
