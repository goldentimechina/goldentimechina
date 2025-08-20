$(function() {
  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // Additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // Prevent default submit behavior
      // Get values from FORM
      var name = $("input#name").val();
      var email = $("input#email").val();
      var phone = $("input#phone").val();
      var message = $("textarea#message").val();
      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      var $this = $("#sendMessageButton");
      $this.prop("disabled", true); // Disable submit button to prevent duplicate submissions

      // Create object with form data, including Web3Forms-specific fields
      var formData = {
        access_key: $("input[name='access_key']").val(), // Replace with your Web3Forms access key in HTML
        name: name,
        email: email,
        phone: phone,
        message: message,
        subject: `${name} sent a message from website`, // Dynamic subject as per Web3Forms sample
        botcheck: $("input[name='botcheck']").val(),
        redirect: $("input[name='redirect']").val()
      };

      $.ajax({
        url: "https://api.web3forms.com/submit",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        cache: false,
        success: function(data) {
          // Success message
          $('#success').html("<div class='alert alert-success'>");
          $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success > .alert-success')
            .append("<strong>" + (data.message || "Your message has been sent.") + "</strong>");
          $('#success > .alert-success')
            .append('</div>');
          // Clear all fields
          $('#contactForm').trigger("reset");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          // Fail message
          $('#success').html("<div class='alert alert-danger'>");
          $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          var errorMessage = jqXHR.responseJSON && jqXHR.responseJSON.message 
            ? jqXHR.responseJSON.message 
            : "Sorry " + firstName + ", there was an error sending your message. Please try again later!";
          $('#success > .alert-danger').append("<strong>" + errorMessage + "</strong>");
          $('#success > .alert-danger').append('</div>');
          // Clear all fields
          $('#contactForm').trigger("reset");
        },
        complete: function() {
          setTimeout(function() {
            $this.prop("disabled", false); // Re-enable submit button
          }, 1000);
        }
      });
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/* When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});