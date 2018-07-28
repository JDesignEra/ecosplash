'user strict';
securePage(0, 1);

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#editProfile');

/* get user profile details */
var data = new FormData();
data.append('uid', uid);
data.append('action', 'getUser');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.success) {
        var formFocus = doc.querySelector('form#editProfileForm');
        formFocus.querySelector('#name.form-group input').placeholder = data.name;
        formFocus.querySelector('#email.form-group input').placeholder = data.email;

        if (data.bio) {
            formFocus.querySelector('#bio.form-group textarea').placeholder = data.bio;
        }

        httpGetImage('./assets/img/uploads/' + data.uid + '.png', function(content) {
            sectionFocus.querySelector('#basicProfile.card .pic').style.backgroundImage = 'url("' + content + '")';
        });
    }
});

/* edit user details */
doc.querySelector('form#editProfileForm').onsubmit = function(e) {
    e.preventDefault();

    this.querySelector('#action-btn button[type=submit]').classList.remove('btn-success');
    this.querySelector('#action-btn button[type=submit]').classList.add('btn-secondary');
    this.querySelector('#action-btn button[type=submit]').classList.add('fadeIn');
    this.querySelector('#action-btn #loading-text').classList.remove('d-none');

    var data = new FormData(this);
    data.append('uid', uid);
    data.append('action', 'updateUser');

    if (!this.querySelector('#bio input[name=emptyBio]').checked) {
        data.append('emptyBio', '');
    }

    var formFocus = doc.querySelector('form#editProfileForm');
    httpPost('./assets/db/db.php', data, function(data) {
        // console.log(data);   // Debugging Purpose
        formFocus.querySelector('#action-btn button[type=submit]').classList.remove('btn-secondary', 'fadeIn');
        formFocus.querySelector('#action-btn button[type=submit]').classList.add('btn-success');
        formFocus.querySelector('#action-btn #loading-text').classList.add('d-none');

        if (data.success) {
            if (localStorage.getItem('name')) {
                localStorage.setItem('name', data.name);
                localStorage.setItem('pass', data.password);
            }
            else if (sessionStorage.getItem('name')) {
                localStorage.setItem('name', data.name);
                sessionStorage.setItem('pass', data.password);
            }

            var modal = doc.getElementById('formFeedbackModal');
            modal.querySelector('.modal-header h5.modal-title').innerHTML = 'Profile Changed Successful';
            modal.getElementsByClassName('modal-body')[0].innerHTML = 'You have updated your profile details successfully.';

            $(modal).on('shown.bs.modal', function() {
                setTimeout(function () {
                    $(modal).modal('hide');
                }, 2500);
            });

            $(modal).on('hide.bs.modal', function() {
                location.href = './profile';
            });

            $(modal).modal('show');
        }
        else if (data.errors) {
            var focus = formFocus.querySelector('#bio');
            if (data.errors.bio) {
                focus.addClass('invalid');
                focus.getElementsByClassName('.feedback')[0].innerHTML(data.errors.bio);
            }

            focus = formFocus.querySelector('#email');
            if (data.errors.email) {
                focus.classList.add('invalid');
                focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.email;
            }

            focus = formFocus.querySelector('#password');
            if (data.errors.password) {
                focus.classList.add('invalid');
                focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.password;
            }

            focus = formFocus.querySelector('#cfmPassword');
            if (data.errors.cfmPassword) {
                focus.classList.add('invalid');
                focus.getElementsByClassName('feedback')[0].innerHTML = data.errors.cfmPassword;
            }

        }
    });
}

/* upload picture drag & drop */
var focus = doc.querySelector('#uploadPhoto #pictureDrop');
doc.querySelector('html').ondragover = function(e) {
    e.preventDefault();
    doc.querySelector('#uploadPhoto h5#action-text .action').innerHTML = 'Drop';
}

focus.ondragenter = function(e) {
    e.preventDefault();
    doc.querySelector('#uploadPhoto h5#action-text .action').innerHTML = 'Drop';
}

focus.ondragover = function(e) {
    e.preventDefault();
    doc.querySelector('#uploadPhoto h5#action-text .action').innerHTML = 'Drop';
}

