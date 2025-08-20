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

      // Create FormData object to handle all form inputs, including hidden fields like access_key
      var formData = new FormData();
      formData.append("access_key", "YOUR_ACCESS_KEY_HERE"); // Replace with your Web3Forms access key
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("message", message);
      formData.append("subject", $("input[name='subject']").val());
      formData.append("botcheck", $("input[name='botcheck']").val());
      formData.append("redirect", $("input[name='redirect']").val());

      $.ajax({
        url: "https://api.web3forms.com/submit",
        type: "POST",
        data: formData,
        processData: false, // Prevent jQuery from processing FormData
        contentType: false, // Let FormData set the content type
        cache: false,
        success: function(data) {
          if (data.success) {
            // Success message
            $('#success').html("<div class='alert alert-success'>");
            $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
              .append("</button>");
            $('#success > .alert-success')
              .append("<strong>Your message has been sent.</strong>");
            $('#success > .alert-success')
              .append('</div>');
            // Clear all fields
            $('#contactForm').trigger("reset");
          } else {
            // Fail message
            $('#success').html("<div class='alert alert-danger'>");
            $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
              .append("</button>");
            $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", there was an error sending your message. Please try again later!</strong>");
            $('#success > .alert-danger').append('</div>');
            // Clear all fields
            $('#contactForm').trigger("reset");
          }
        },
        error: function() {
          // Fail message
          $('#success').html("<div class='alert alert-danger'>");
          $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that the server is not responding. Please try again later!</strong>");
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