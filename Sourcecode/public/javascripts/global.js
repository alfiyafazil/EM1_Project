// booklist data array for filling in info box
var bookListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the book table on initial page load
  populateTable();

  // bookname link click
  $('#bookList table tbody').on('click', 'td a.linkshowbook', showbookInfo);

  // Add book button click
  $('#btnAddbook').on('click', addbook);

  // Delete book link click
  $('#bookList table tbody').on('click', 'td a.linkdeletebook', deletebook);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/books/booklist', function( data ) {

    // Stick our book data array into a booklist variable in the global object
    bookListData = data;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowbook" rel="' + this.bookname + '" title="Show Details">' + this.bookname + '</a></td>';
      tableContent += '<td>' + this.author + '</td>';
      tableContent += '<td><a href="#" class="linkdeletebook" rel="' + this._id + '" title="Delete Book"">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#bookList table tbody').html(tableContent);
  });
};

// Show book Info
function showbookInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve bookname from link rel attribute
  var thisbookName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = bookListData.map(function(arrayItem) { return arrayItem.bookname; }).indexOf(thisbookName);

  // Get our book Object
  var thisbookObject = bookListData[arrayPosition];

  //Populate Info Box
  $('#bookInfoName').text(thisbookObject.bookname);
  $('#bookInfoAuthor').text(thisbookObject.author);
  $('#bookInfoGenre').text(thisbookObject.genre);
  $('#bookInfoYear').text(thisbookObject.year);

};

// Add book
function addbook(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addbook input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all book info into one object
    var newbook = {
      'bookname': $('#addbook fieldset input#inputbookname').val(),
      'author': $('#addbook fieldset input#inputbookauthor').val(),
      'genre': $('#addbook fieldset input#inputbookgenre').val(),
      'year': $('#addbook fieldset input#inputbookyear').val()
    }

    // Use AJAX to post the object to our addbook service
    $.ajax({
      type: 'POST',
      data: newbook,
      url: '/books/addbook',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addbook fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete book
function deletebook(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this book?');

  // Check and make sure the book confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/books/deletebook/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};