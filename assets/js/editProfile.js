'user strict';

if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType'))) {
    location.href = './'
}

var $uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    $sectionFocus = $('section#editProfile');

/* get user profile details */
$.ajax({
    type: 'POST',
    url: 'assets/db/db.php',
    data: 'uid=' + $uid + '&action=getUser',
    dataType: 'json'
})
.done(function(data) {
    // console.log(data); // Debugging Purpose
    if (data.success) {
        var $formFocus = $sectionFocus.find('form#editProfileForm');

        $formFocus.find('#name.form-group input').attr('placeholder', data.name);
        $formFocus.find('#email.form-group input').attr('placeholder', data.email);

        if (data.bio != '') {
            $formFocus.find('#bio.form-group textarea').attr('placeholder', data.bio);
        }

        $.get('./assets/img/uploads/' + data.uid + '.png')
            .done(function() {
                $sectionFocus.find('#basicProfile.card .pic').css('background-image', 'url(./assets/img/uploads/' + data.uid + '.png)');
            })
            .fail(function() {
                console.clear();
            });
    }
});

/* edit user details */
$('form#editProfileForm').submit(function(e) {
    e.preventDefault();
    $(this).find('#action-btn button[type=submit]').removeClass('btn-success');
    $(this).find('#action-btn button[type=submit]').addClass('btn-secondary');
    $(this).find('#action-btn button[type=submit]').addClass('fadeIn');
    $(this).find('#action-btn #loading-text').removeClass('d-none');

    var $data;
    if (!$(this).find('#bio input[name=emptyBio]').is(':checked')) {
        $data = $(this).serialize() + '&uid=' + $uid + '&emptyBio=&action=updateUser';
    }
    else {
        $data = $(this).serialize() + '&uid=' + $uid + '&action=updateUser';
    }

    $.ajax({
        type: 'POST',
        url: 'assets/db/db.php',
        data: $data,
        dataType: 'json',
        error: function(data) {
            console.log(data);
        }
    })
    .done(function(data) {
        // console.log(data);  //Debugging Purpose
        $('form#editProfileForm').find('#action-btn button[type=submit]').removeClass('btn-secondary');
        $('form#editProfileForm').find('#action-btn button[type=submit]').addClass('btn-success');
        $('form#editProfileForm').find('#action-btn button[type=submit]').removeClass('fadeIn');
        $('form#editProfileForm').find('#action-btn #loading-text').addClass('d-none');

        if (data.success) {
            var $modal = $('#formFeedbackModal');
            $modal.find('.modal-header h5.modal-title').html('Profile Changes Successful');
            $modal.find('.modal-body').html('You have updated your profile details successfuly.')

            $modal.on('shown.bs.modal', function() {
                $modal.find('button[data-dismiss=modal]').focus();
                setTimeout(function () {
                    $modal.modal('hide');
                }, 2000);
            });

            $modal.on('hide.bs.modal', function() {
                location.href = './profile';
            });

            $modal.modal("show");
        }
        else if (data.errors) {
            var $focus = $('#editProfileForm #bio')
            if (data.errors.bio) {
                $focus.addClass('invalid');
                $focus.find('.feedback').html(data.errors.bio);
            }

            $focus = $('#editProfileForm #email')
            if (data.errors.email) {
                $focus.addClass('invalid');
                $focus.find('.feedback').html(data.errors.email);
            }

            $focus = $('#editProfileForm #password')
            if (data.errors.password) {
                $focus.addClass('invalid');
                $focus.find('.feedback').html(data.errors.password);
            }

            $focus = $('#editProfileForm #cfmPassword')
            if (data.errors.cfmPassword) {
                $focus.addClass('invalid');
                $focus.find('.feedback').html(data.errors.cfmPassword);
            }
        }
    });
});

/* upload picture drag & drop */
var $focus = $('#uploadPhoto #pictureDrop');

$('html').on('dragover', function(e) {
    e.preventDefault();
    $('#uploadPhoto').find('h5#action-text .action').html("Drop");
});

$focus.on('dragenter', function(e) {
    e.preventDefault();
    $('#uploadPhoto').find('h5#action-text .action').html('Drop');
});

$focus.on('dragover', function(e) {
    e.preventDefault();
    $('#uploadPhoto').find('h5#action-text .action').html('Drop');
});

