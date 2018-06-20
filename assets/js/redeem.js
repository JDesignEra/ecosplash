if (!(localStorage.getItem('accType') || sessionStorage.getItem('accType') || (localStorage.getItem('accType') != 0 || sessionStorage.getItem('accType') != 0))) {
    location.href = './'
}

var $sectionFocus = $('section#redeem'),
$itemFormGrp;

/* populate  item list and select item options */
$.ajax({
    type: 'POST',
    url: './assets/db/db.php',
    data: '&action=getRewardItems',
    dataType: 'json'
})
.done(function(data) {
    var $itemRow;
    if (data.items.length > 0) {
        $.get('./assets/templates/redeem/item_list.html', function(content) {
            $itemRow = $(content).find('tbody tr').clone();
            $sectionFocus.find('#itemsList #items-table').html(content);
        });

        $(data.items).each(function(i) {
            /* populate item select */
            var $option = '<option value="' + data.items[i]['rid'] + '"' + (data.items[i]['quantity'] < 1 && data.items[i]['rid'] != 1 ? ' disabled' : '') + '>' +
            data.items[i]['item'] +
            ' (' + data.items[i]['ecoPoints'] + ' EcoPoints)' +
            (data.items[i]['rid'] != 1 ? ' - ' + data.items[i]['quantity'] + ' stock' : '') +
            '</option>';

            $sectionFocus.find('form#redeemForm select#items').append($option);

            /* populate item lists */
            $('td', $itemRow).eq(0).html(data.items[i]['item']);
            $('td', $itemRow).eq(1).html(data.items[i]['ecoPoints']);
            $('td', $itemRow).eq(2).html(data.items[i]['quantity']);
            console.log($sectionFocus.find('table').length);
            $sectionFocus.find('table tbody').append($itemRow);
        });

        $sectionFocus.find('form#redeemForm select#items').append('<option value="none">None</option>');

        /* store item inputs */
        $itemFormGrp = $('form#redeemForm').clone();
        $('button[type=submit]', $itemFormGrp).remove();
    }
});
