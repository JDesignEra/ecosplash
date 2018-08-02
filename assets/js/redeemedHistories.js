"user strict";
securePage(0);

var uid = (localStorage.getItem('uid') ? localStorage.getItem('uid') : sessionStorage.getItem('uid')),
    sectionFocus = doc.querySelector('section#redeemedHistories');

/* get user redeemed history */
var data = new FormData();
data.append('uid', uid);
data.append('action', 'getRedeemHistories');

httpPost('./assets/db/db.php', data, function(data) {
    if (data.success) {
        // console.log(data); // Debugging Purpose
        httpGetDoc('./assets/templates/redeemed_histories/redeem_histories.html', function(content) {
            var focus = sectionFocus.querySelector('#redeem-history-table');
            focus.innerHTML = content.querySelector('body').innerHTML;
            focus.querySelector('tbody').innerHTML = '';

            for (var i = 0; i < data.redeem_histories.length; i++) {
                var row = content.querySelector('tbody tr').cloneNode(true);
                row.id = data.redeem_histories[i]['oid'];

                var td = row.querySelectorAll('td');
                td[0].innerHTML = data.redeem_histories[i]['oid'];
                td[1].innerHTML = data.redeem_histories[i]['date'];
                td[2].innerHTML = data.redeem_histories[i]['totalQty'];
                td[3].innerHTML = data.redeem_histories[i]['totalEcoPoints'];

                // view more button
                var btnFocus = row.querySelector('button');
                btnFocus.setAttribute('data-id', data.redeem_histories[i]['oid']);

                btnFocus.onclick = function() {
                    var oid = this.getAttribute('data-id'),
                        data = new FormData();

                    data.append('uid', uid);
                    data.append('oid', oid);
                    data.append('action', 'getRedeemHistory');

                    httpPost('./assets/db/db.php', data, function(data) {
                        // console.log(data);  // Debugging Purpose
                        if (data.success) {
                            httpGetDoc('./assets/templates/redeemed_histories/redeem_history.html', function(content) {
                                var modal = doc.getElementById('view-more-modal');
                                modal.querySelector('.modal-body').innerHTML = content.querySelector('body').innerHTML;
                                modal.querySelector('.modal-header .modal-title').innerHTML = '#' + data.oid + ' on ' + data.date;
                                modal.querySelector('.modal-body table tbody').innerHTML = '';
                                modal.querySelector('.modal-body h6 #total').innerHTML = data.totalEcoPoints;

                                data.items.forEach(function(k, i) {
                                    var row = content.querySelector('tbody tr').cloneNode(true);

                                    var td = row.querySelectorAll('td');
                                    td[0].innerHTML = k;
                                    td[1].innerHTML = data.itemsQty[i];
                                    td[2].innerHTML = data.itemsEcoPoints[i];

                                    modal.querySelector('table tbody').appendChild(row);
                                });
                            });

                            $('[tooltip-toggle=tooltip]').tooltip('hide');
                            $('#view-more-modal').modal('show');
                        }
                    });
                }

                focus.querySelector('tbody').appendChild(row);
            }

            enableTooltip();
        });
    }
});
