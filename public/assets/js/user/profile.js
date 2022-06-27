(function ($) {
    let user;
    getUserData();

    const submitBtn = document.getElementById('ajax-submit-btn');
    let fname_valid, l_name_valid, phoneNo_valid

    $('#user-details-edit-btn').on("click", function () {
        $('.user-details-undo-btn').css('display', 'block');
        $('.user-details-edit-btn').css('display', 'none');
        $('.user-data-display').css('display', 'none');
        $('.user-AJAX-form').css('display', 'block');
        $('#user-fname-input').val(user.firstName);
        $('#user-lname-input').val(user.lastName);
        var $radios = $('input:radio[name=gender]');
        if ($radios.is(':checked') === false) {
            $radios.filter(`[value=${user.gender}]`).prop('checked', true);
        }
        let userdob = new Date(user.dateOfBirth);

        $('#user-dob-input').val(ISODateString(userdob));
        $('#user-phone-input').val(user.phoneNo);

        [fname_valid, l_name_valid, phoneNo_valid] = [true, true, true, true];
        updateButton();

        $('#user-fname-input').on("input", function () {
            const fname_input = $('#user-fname-input').val();
            if (!fname_input.length || !/^[a-zA-Z]+$/.test(fname_input)) {
                $('#user-fname-input').css("border", "2px dashed red");
                $('.fname-error').css("display", "block");
                fname_valid = false;
                updateButton();
            }
            else {
                $('#user-fname-input').css("border", "2px solid black");
                $('.fname-error').css("display", "none");
                fname_valid = true;
                updateButton();
            }
        })

        $('#user-lname-input').on("input", function () {
            const lname_input = $('#user-lname-input').val();
            if (!lname_input.length || !/^[a-zA-Z]+$/.test(lname_input)) {
                $('#user-lname-input').css("border", "2px dashed red");
                $('.lname-error').css("display", "block");
                l_name_valid = false;
                updateButton();
            }
            else {
                $('#user-lname-input').css("border", "1px solid black");
                $('.lname-error').css("display", "none");
                l_name_valid = true;
                updateButton();
            }
        })

        $('#user-phone-input').on("input", function () {

            const phone_input = $('#user-phone-input').val();

            if (phone_input.match(/\d/g).length !== 10) {
                $('#user-phone-input').css("border", "2px dashed red");
                $('.phoneNo-error').css("display", "block");
                phoneNo_valid = false;
                updateButton();
            }
            else {
                $('#user-phone-input').css("border", "1px solid black");
                $('.phoneNo-error').css("display", "none");
                phoneNo_valid = true;
                updateButton();
            }
        })


    })

    $('#user-details-undo-btn').on("click", function () {
        $('.user-details-undo-btn').css('display', 'none');
        $('.user-details-edit-btn').css('display', 'block');
        $('.user-data-display').css('display', 'block');
        $('.user-AJAX-form').css('display', 'none');
        $('#user-fname-input').css("border", "1px solid black");
        $('#user-lname-input').css("border", "1px solid black");
        $('#user-phone-input').css("border", "1px solid black");
        $('.invalid-error').css('display', 'none')
    })

    $('#ajax-form').submit(function () {
        event.preventDefault();
        $('.user-AJAX-form').css('display', 'none');
        $('.user-data-display').css('display', 'block');
        $('.user-details-undo-btn').css('display', 'none');
        $('.user-details-edit-btn').css('display', 'block');

        var requestConfig = {
            method: 'POST',
            url: `/users/update/${user.userId}`,
            dataType: 'json', // data type
            data: $("#ajax-form").serialize(), // post data || get data
        };
        $.ajax(requestConfig).then(function (responseMessage) {

        });
        getUserData();
    })

    function getUserData() {
        var requestConfig = {
            method: 'POST',
            url: '/users/userdata'
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            var userdata = $(responseMessage);
            user = userdata[0]
            $('#greetUser').html(`Hi ${user.firstName} !`);
            $('#user-fname').html(user.firstName);
            $('#user-lname').html(user.lastName);
            $('#user-gender').html(user.gender.charAt(0).toUpperCase() + user.gender.slice(1));
            const dob = new Date(user.dateOfBirth);
            $('#user-dob').html(dob.toLocaleString("en-US", {timeZone: "GMT"}).substring(0,10));
            console.log(user);
            $('#user-phone').html(formatPhoneNumber(user.phoneNo));
            $('#user-email').html(user.email)
        });
    }

    function updateButton() {
        if (fname_valid && l_name_valid && phoneNo_valid) submitBtn.disabled = false; else submitBtn.disabled = submitBtn.disabled = true;
    }


    function ISODateString(d) {
        function pad(n) {
            return n < 10 ? '0' + n : n
        }

        return d.getUTCFullYear() + '-'
            + pad(d.getUTCMonth() + 1) + '-'
            + pad(d.getUTCDate())
    }
    function formatPhoneNumber(phoneNumberString) {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return null;
    }

})(window.jQuery);
