"use strict";
if (!((localStorage.getItem('accType') || sessionStorage.getItem('accType')) && (localStorage.getItem('accType') == 0 || sessionStorage.getItem('accType') == 0))) {
    location.href = './'
}

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#redeem'),
    itemFormGrp;
    //formGrpCount = 1;

/* populate item list and select item options */
var data = new FormData();
data.append('action', 'getRewardItems');

httpPost('./assets/db/db.php', data, function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.items.length > 0) {
        httpGetDoc('./assets/templates/redeem/item_list.html', function(content) {
            var focus = sectionFocus.querySelector('#itemsList #items-table');
            focus.innerHTML = content.querySelector('body').innerHTML;
            focus.querySelector('tbody tr').innerHTML = '';

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
                var row = content.querySelector('tbody tr').cloneNode(true),
                    td = row.querySelectorAll('td');

                td[0].innerHTML = data.items[i]['item'];
                td[1].innerHTML = data.items[i]['ecoPoints'];
                td[2].innerHTML = data.items[i]['quantity'];

                sectionFocus.querySelector('#itemsList #items-table table tbody').appendChild(row);
            });

            var noneOption = doc.createElement('option');
            noneOption.value = 'none';
            noneOption.innerHTML = 'None';
            sectionFocus.querySelector('select#items').appendChild(noneOption);

            /* store item select input for add more items later */
            itemFormGrp = doc.querySelector('form#redeemForm .formGrp').cloneNode(true);
        });
    }
});

/* add more items btn */
sectionFocus.querySelector('button#addItem').onclick = function() {
    var formFocus = sectionFocus.querySelector('form#redeemForm'),
        count = formFocus.querySelectorAll('.formGrp').length,
        hr = doc.createElement('hr');

    hr.className = 'my-4';

    var row = itemFormGrp.cloneNode(true);
    row.appendChild(hr);
    row.querySelector('#item').id = 'item-' + count;
    row.querySelector('select#items').id = 'items-' + count;
    row.querySelector('#qty').id = 'qty-' + count;
    row.querySelector('input#quantity').id = 'quantity-' + count;
    row.querySelector('label[for=quantity]').setAttribute('for', 'quantity-' + count);

    formFocus.insertBefore(row, formFocus.childNodes[count + 1]);
}

/* redeem form */
sectionFocus.querySelector('form#redeemForm').onsubmit = function(e) {
    e.preventDefault();

    var formFocus = this,
        focus = formFocus.querySelectorAll('.form-group, .form-label-group');

    focus.forEach(function(el) {
        el.querySelector('input, select').classList.remove('is-invalid', 'is-valid');
    });

    formFocus.querySelector('button[type=submit]').classList.add('btn-secondary');
    formFocus.querySelector('button[type=submit]').classList.remove('btn-success');
    formFocus.querySelector('button[type=submit] #action-text').classList.add('d-none');
    formFocus.querySelector('button[type=submit] #loading-text').classList.remove('d-none');

    formFocus.querySelector('option.default[value=none]').disabled = false;

    var data = new FormData(formFocus);

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
                }, 4000);
            });

            $(modal).on('hide.bs.modal', function() {
                location.href = './redeem';
            });

            $(modal).modal('show');
        }
        else if (data.errors) {
            var itemFocus = formFocus.querySelectorAll('.form-group.item');
            if(data.errors.items) {
                itemFocus.forEach(function(el) {
                    el.querySelector('select').classList.add('is-invalid');
                    el.querySelector('.feedback').innerHTML = data.errors.items;
                });
            }
            else {
                itemFocus.forEach(function(el) {
                    el.querySelector('select').classList.add('is-valid');
                });
            }

            var qtyFocus = formFocus.querySelectorAll('.form-label-group.qty');
            if (data.errors.quantity) {
                for (var i = 0; i < Object.keys(data.errors.quantity).length; i++) {
                    var index = Object.keys(data.errors.quantity)[i];

                    qtyFocus[index].querySelector('input').classList.add('is-invalid');
                    qtyFocus[index].querySelector('.feedback').innerHTML = data.errors.quantity[index];
                }
            }

            qtyFocus.forEach(function(el) {
                if (!el.querySelector('input').classList.contains('is-invalid')) {
                    el.querySelector('input').classList.add('is-valid');
                }
            });
        }
    });
}
