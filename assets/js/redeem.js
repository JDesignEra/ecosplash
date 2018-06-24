if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType') || (localStorage.getItem('accType') != 0 || sessionStorage.getItem('accType') != 0))) {
    location.href = './'
}

var $sectionFocus = $('section#redeem'),
    $itemFormGrp,
    $formGrpCount = 1;

/* populate item list and select item options */
$.ajax({
    type: 'POST',
    url: './assets/db/db.php',
    data: '&action=getRewardItems',
    dataType: 'json'
})
.done(function(data) {
    // console.log(data);  // Debugging Purpose
    if (data.items.length > 0) {
        $.get('./assets/templates/redeem/item_list.html', function(content) {
            $sectionFocus.find('#itemsList #items-table').html(content);
        })
        .done(function() {
            $(data.items).each(function(i) {
                /* populate item select */
                var $option = '<option value="' + data.items[i]['rid'] + '"' + (data.items[i]['quantity'] < 1 ? ' disabled' : '') + '>' +
                data.items[i]['item'] + ' (' + data.items[i]['ecoPoints'] + ' EcoPoints) - ' + data.items[i]['quantity'] + ' stock' +
                '</option>';

                $sectionFocus.find('form#redeemForm select#items').append($option);

                /* populate item lists */
                var $row = '<tr><td class="text-left">' +
                                data.items[i]['item'] +
                            '</td><td class="text-center">' +
                                data.items[i]['ecoPoints'] +
                            '</td><td class="text-right">' +
                                data.items[i]['quantity'] +
                            '</td></tr>';

                $sectionFocus.find('#itemsList #items-table table tbody').append($row);
            });

            $sectionFocus.find('select#items').append('<option value="none">None</option>');

            /* store item inputs for add more items */
            $itemFormGrp = $('form#redeemForm #formGrp').clone();
        });
    }
});

/* add more items btn */
$('section#redeem button#addItem').click(function() {
    var $row = $itemFormGrp.clone();
    $($row).append('<hr class="my-4" />');
    $($row).find('#item').attr('id', 'item-' + $formGrpCount);
    $($row).find('select#items').attr('id', 'items-' + $formGrpCount);
    $($row).find('#qty').attr('id', 'qty-' + $formGrpCount);
    $($row).find('input#quantity').attr('id', 'quantity-' + $formGrpCount);
    $($row).find('label[for=quantity]').attr('for', 'quantity-' + $formGrpCount);
    $formGrpCount++;
    $sectionFocus.find('form#redeemForm').prepend($row);
});

/* redeem form */
$('form#redeemForm').submit(function(e) {
    e.preventDefault();

    $sectionFocus.find('form#redeemForm .feedback').empty();
    $sectionFocus.find('form#redeemForm .feedback').removeClass('d-block');
    $sectionFocus.find('form#redeemForm button[type=submit]').addClass('btn-secondary');
    $sectionFocus.find('form#redeemForm button[type=submit]').removeClass('btn-success');
    $sectionFocus.find('form#redeemForm button[type=submit] #action-text').addClass('d-none');
    $sectionFocus.find('form#redeemForm button[type=submit] #loading-text').removeClass('d-none');

    $('form#redeemForm').find('option.default[value=none]').removeAttr('disabled');
    var $data = $(this).serialize();
    $('form#redeemForm').find('option.default[value=none]').prop('disabled', true);

    $.ajax({
        type: 'POST',
        url: 'assets/db/db.php',
        data: $data + '&uid=' + (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')) + '&action=redeemRewardItems',
        dataType: 'json'
    })
    .done(function(data) {
        // console.log(data);  // Debugging Purpose
        $sectionFocus.find('form#redeemForm button[type=submit]').addClass('btn-success');
        $sectionFocus.find('form#redeemForm button[type=submit]').removeClass('btn-secondary');
        $sectionFocus.find('form#redeemForm button[type=submit] #action-text').removeClass('d-none');
        $sectionFocus.find('form#redeemForm button[type=submit] #loading-text').addClass('d-none');

        if (data.success) {
            var $modal = $('#redeemSuccessModal');
            $modal.find('.modal-body #oid').html(data.oid);
            $modal.find('.modal-body #spendEcoPoints').html(data.totalEcoPoints);

            $modal.on('shown.bs.modal', function() {
                $modal.find('button[data-dismiss=modal]').focus();
                setTimeout(function () {
                    $modal.modal('hide');
                }, 2000);
            });

            $modal.on('hide.bs.modal', function() {
                location.href = './redeem';
            });

            $modal.modal("show");
        }
        else if (data.errors) {
            var $focus = $sectionFocus.find('form#redeemForm');
            if (data.errors.items) {
                $focus.find('.item.form-group .feedback').html(data.errors.items);
                $focus.find('.item.form-group .feedback').addClass('d-block');
            }

            if (data.errors.quantity) {
                console.log('quantity error');
                $.each(data.errors.quantity, function(i) {
                    $('form#redeemForm .qty.form-label-group .feedback').eq(i).html(data.errors.quantity[i]);
                    $('form#redeemForm .qty.form-label-group .feedback').eq(i).addClass('d-block');
                });
            }
        }
    });
});
