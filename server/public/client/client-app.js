// TODO create <divs> for each person populated.


$(document).ready(function(){
  $('#submit-person').on('click', handleSubmit);
  // appendPerson();
});

function handleSubmit(event) {
  event.preventDefault();

  var formArray = $('.person').serializeArray();

  var personData = {};

  $.each(formArray, function (index, element) {
    personData[element.name] = element.value;
  });

  console.log('personData: ', personData);

  submitPerson(personData);
}




function submitPerson(object) {

  $.ajax({
    type: 'POST',
    url: '/person',
    data: object,
    success: personResponse
  });
}

function personResponse() {
  $.ajax({
    type: 'GET',
    url: '/person',
    success: appendPerson
  });
}


function appendPerson(personArray) {
  $('select').empty();
  personArray.forEach(function(person) {
    $('select').append('<option>' + person.first_name + ' ' + person.last_name + '</option>');
  });
}