focus.ondrop = function(e) {
    e.preventDefault();

    doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').classList.add('d-none');
    doc.querySelector('#uploadPhoto h5#action-text').classList.add('d-none');
    doc.querySelector('#uploadPhoto h5#loading-text').classList.remove('d-none');

    var file = e.dataTransfer.files[0];
    if (e.dataTransfer.files.length > 1) {
        doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').innerHTML = 'Only 1 image upload is allowed!';
        doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').classList.remove('d-none');
        doc.querySelector('#uploadPhoto h5#action-text').classList.remove('d-none');
        doc.querySelector('#uploadPhoto h5#loading-text').classList.add('d-none');
    }
    else if (file.size > 2097152) {
        doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').innerHTML = 'Image size cannot exceed 2MB!';
        doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').classList.remove('d-none');
        doc.querySelector('#uploadPhoto h5#action-text').classList.remove('d-none');
        doc.querySelector('#uploadPhoto h5#loading-text').classList.add('d-none');
    }
    else {
        var data = new FormData();
        data.append('action', 'uploadPhoto');
        data.append('uid', (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')));
        data.append('file', file);

        httpPost('./assets/db/db.php', data, function(data) {
            // console.log(data);  // Debugging Purpose
            doc.querySelector('#uploadPhoto h5#action-text').classList.remove('d-none');
            doc.querySelector('#uploadPhoto h5#loading-text').classList.add('d-none');

            if (data.success) {
                var modal = doc.getElementById('formFeedbackModal');

                modal.querySelector('h5.modal-title').innerHTML = 'Upload Successful';
                modal.getElementsByClassName('modal-body')[0].innerHTML = 'Your profile picture have been uploaded successfuly.';

                $(modal).on('shown.bs.modal', function(e) {
                    console.log(e);
                    modal.querySelector('.modal-footer button[data-dismiss=modal]').focus();
                    setTimeout(function () {
                        $(modal).modal('hide');
                    }, 2500);
                });

                $(modal).on('hide.bs.modal', function() {
                    location.href = './edit_profile';
                });

                $(modal).modal('show');
            }
            else if (data.errors) {
                doc.querySelector('#uploadPhoto .feedback').innerHTML = data.errors.file;
                doc.querySelector('#uploadPhoto .feedback').classList.remove('d-none');
            }
        });
    }
}

/* upload picture on click */
focus.onclick = function() {
    doc.querySelector('#uploadPhotoModal #uploadPhoto input[name=upload]').click();
}

doc.querySelector('#uploadPhotoModal #uploadPhoto input[name=upload]').onchange = function() {
    doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').classList.add('d-none');
    doc.querySelector('#uploadPhoto h5#action-text').classList.add('d-none');
    doc.querySelector('#uploadPhoto h5#loading-text').classList.add('d-none');

    if (this.files[0].size > 2097152) {
        doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').innerHTML = 'Image size cannot exceed 2MB!';
        doc.querySelector('#uploadPhotoModal #uploadPhoto .feedback').classList.remove('d-none');
        doc.querySelector('#uploadPhoto h5#action-text').classList.remove('d-none');
        doc.querySelector('#uploadPhoto h5#loading-text').classList.add('d-none');
    }
    else {
        var data = new FormData();
        data.append('uid', (uid? uid : ''));
        data.append('file', this.files[0]);
        data.append('action', 'uploadPhoto');

        httpPost('./assets/db/db.php', data, function(data) {
            // console.log(data);  // Debugging Purpose
            doc.querySelector('#uploadPhoto h5#action-text').classList.remove('d-none');
            doc.querySelector('#uploadPhoto h5#loading-text').classList.add('d-none');

            if (data.success) {
                var modal = doc.getElementById('formFeedbackModal');

                modal.querySelector('h5.modal-title').innerHTML = 'Upload Successful';
                modal.getElementsByClassName('modal-body')[0].innerHTML = 'Your profile picture have been uploaded successfuly';

                $(modal).on('shown.bs.modal', function() {
                    modal.querySelector('.modal-footer button[data-dismiss=modal]').focus();
                    setTimeout(function () {
                        $(modal).modal('hide');
                    }, 2500);
                });

                $(modal).on('hide.bs.modal', function() {
                    location.href = './edit_profile';
                });

                $(modal).modal('show');
            }
            else if (data.errors) {
                doc.querySelector('#uploadPhoto .feedback').innerHTML = data.errors.file;
                doc.querySelector('#uploadPhoto .feedback').classList.remove('d-none');
            }
        });
    }
}

/* profile picture hover */
if (window.outerWidth > 767.98) {
    profilePicMouseEnter();
    profilePicMouseLeave();
}

addWindowOnResize(function() {
    if (window.outerWidth > 767.98) {
        profilePicMouseEnter();
        profilePicMouseLeave();
    }
});

function profilePicMouseEnter() {
    sectionFocus.querySelector('#basicProfile .pic').onmouseenter = function() {
        var focus = this.getElementsByClassName('small')[0];
        focus.classList.remove('d-md-none', 'd-xl-none', 'd-lg-none', 'flipOutX', 'short');
        focus.classList.add('flipInX', 'short');
    }
}

function profilePicMouseLeave() {
    sectionFocus.querySelector('#basicProfile .pic').onmouseleave = function() {
        var focus = this.getElementsByClassName('small')[0];
        focus.classList.remove('flipInX', 'short');
        focus.classList.add('flipOutX', 'short');
    }

    focus.addEventListener(animationEnd, function() {
        focus.classList.add('d-md-none', 'd-xl-none', 'd-lg-none');
    });
}
