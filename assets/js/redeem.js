if (!((localStorage.getItem('accType') || sessionStorage.getItem('accType')) && (localStorage.getItem('accType') == 0 || sessionStorage.getItem('accType') == 0))) {
    location.href = './'
}

var sectionFocus = doc.querySelector('section#redeem'),
    itemFormGrp,
    formGrpCount = 1;

/* populate item list and select item options */
var data = new FormData();
data.append('action', 'getRewardItems');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.items.length > 0) {
        httpGet('./assets/templates/redeem/item_list.html', function(content) {
            sectionFocus.querySelector('#itemsList #items-table').innerHTML = content;

            data.items.forEach(function(a, i) {
                /* populate item select */
                var option = doc.createElement('option');
                option.value = data.items[i]['rid'];
                option.innerHTML = data.items[i]['item'] + ' (' + data.items[i]['ecoPoints'] + ' EcoPoints) - ' + data.items[i]['quantity'] + ' stock';

                if (data.items[i]['quantity'] < 1) {
                    option.disabled = true;
                }

                sectionFocus.querySelector('form#redeemForm select#items').appendChild(option);

                /* populate item lists */
                var row = doc.createElement('tr');
                row.innerHTML = '<td class="text-left">' +
                                    data.items[i]['item'] +
                                '</td><td class="text-center">' +
                                    data.items[i]['ecoPoints'] +
                                '</td><td class="text-right">' +
                                    data.items[i]['quantity'] +
                                '</td>';

                sectionFocus.querySelector('#itemsList #items-table table tbody').appendChild(row);
            });

            var noneOption = doc.createElement('option');
            noneOption.value = 'none';
            noneOption.innerHTML = 'None';
            sectionFocus.querySelector('select#items').appendChild(noneOption);

            /* store item select input for add more items later */
            itemFormGrp = doc.querySelector('form#redeemForm #formGrp').cloneNode(true);
        });
    }
});

/* add more items btn */
sectionFocus.querySelector('button#addItem').onclick = function() {
    var hr = doc.createElement('hr');
    hr.className = 'my-4';

    var row = itemFormGrp.cloneNode(true);
    row.appendChild(hr);
    row.querySelector('#item').id = 'item-' + formGrpCount;
    row.querySelector('select#items').id = 'items-' + formGrpCount;
    row.querySelector('#qty').id = 'qty-' + formGrpCount;
    row.querySelector('input#quantity').id = 'quantity-' + formGrpCount;
    row.querySelector('label[for=quantity]').setAttribute('for', 'quantity-' + formGrpCount);
    formGrpCount++;

    var formFocus = sectionFocus.querySelector('form#redeemForm')
    formFocus.insertBefore(row, formFocus.childNodes[0]);
}

/* redeem form */
sectionFocus.querySelector('form#redeemForm').onsubmit = function(e) {
    e.preventDefault();

    var formFocus = this;

    var feedbacks = formFocus.querySelectorAll('.feedback');
    feedbacks.forEach(function(el) {
        el.innerHTML = '';
        el.classList.remove('d-block');
        el.parentElement.classList.remove('invalid', 'valid');
    });

    formFocus.querySelector('button[type=submit]').classList.add('btn-secondary');
    formFocus.querySelector('button[type=submit]').classList.remove('btn-success');
    formFocus.querySelector('button[type=submit] #action-text').classList.add('d-none');
    formFocus.querySelector('button[type=submit] #loading-text').classList.remove('d-none');

    formFocus.querySelector('option.default[value=none]').disabled = false;

    var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    data = new FormData(formFocus);

    formFocus.querySelector('option.default[value=none]').disabled = true;
    data.append('uid', uid);
    data.append('action', 'redeemRewardItems');

    httpPost('assets/db/db.php', data, function(data) {
        // console.log(data);  // Debugging Purpose
        formFocus.querySelector('button[type=submit]').classList.add('btn-success');
        formFocus.querySelector('button[type=submit]').classList.remove('btn-secondary');

        formFocus.querySelector('button[type=submit] #action-text').classList.remove('d-none');
        formFocus.querySelector('button[type=submit] #loading-text').classList.add('d-none');

        if (data.success) {
            var modal = doc.getElementById('redeemSuccessModal');
            modal.querySelector('.modal-header #oid').innerHTML = data.oid;
            modal.querySelector('.modal-body #spendEcoPoints').innerHTML = data.totalEcoPoints;

            $(modal).on('shown.bs.modal', function() {
                modal.querySelector('.modal-footer button[data-dismiss=modal]').focus();

                setTimeout(function () {
                    $(modal).modal('hide');
                }, 2500);
            });

            $(modal).on('hide.bs.modal', function() {
                location.href = './redeem';
            });

            $(modal).modal('show');
        }
        else if (data.errors) {
            var feedbackFocus = formFocus.querySelectorAll('.item.form-group .feedback');
            if(data.errors.items) {
                feedbackFocus.forEach(function(el) {
                    el.innerHTML = data.errors.items;
                    el.parentElement.classList.add('invalid')
                    el.classList.add('d-block');
                });
            }
            else {
                feedbackFocus.forEach(function(el) {
                    el.parentElement.classList.add('valid')
                });
            }

            var feedbackFocus = formFocus.querySelectorAll('.qty.form-label-group .feedback');
            if (data.errors.quantity) {
                for (var i = 0; i < Object.keys(data.errors.quantity).length; i++) {
                    var index = Object.keys(data.errors.quantity)[i];

                    feedbackFocus[index].parentElement.classList.add('invalid');
                    feedbackFocus[index].innerHTML = data.errors.quantity[index];
                    feedbackFocus[index].classList.add('d-block');
                }
            }

            feedbackFocus.forEach(function(el) {
                if (!el.parentElement.classList.contains('invalid')) {
                    el.parentElement.classList.add('valid');
                }
            });
        }
    });
}
