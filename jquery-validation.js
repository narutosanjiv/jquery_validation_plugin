this.enable_input = function(elements) {
  return elements.each(function() {
    $(this).removeAttr("disabled");
    return $(this).removeAttr("readonly");
  });
};

this.disabled_input = function(elements) {
  return $.each(elements, function(index, val) {
    return $(val).attr("disabled", "disabled");
  });
};

this.trim_whitespace = function(element) {
  return element.each(function() {
    return $(this).val($(this).val().trim());
  });
};

this.clear_all_input = function(element) {
  return element.each(function() {
    return $(this).val("");
  });
};

$(document).ready(function() {
  var allowed_format, regex;
  regex = {
    email: /^(\w+\.)*\w+@(\w+\.)+[A-Za-z]+$/,
    phone: /^\d\d{8}\d$/,
    fec: /C\d{7}\d$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/,
    subdomain: /^[a-z\d]+([-][a-z\d]+)*$/i,
    digit: /^[0-9]+$/,
    zip: /^(\d{5}|\d{9})$/,
    float: /^-?[0-9]+\.?[0-9]*$/
  };
  allowed_format = {
    email: "invalid format",
    phone: "Should contain 10 digits only",
    fec: "should start with C followed by 8 digits",
    password: "Must contain at least one of each: uppercase letter, lowercase letter, number, symbol",
    confirmation: "Password does not match",
    subdomain: "Only characters, numbers and symbol '-' is allowed",
    zip: "Should contain 5 or 9 digits only",
    float: "invalid amount "
  };
  $.fn.validate = function() {
    var $form, is_error;
    $form = $(this);
    $(this).find('.client_side_error').remove();
    $(this).find('input').removeClass('error');
    trim_whitespace($(this).find('input[type="text"]'));
    is_error = false;
    $(this).find('input.required, select.required, textarea.required').each(function() {
      var div_error_tag, error_id, left, pos, top;
      if ($(this).val().trim() === "") {
        is_error = true;
        console.log($(this)[0].tagName);
        $(this).addClass('error');
        div_error_tag = $(custom_field_message(" can't be blank"));
        error_id = "" + ($form.attr('id')) + "_error_" + ($(this).attr('id'));
        console.log(error_id);
        console.log($(div_error_tag).attr('class'));
        console.log(div_error_tag);
        if ($(this).data('display-error') === "auto") {
          $form.append(div_error_tag);
          div_error_tag.attr('id', error_id);
          pos = $(this).offset();
          left = pos.left + "px";
          top = pos.top + 30 + "px";
          return $form.find("#" + error_id).css({
            width: '120px',
            position: 'absolute',
            top: top,
            left: left
          });
        } else if ($(this).data('display-error') === "bottom") {
          $(this).closest('.controls').append(div_error_tag);
          return $(this).nextAll('.client_side_error').css({
            width: '120px'
          });
        } else {
          $(this).closest('.controls').append(div_error_tag);
          return $(this).nextAll('.client_side_error').css({
            float: 'right',
            width: '120px'
          });
        }
      }
    });
    $(this).find('input[data-regex]').each(function() {
      var div_error_tag, error_id, left, pos, top;
      if ($(this).val() !== '' && !regex[$(this).data('regex')].test($(this).val())) {
        $(this).addClass('error');
        is_error = true;
        div_error_tag = $(custom_field_message(allowed_format[$(this).data('regex')]));
        error_id = "" + ($form.attr('id')) + "_error_" + ($(this).attr('id'));
        if ($(this).data('display-error') === "auto") {
          $form.append(div_error_tag);
          div_error_tag.attr('id', error_id);
          pos = $(this).offset();
          left = pos.left + "px";
          top = pos.top + 30 + "px";
          return $form.find("#" + error_id).css({
            width: '120px',
            position: 'absolute',
            top: top,
            left: left
          });
        } else if ($(this).data('display-error') === "bottom") {
          if ($(this).data('single-line') === true) {
            $(this).closest('.controls').append(div_error_tag);
            return $(this).nextAll('.client_side_error');
          } else {
            $(this).closest('.controls').append(div_error_tag);
            return $(this).nextAll('.client_side_error').css({
              width: '250px'
            });
          }
        } else {
          $(this).closest('.controls').append(div_error_tag);
          return $(this).nextAll('.client_side_error').css({
            float: 'right',
            width: '120px'
          });
        }
      }
    });
    $(this).find('input[data-confirmation]').each(function() {
      var confirmation_id, div_error_tag, error_id, password_id;
      password_id = $(this).attr("id");
      confirmation_id = "#" + password_id + "_confirmation";
      if ($(confirmation_id).val() !== $(this).val()) {
        is_error = true;
        div_error_tag = $(custom_field_message(allowed_format["confirmation"]));
        error_id = "" + ($form.attr('id')) + "_error_" + ($(this).attr('id'));
        $form.append(div_error_tag);
        div_error_tag.attr('id', error_id);
        return $(this).closest('.controls').append(div_error_tag);
      }
    });
    if (is_error === true) {
      return false;
    } else {
      return true;
    }
  };
});
