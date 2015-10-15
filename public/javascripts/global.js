// Userlist data array for filling in info box
var inventoryListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Box link click
    $('#inventoryList table tbody').on('click', 'td a.linkshowbox', showBoxInfo);


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/inventory/inventorylist', function( data ) {
        inventoryListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowbox" rel="' + this.name + '">' + this.boxid + '</a></td>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td><a href="#" class="linkdeletebox" rel="' + this.boxid + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#inventoryList table tbody').html(tableContent);
    });
};

// Show User Info
function showBoxInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisName = $(this).attr('rel');
    console.log("Thisname: " + thisName);
    // Get Index of object based on id value
    var arrayPosition = inventoryListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisName);
  
    // Get our User Object
    var thisBoxObject = inventoryListData[arrayPosition];

    //Populate Info Box
    $('#inventoryInfoName').text(thisBoxObject.name);
    $('#inventoryInfoId').text(thisBoxObject.boxid);
  //  $('#userInfoGender').text(thisUserObject.gender);
  //  $('#userInfoLocation').text(thisUserObject.location);

};

// Add User button click
    $('#btnAddBox').on('click', addBox);
    
    // Add User
function addBox(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addBox input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newBox = {
            'name': $('#addBox fieldset input#inputBoxName').val(),
            'id': $('#addBox fieldset input#inputBoxId').val(),
        }
        
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newBox,
            url: '/inventory/addbox',
            dataType: 'JSON'
        }).done(function( response ) {
           
            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addBox fieldset input').val('');

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

    // Delete User link click
    $('#inventoryList table tbody').on('click', 'td a.linkdeletebox', deleteBox);
    
// Delete User
function deleteBox(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this box?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/inventory/deletebox/' + $(this).attr('rel')
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