$focus.on('drop', function(e) {
    e.preventDefault();
    $('#uploadPhotoModal #uploadPhoto').find('.feedback').addClass('d-none');
    $('#uploadPhoto').find('h5#action-text').addClass('d-none');
    $('#uploadPhoto').find('h5#loading-text').removeClass('d-none');

    var $file = e.originalEvent.dataTransfer.files[0];
    if (e.originalEvent.dataTransfer.files.length > 1) {
        $('#uploadPhotoModal #uploadPhoto').find('.feedback').html('Only 1 image upload is allowed!');
        $('#uploadPhotoModal #uploadPhoto').find('.feedback').removeClass('d-none');
        $('#uploadPhoto').find('h5#action-text').removeClass('d-none');
        $('#uploadPhoto').find('h5#loading-text').addClass('d-none');
    }
    else if ($file.size > 2097152) {
        $('#uploadPhotoModal #uploadPhoto').find('.feedback').html('Image size cannot exceed 2mb!');
        $('#uploadPhotoModal #uploadPhoto').find('.feedback').removeClass('d-none');
        $('#uploadPhoto').find('h5#action-text').removeClass('d-none');
        $('#uploadPhoto').find('h5#loading-text').addClass('d-none');
    }
    else {
        var $form = new FormData();
        $form.append('action', 'uploadPhoto');
        $form.append('uid', (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')));
        $form.append('file', $file);

        $.ajax({
            type: 'POST',
            url: 'assets/db/db.php',
            data: $form,
            dataType: 'json',
            contentType: false,
            processData: false,
            error: function(data) {
                console.log(data);
            }
        })
        .done(function(data) {
            // console.log(data); // Debugging Purpose
            $('#uploadPhoto').find('h5#action-text').removeClass('d-none');
            $('#uploadPhoto').find('h5#loading-text').addClass('d-none');

            if (data.success) {
                var $modal = $('#formFeedbackModal');

                $modal.find('h5.modal-title').html('Upload Successful');
                $modal.find('.modal-body').html('Your profile picture have been uploaded successfuly.');

                $modal.on('shown.bs.modal', function() {
                    $modal.find('button[data-dismiss=modal]').focus();
                    setTimeout(function () {
                        $modal.modal('hide');
                    }, 2000);
                });

                $modal.on('hide.bs.modal', function() {
                    location.href = './edit_profile';
                });

                $modal.modal("show");
            }
            else if (data.errors) {
                $('#uploadPhoto').find('.feedback').html(data.errors.file);
                $('#uploadPhoto').find('.feedback').removeClass('d-none');
            }
        });
    }
});

/* upload picture on click */
$focus.click(function() {
    $('#uploadPhotoModal #uploadPhoto').find('input[name=upload]').trigger('click');
});

$('#uploadPhotoModal #uploadPhoto').on('change', 'input[name=upload]', function() {
    $('#uploadPhotoModal #uploadPhoto').find('.feedback').addClass('d-none');
    $('#uploadPhoto').find('h5#action-text').addClass('d-none');
    $('#uploadPhoto').find('h5#loading-text').removeClass('d-none');

    var $form = new FormData();
    $form.append('action', 'uploadPhoto');
    $form.append('uid', (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')));
    $form.append('file', $(this)[0].files[0]);

    $.ajax({
        type: 'POST',
        url: 'assets/db/db.php',
        data: $form,
        dataType: 'json',
        contentType: false,
        processData: false,
        error: function(data) {
            console.log(data);
        }
    })
    .done(function(data) {
        // console.log(data);  // Debugging Purpose
        $('#uploadPhoto').find('h5#action-text').removeClass('d-none');
        $('#uploadPhoto').find('h5#loading-text').addClass('d-none');

        if (data.success) {
            var $modal = $('#formFeedbackModal');

            $modal.find('h5.modal-title').html('Upload Successful');
            $modal.find('.modal-body').html('Your profile picture have been uploaded successfuly.');

            $modal.on('shown.bs.modal', function() {
                $modal.find('button[data-dismiss=modal]').focus();
                setTimeout(function () {
                    $modal.modal('hide');
                }, 2500);
            });

            $modal.on('hide.bs.modal', function() {
                location.href = './edit_profile';
            });

            $modal.modal("show");
        }
        else if (data.errors) {
            $('#uploadPhoto').find('.feedback').html(data.errors.file);
            $('#uploadPhoto').find('.feedback').removeClass('d-none');
        }
    });
});

/* profile picture hover */
if ($(window).width() > 767.98) {
    profilePicMouseEnter();
    profilePicMouseLeave();
}

$(window).resize(function() {
    profilePicMouseEnter();
    profilePicMouseLeave();
});

function profilePicMouseEnter() {
    $sectionFocus.on('mouseenter', '#basicProfile .pic', function() {
        var $focus = $(this).find('.small');
        $focus.removeClass('d-md-none d-xl-none d-lg-none');
        $focus.removeClass('flipOutX short');
        $focus.addClass('flipInX short');
    });
}

function profilePicMouseLeave() {
    $sectionFocus.on('mouseleave', '#basicProfile .pic', function() {
        var $focus = $(this).find('.small');
        $focus.addClass('flipOutX short').one(animationEnd, function() {
            $focus.addClass('d-md-none d-xl-none d-lg-none');
            $focus.removeClass('flipInX short');
            $focus.addClass('flipOutX short');
        });
    });
}
