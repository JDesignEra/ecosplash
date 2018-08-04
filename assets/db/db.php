<?php
header('Content-Type: application/json');

require_once "dbconfig.php";

$mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
$action = checkInput($_POST['action']);

switch ($action) {
    case 'login':
        $email = checkInput($_POST['email']);
        $password = checkInput($_POST['password']);
        $remember = checkInput($_POST["remember"]);

        if (empty($email)) {
            $errors['email'] = 'Email is required!';
        }
        else {
            $result = $mysqli -> query("SELECT uid, name, ecoPoints, newNotifications, type, password FROM users WHERE email = '$email'");
            if ($result -> num_rows == 0) {
                $errors['email'] = $email.' does not exists!';
            }
        }

        if (empty($password)) {
            $errors['password'] = 'Password is required!';
        }

        if (empty($errors)) {
            $result = $result -> fetch_array(MYSQLI_ASSOC);
            if (password_verify($password, $result['password'])) {
                $data = $result;

                if (!empty($remember)) {
                    $data['remember'] = true;
                }
            }
            else {
                $errors['password'] = 'Wrong password!';
            }
        }
        break;

    case 'checkUser':
        $uid = checkInput($_POST['uid']);
        $password = checkInput($_POST['pass']);

        if (empty($password)) {
            $errors['pass'] = 'Pass is missing!';
        }

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }
        else {
            $result = $mysqli -> query("SELECT uid, password FROM users WHERE uid = '$uid'");
            if ($result -> num_rows < 1 && $result -> num_rows > 1) {
                $errors['uid'] = 'User ID does not exist!';
            }
        }

        if (empty($errors)) {
            $result = $result -> fetch_array(MYSQLI_ASSOC);
            if ($password !== $result['password']) {
                $errors['check'] = false;
            }
        }
        break;

    case 'uSignupForm':
    case 'oSignupForm':
        $name = checkInput($_POST['name']);
        $email = checkInput($_POST['email']);
        $password = checkInput($_POST['password']);
        $name = ucwords($name);

        if (empty($name)) {
            if ($action == 'uSignupForm') {
                $errors['name'] = 'Name is required!';
            }
            else {
                $errors['name'] = 'Organization name is required!';
            }
        }

        if (empty($email)) {
            $errors['email'] = 'Email is required!';
        }
        else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email format is invalid!';
        }
        else {
            $result = $mysqli -> query("SELECT * FROM users WHERE email = '$email'");
            if ($result -> num_rows == 1) {
                $errors['email'] = $email.' is already registered!';
            }
        }

        if (empty($password)) {
            $errors["password"] = 'Password is required!';
        }
        elseif (strlen($password) < 6) {
            $errors["password"] = 'Password has to be more then 5 characters!';
        }

        if (empty($errors)) {
            $mailPass = $password;
			$password = password_hash($password, PASSWORD_BCRYPT);

            if ($action == 'uSignupForm') {
                $mysqli -> query("INSERT INTO users (name, email, password, type) VALUES ('$name', '$email', '$password', 0)");
            }
            elseif ($action == 'oSignupForm') {
                $mysqli -> query("INSERT INTO users (name, email, password, type) VALUES ('$name', '$email', '$password', 1)");
            }

            sendMail('[EcoSplash] Sign Up Successful', '../templates/email/signup.php?name='.$name.'&email='.$email.'&password='.$mailPass, $email);
        }
        break;

    case 'getUser':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT uid, name, email, bio, ecoPoints, dailyQuiz, dailyTask, newNotifications FROM users WHERE uid = '$uid'");
            if ($result -> num_rows == 1) {
                $data = $result -> fetch_array(MYSQLI_ASSOC);
            }
            else {
                $errors['uid'] = 'Multiple UID!';
            }
        }
        break;

    case 'fpass_1':
        $email = checkInput($_POST['email']);

        if (empty($email)) {
            $errors['email'] = 'Email is required!';
        }
        elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email format is invalid!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT email FROM users WHERE email  = '$email'");
            if ($result -> num_rows == 1) {
                $fcode = randAlphaNumeric(8);
                $mysqli -> query("UPDATE users SET fpCode = '$fcode' WHERE email = '$email'");

                sendMail('[EcoSplash] Forgot Password Code', '../templates/email/forgot_password.php?fcode='.$fcode, $email);
            }
            else {
                $errors['email'] = $email.' is not a registered user with us.';
            }
        }
        break;

    case 'fpass_2':
        $email = checkInput($_POST['email']);
        $fcode = checkInput($_POST['fcode']);

        if (empty($email)) {
            $errors['email'] = 'Email is missing!';
        }

        if (empty($fcode)) {
            $errors['fcode'] = 'Generated code is required!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT fpCode FROM users WHERE email = '$email'");
            if ($result -> num_rows == 0) {
                $errors['email'] = $email.' is not a registered user with us.';
            }
            else {
                $result = $result -> fetch_array(MYSQLI_ASSOC);
                if ($fcode != $result['fpCode']) {
                    $errors['fcode'] = 'Generated code is invalid!';
                }
            }
        }
        break;

    case 'fpass_3':
        $email = checkInput($_POST['email']);
        $fcode = checkInput($_POST['fcode']);
        $password = checkInput($_POST['password']);
        $cfmPassword = checkInput($_POST['cfmPassword']);

        if (empty($email)) {
            $errors['email'] = 'Email and Code is missing!';
        }

        if (empty($fcode)) {
            $errors['fcode'] = 'Generated code is missing!';
        }

        if (empty($password)) {
            $errors['password'] = 'New password is required!';
        }
        else if (strlen($password) < 6) {
            $errors['password'] = 'New password needs 6 characters or more!';
        }

        if (empty($cfmPassword)) {
            $errors['cfmPassword'] = 'Confirm password is required!';
        }

        if (empty($errors)) {
            if ($password != $cfmPassword) {
                $errors['password'] = 'New password doesn\'t match with confirm password!';
                $errors['cfmPassword'] = 'Confirm password doesn\'t match with new password!';
            }
            else {
                $result = $mysqli -> query("SELECT fpCode FROM users WHERE email = '$email'");
                if ($result -> num_rows == 0) {
                    $errors['email'] = $email.' is not a registered user with us.';
                }
                else {
                    $result = $result -> fetch_array(MYSQLI_ASSOC);
                    if ($fcode != $result['fpCode']) {
                        $errors['fcode'] = 'Generated code is invalid!';
                    }
                    else {
                        $mailPass = $password;
                        $password = password_hash($password, PASSWORD_BCRYPT);
                        $mysqli -> query("UPDATE users SET password = '$password', fpCode = NULL WHERE email = '$email'");

                        sendMail('[EcoSplash] Password Changed Successful', '../templates/email/forgot_password_success.php?email='.$email.'&password='.$mailPass, $email);
                    }
                }
            }
        }
        break;

    case 'updateUser':
        $uid = checkInput($_POST['uid']);
        $name = checkInput($_POST['name']);
        $bio = checkInput($_POST['bio']);
        $emptyBio = checkInput($_POST['emptyBio']);
        $email = checkInput($_POST['email']);
        $password = checkInput($_POST['password']);
        $cfmPassword = checkInput($_POST['cfmPassword']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing';
        }

        if (!(empty($bio) && empty($emptyBio)) && strlen($bio) > 300) {
            $errors['bio'] = 'Bio cannot exceed 300 characters!';
        }

        if (!empty($email)) {
            $result = $mysqli -> query("SELECT email FROM users WHERE email ='$email'");
            if ($result -> num_rows != 0) {
                $result = $result -> fetch_array(MYSQLI_ASSOC);
                $errors['email'] = $result['email'].' already has an account with us!';
            }
            elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Email format is invalid!';
            }
        }

        if (!empty($password)) {
            if (strlen($password) < 6) {
                $errors['password'] = 'Password needs 6 characters or more!';
            }

            if (empty($cfmPassword)) {
                $errors['cfmPassword'] = 'Confirm password is required!';
            }
            elseif ($password != $cfmPassword) {
                $errors['password'] = 'New password doesn\'t match with confirm password!';
                $errors['cfmPassword'] = 'Confirm password doesn\'t match with new password!';
            }
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT email, name, bio, password FROM users WHERE uid = '$uid'");

            if ($result -> num_rows == 0) {
                $errors['uid'] = "User not found!";
            }
            else {
                $result = $result -> fetch_array(MYSQLI_ASSOC);
                $oEmail = $result['email'];

                $name = ucwords($name);
                if (empty($name)) {
                    $name = $result['name'];
                }

                if (!empty($emptyBio)) {
                    $bio = '';
                }
                else if (empty($bio)) {
                    $bio = $result['bio'];
                }

                if (empty($email)) {
                    $email = $oEmail;
                }

                if (empty($password)) {
                    $mailPass = '';
                    $password = $result['password'];
                }
                else {
                    $mailPass = $password;
                    $password = password_hash($password, PASSWORD_BCRYPT);
                }

                if ($email != $oEmail || (!empty($mailPass) && !password_verify($mailPass, $result['password']))) {
                    if ($email == $oEmail) {
                        sendMail('[EcoSplash] Login Details Changed Successful', '../templates/email/login_details_success.php?email='.$email.'&password='.$mailPass, $email);
                    }
                    else {
                        sendMail('[EcoSplash] Login Details Changed Successful', '../templates/email/login_details_success.php?email='.$email.'&password='.$mailPass, $email, $oEmail);
                    }
                }

                $mysqli -> query("UPDATE users set name = '$name', bio = '$bio', email = '$email', password = '$password' WHERE uid = '$uid'");

                $result = $mysqli -> query("SELECT name, password FROM users WHERE uid = $uid");
                $result = $result -> fetch_array(MYSQLI_ASSOC);

                $data['pass'] = $result['password'];
                $data['name'] = $result['name'];
            }
        }
        break;

    case 'uploadPhoto':
        $uid = checkInput($_POST['uid']);
        $file = (isset($_FILES['file']) ? $_FILES['file'] : '');

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($file)) {
            $errors['file'] = 'No file uploaded!';
        }

        if (empty($errors)) {
            $exif = exif_imagetype($file['tmp_name']);
            if ($exif != IMAGETYPE_JPEG && $exif != IMAGETYPE_PNG) {
                $errors['file']  = 'Image file type allowed are .jpg, .jpeg, .png!';
            }
            elseif ($file['size'] > 2097152) {
                $errors['file'] = 'Image file size cannot exceed 2mb!';
            }

            if (empty($errors)) {
                $result = $mysqli -> query("SELECT uid FROM users WHERE uid = '$uid'");
                if ($result -> num_rows == 1) {
                    $target = $_SERVER['DOCUMENT_ROOT'].'assets/img/uploads/'.$uid.'.png';
                    if (exif_imagetype($file['tmp_name']) != IMAGETYPE_PNG) {
                        if (!imagepng(imagecreatefromstring(file_get_contents($file['tmp_name'])), $target)) {
                            $errors['file'] = 'Image upload fail, please refresh the page and try again.';
                        }
                    }
                    else {
                        if (!move_uploaded_file($file['tmp_name'], $target)) {
                            $errors['file'] = 'Image upload fail, please refresh the page and try again.';
                        }
                    }
                }
                else {
                    $errors['uid'] = 'User ID does not exist or has more then one!';
                }
            }
        }
        break;

    case 'getTodayTask':
        $result = $mysqli -> query("SELECT task FROM today_task");

        $data['tasks'] = [];
        foreach ($result as $result) {
            array_push($data['tasks'], $result['task']);
        }
        break;

    case 'updateUserTask':
            $uid = checkInput($_POST['uid']);

            if (empty($uid)) {
                $data['uid'] = 'User ID is missing!';
            }

            if (empty($errors)) {
                $result = $mysqli -> query("SELECT dailyTask, ecoPoints FROM users WHERE uid = '$uid'");
                if ($result -> num_rows == 1) {
                    $result = $result -> fetch_array(MYSQLI_ASSOC);
                    $arrTask = str_split($result['dailyTask']);
                    $addPoints = 0;
                    $todayTask = '';

                    for ($i = 0; $i < count($arrTask); $i++) {
                        if (isset($_POST[$i])) {
                            $todayTask .= '1';
                            $addPoints++;
                        }
                        else {
                            $todayTask .= $arrTask[$i];
                        }
                    }

                    $data['addEcoPoints'] = $addPoints;
                    $mysqli -> query("UPDATE users SET dailyTask = '$todayTask', ecoPoints = ecoPoints + '$addPoints', ecoPointsMonth = ecoPointsMonth + '$addPoints' WHERE uid = '$uid'");
                }
            }
        break;

    case 'getRedeemHistories':
    case 'getRecentRedeemHistories':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT oid, date, itemsQty, totalEcoPoints FROM redeemed_history WHERE uid = '$uid' ORDER BY date DESC" . ($action == 'getRecentRedeemHistories' ? " LIMIT 10" : ""));
            if ($result -> num_rows > 0) {
                $redeemHistories = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $i = $i = count($redeemHistories);

                    $quantities = explode(',', $row['itemsQty']);
                    $totalQty = 0;
                    foreach ($quantities as $key => $value) {
                        $totalQty += $value;
                    }

                    $redeemHistories[$i]['oid'] = $row['oid'];
                    $redeemHistories[$i]['date'] = date_format(date_create($row['date']), 'd/m/Y');
                    $redeemHistories[$i]['totalQty'] = $totalQty;
                    $redeemHistories[$i]['totalEcoPoints'] = $row['totalEcoPoints'];
                }

                $data['redeem_histories'] = $redeemHistories;
            }
            else {
                $errors['redeem_histories'] = 'No redeemed history!';
            }
        }
        break;

    case 'getRedeemHistory':
        $uid = checkInput($_POST['uid']);
        $oid = checkInput($_POST['oid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($oid)) {
            $errors['oid'] = 'Redeem history ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT * FROM redeemed_history WHERE uid = '$uid' AND oid = '$oid'");
            if ($result -> num_rows == 1) {
                $result = $result -> fetch_array(MYSQLI_ASSOC);

                $items = explode(',', $result['items']);
                $itemsQty = explode(',', $result['itemsQty']);
                $itemsEcoPoints = explode(',', $result['itemsEcoPoints']);

                $data['oid'] = $result['oid'];
                $data['date'] = date_format(date_create($result['date']), 'd/m/Y');
                $data['items'] = $items;
                $data['itemsQty'] = $itemsQty;
                $data['itemsEcoPoints'] = $itemsEcoPoints;
                $data['totalEcoPoints'] = $result['totalEcoPoints'];
            }
            else {
                $errors['oid'] = 'Redeem history ID does not exist or has more then one!';
            }
        }
        break;

    case 'addEvent':
        $uid = checkInput($_POST['uid']);
        $event = checkInput($_POST['event']);
        $location = checkInput($_POST['location']);
        $postal = checkInput($_POST['postal']);
        $date = checkInput($_POST['date']);
        $time = checkInput($_POST['time']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($event)) {
            $errors['event'] = 'Event name is required!';
        }

        if (empty($location)) {
            $errors['location'] = 'Location is required!';
        }

        if (empty($postal)) {
            $errors['postal'] = 'Postal is required!';
        }
        elseif (strlen($postal) != 6) {
            $errors['postal'] = 'Postal has to be 6 numbers!';
        }

        if (empty($date)) {
            $errors['date'] = 'Date is required!';
        }

        if (empty($time)) {
            $errors['time'] = 'Time is required!';
        }

        if (empty($errors)) {
            $redeemCode = randAlphaNumeric(4);

            $result = $mysqli -> query("SELECT redeemCode FROM events WHERE redeemCode = '$redeemCode'");
            while ($result -> num_rows > 0) {
                $redeemCode = randAlphaNumeric(4);
            }

            $dateTime = date_format(date_create($date.' '.$time), 'Y-m-d H:i:00');
            $mysqli -> query("INSERT INTO events (uid, dateTime, event, location, postal, redeemCode) VALUES ('$uid', '$dateTime', '$event', '$location', '$postal', '$redeemCode')");

            if ($result = $mysqli -> query("SELECT eid FROM events WHERE uid = '$uid' ORDER BY eid DESC LIMIT 1")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $eid = $row['eid'];

                $mysqli -> query("INSERT INTO events_attendance (eid) VALUES ('$eid')");
            }
        }
        break;

    case 'getEventHistory':
        $uid = checkInput($_POST['uid']);
        $eid = checkInput($_POST['eid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($eid)) {
            $errors['eid'] = 'Event history ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT * FROM event_history WHERE uid = '$uid' AND eid = '$eid'");
            if ($result -> num_rows == 1) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $data['eid'] = $row['eid'];
                $data['event'] = $row['event'];
                $data['joinDate'] = date_format(date_create($row['dateTime']), 'd/m/Y');
                $data['location'] = $row['location'];
                $data['postal'] = $row['postal'];
                $data['ecoPoints'] = $row['ecoPoints'];
                $data['status'] = ($row['status'] == 1 ? 'Present' : 'Absent');

                if ($result = $mysqli -> query("SELECT dateTime FROM events WHERE eid = '$eid'")) {
                    $row = $result -> fetch_array(MYSQLI_ASSOC);

                    $data['date'] = date_format(date_create($row['dateTime']), 'd/m/Y');
                    $data['time'] = date_format(date_create($row['dateTime']), 'h:i a');
                }
            }
            else {
                $errors['eid'] = 'Event history ID does not exist or has more then one!';
            }
        }
        break;

        case 'getEventHistories':
        case 'getRecentEventHistories':
            $uid = checkInput($_POST['uid']);

            if (empty($uid)) {
                $errors['uid'] = 'User ID is missing!';
            }

            if (empty($errors)) {
                $result = $mysqli -> query("SELECT eid, dateTime, event, status FROM event_history WHERE uid = '$uid' ORDER BY eid DESC");

                if ($result -> num_rows > 0) {
                    $eventHistories = [];
                    while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                        $i = count($eventHistories);

                        $eventHistories[$i]['eid'] = $row['eid'];
                        $eventHistories[$i]['date'] = date_format(date_create($row['dateTime']), 'd/m/Y');
                        $eventHistories[$i]['event'] = $row['event'];
                        $eventHistories[$i]['status'] = ($row['status'] == 1 ? 'Present' : 'Absent');

                        if ($action == 'getRecentEventHistories' && $i == 9) {
                            break;
                        }
                    }

                    $data['event_histories'] = $eventHistories;
                }
                else {
                    $errors['event_histories'] = 'No events history!';
                }
            }
            break;

    case 'getRecentEventsList':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT eid, dateTime, event, location, redeemCode FROM events WHERE uid = '$uid' ORDER BY eid DESC LIMIT 10");

            if ($result -> num_rows > 0) {
                $eventsList = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $i = count($eventsList);
                    $eventsList[$i]['eid'] = $row['eid'];
                    $eventsList[$i]['date'] = date_format(date_create($row['dateTime']), 'd/m/Y');
                    $eventsList[$i]['time'] = date_format(date_create($row['dateTime']), 'h:i a');
                    $eventsList[$i]['event'] = $row['event'];
                    $eventsList[$i]['location'] = $row['location'];
                    $eventsList[$i]['redeemCode'] = $row['redeemCode'];
                }

                $data['eventsList'] = $eventsList;
            }
            else {
                $errors['eventsList'] = 'No events to list!';
            }
        }
        break;

    case 'getEventsList':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT eid, dateTime, event, location, postal, redeemCode FROM events WHERE uid = '$uid' ORDER BY eid DESC");
            if ($result -> num_rows > 0) {
                $eventsList = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $date = date_format(date_create($row['dateTime']), 'd/m/Y');
                    $i = (array_key_exists($date, $eventsList) ? count($eventsList[$date]) : 0);

                    $eventsList[$date][$i]['eid'] = $row['eid'];
                    $eventsList[$date][$i]['time'] = date_format(date_create($row['dateTime']), 'h:i a');
                    $eventsList[$date][$i]['event'] = $row['event'];
                    $eventsList[$date][$i]['location'] = $row['location'];
                    $eventsList[$date][$i]['postal'] = $row['postal'];
                    $eventsList[$date][$i]['redeemCode'] = $row['redeemCode'];
                }

                $data['eventsList'] = $eventsList;
            }
            else {
                $errors['eventsList'] = 'No events to list!';
            }
        }
        break;

    case 'getUpcomingEvents':
        $uid = checkInput($_POST['uid']);
        $states = [];
    case 'getRecentEvents':
        $result = $mysqli -> query("SELECT * FROM events WHERE dateTime > CURDATE() ORDER BY dateTime ASC");

        if ($result -> num_rows > 0) {
            $events = [];
            $i = 0;
            while (($row = $result -> fetch_array(MYSQLI_ASSOC))) {
                $date = date_format(date_create($row['dateTime']), 'd/m/Y');
                $index = (array_key_exists($date, $events) ? count($events[$date]) : 0);

                $eid = $row['eid'];
                $events[$date][$index]['eid'] = $eid;
                $events[$date][$index]['time'] = date_format(date_create($row['dateTime']), 'h:i a');
                $events[$date][$index]['event'] = $row['event'];
                $events[$date][$index]['location'] = $row['location'];
                $events[$date][$index]['postal'] = $row['postal'];
                $events[$date][$index]['ecoPoints'] = $row['ecoPoints'];

                if ($action == 'getUpcomingEvents') {
                    if ($sql = $mysqli -> query("SELECT uids FROM events_attendance WHERE eid = '$eid'")) {
                        $sqlRow = $sql -> fetch_array(MYSQLI_ASSOC);

                        $uids = explode(',', $sqlRow['uids']);
                        $states[$eid] = (array_search($uid, $uids) === false ? 0 : 1);
                    }
                }

                if ($index == 0) {
                    $i++;
                }

                if ($action == 'getRecentEvents' && $i == '9') {
                    break;
                }
            }

            $data['events'] = $events;

            if ($action == 'getUpcomingEvents' && !empty($states)) {
                $data['states'] = $states;
            }
        }
        else {
            $errors['events'] = 'No events to list!';
        }
        break;

    case 'getEventCode':
        $uid = checkInput($_POST['uid']);
        $eid = checkInput($_POST['eid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!!';
        }

        if (empty($eid)) {
            $errors['eid'] = 'Event ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT eid, redeemCode FROM events WHERE uid = '$uid' AND eid = '$eid'");

            $data['eventCode'] = $result -> fetch_array(MYSQLI_ASSOC);
        }
        break;

    case 'joinEvent':
        $uid = checkInput($_POST['uid']);
        $eid = checkInput($_POST['eid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($eid)) {
            $errors['eid'] = 'Event ID is missing!';
        }

        if (empty($errors)) {
            if ($result = $mysqli -> query("SELECT uids, statuses FROM events_attendance WHERE eid = '$eid'")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);

                $uids = (empty($row['uids']) ? [] : explode(',', $row['uids']));
                $statuses = (empty($row['statuses']) ? [] : explode(',', $row['statuses']));

                if (array_search($uid, $uids) === false) {
                    $uids[] = $uid;
                    $statuses[] = 0;

                    $uids = implode(',', $uids);
                    $statuses = implode(',', $statuses);

                    if ($mysqli -> query("UPDATE events_attendance SET uids = '$uids', statuses = '$statuses' WHERE eid = '$eid'")) {
                        if ($result = $mysqli -> query("SELECT event, dateTime, location, postal FROM events WHERE eid = '$eid'")) {
                            $row = $result -> fetch_array(MYSQLI_ASSOC);
                            $event = $row['event'];
                            $dateTime = $row['dateTime'];
                            $date = date_format(date_create($dateTime), 'd/m/Y');
                            $time = date_format(date_create($dateTime), 'h:i a');
                            $location = $row['location'];
                            $postal = $row['postal'];

                            $mysqli -> query("INSERT INTO event_history (uid, event, dateTime, location, postal, ecoPoints, status) VALUES ('$uid', '$event', '$dateTime', '$location', '$postal', '100', '0')");

                            if ($result = $mysqli -> query("SELECT name FROM users WHERE uid = '$uid'")) {
                                $row = $result -> fetch_array(MYSQLI_ASSOC);
                                $name = $row['name'];

                                if ($result = $mysqli -> query("SELECT uid_one, uid_two FROM friends WHERE status = '1' AND uid_one = '$uid' OR uid_two = '$uid'")) {
                                    $row = $result -> fetch_array(MYSQLI_ASSOC);

                                    if ($row) {
                                        if (($key = array_search($uid, $row)) !== false) {
                                            unset($row[$key]);
                                        }

                                        if (!(empty($name) || empty($event) || empty($date) || empty($time))) {
                                            $notiText = '<span class="text-primary font-weight-bold">'.$name.'</span> joined <span class="text-primary font-weight-bold">'.$event.'</span> on <span class="text-primary font-weight-bold">'.$date.'</span> at <span class="text-primary font-weight-bold">'.$time.'</span> located at <span class="text-primary font-weight-bold">'.$location.'</span>';

                                            foreach ($row as $key => $value) {
                                                $mysqli -> query("INSERT INTO notifications (uid, message, nType) VALUES ('$value', '$notiText', '5')");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    $errors['eid'] = 'You have already joined this event';
                }
            }
        }
        break;

    case 'getAttendance':
        $uid = checkInput($_POST['uid']);
        $eid = checkInput($_POST['eid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($eid)) {
            $errors['eid'] = 'Event ID is missing!';
        }

        if (empty($errors)) {
            if ($result = $mysqli -> query("SELECT event, dateTime, location FROM events WHERE eid = '$eid'")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $event['name'] = $row['event'];
                $event['date'] = date_format(date_create($row['dateTime']), 'd/m/Y');
                $event['time'] = date_format(date_create($row['dateTime']), 'h:i a');
                $event['location'] = $row['location'];

                $data['event'] = $event;
            }

            if ($result = $mysqli -> query("SELECT uids, statuses FROM events_attendance WHERE eid = '$eid'")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);

                if (!empty($row['uids'])) {
                    $uids = explode(',', $row['uids']);
                    $status = explode(',', $row['statuses']);

                    $attendances = [];
                    for ($i=0; $i < count($uids); $i++) {
                        $user = [];

                        if ($result = $mysqli -> query("SELECT email, name FROM users WHERE uid = '$uids[$i]'")) {
                            $row = $result -> fetch_array(MYSQLI_ASSOC);

                            $user['email'] = $row['email'];
                            $user['name'] = $row['name'];
                            $user['status'] = $status[$i];

                            $attendances[$uids[$i]] = $user;
                        }

                        $data['attendances'] = $attendances;
                    }
                }
            }
        }
        break;

    case 'updateAttendance':
        $uid = checkInput($_POST['uid']);
        $eid = checkInput($_POST['eid']);
        $statusUids = (isset($_POST['status']) ? $_POST['status'] : '');

        if (empty($eid)) {
            $errors['eid'] = 'Event ID is missing!';
        }

        if (empty($statusUids)) {
            $errors['status'] = 'You have not made any changes';
        }

        if (empty($errors)) {
            if ($result = $mysqli -> query("SELECT ecoPoints FROM events WHERE eid = '$eid' AND uid = '$uid'")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $awardPoints = $row['ecoPoints'];
            }

            if ($result = $mysqli -> query("SELECT uids, statuses FROM events_attendance WHERE eid='$eid'")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);

                $uids = explode(',', $row['uids']);
                $statuses = explode(',', $row['statuses']);

                foreach ($statusUids as $user) {
                    $i = array_search($user, $uids);

                    if ($i !== false && $statuses[$i] == 0) {
                        $statuses[$i] = 1;

                        $mysqli -> query("UPDATE users SET ecoPoints = ecoPoints + '$awardPoints', ecoPointsMonth = ecoPointsMonth + '$awardPoints' WHERE uid = '$user'");
                    }
                }

                $uids = implode(',', $uids);
                $statuses = implode(',', $statuses);

                $result = $mysqli -> query("UPDATE events_attendance SET uids = '$uids', statuses = '$statuses' WHERE eid = '$eid'");
            }
        }
        break;

    case 'addQuiz':
        $uid = checkInput($_POST['uid']);
        $name = checkInput($_POST['quiz']);
        $questions = (isset($_POST['questions']) ? $_POST['questions'] : '');
        $answers = (isset($_POST['answers']) ? $_POST['answers'] : '');
        $options = (isset($_POST['options']) ? $_POST['options'] : '');

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($name)) {
            $errors['quiz'] = 'Quiz name is required!';
        }

        if (empty($questions)) {
            $errors['questions'] = 'Question is required!';
        }
        else {
            if ($arr = array_filter($questions, function($i) { return $i == null; })) {
                foreach ($arr as $key => $value) {
                    $errors['questions'][$key] = 'Question is required!';
                }
            }
        }

        if (empty($options)) {
            $errors['options'] = 'Choice\'s text is required!';
        }
        else {
            foreach ($options as $i => $v) {
                if ($arr = array_filter($options[$i], function($i) { return $i == null; })) {
                    foreach ($arr as $key => $value) {
                        $errors['options'][$i][$key] = 'Choice\'s text is required!';
                    }
                }

                foreach ($arr as $key => $value) {
                    if (strpos($value, '|') !== false) {
                        $errors['options'][$i][$key] = 'Choice\'s text does not allowed "|" character.';
                    }
                }
            }
        }

        if (empty($answers)) {
            $errors['answers'] = 'Answer is required!';
        }

        if (!empty($questions) && !empty($answers)) {
            foreach ($questions as $key => $value) {
                if (strpos($value, '|') !== false) {
                    $errors['questions'][$key] = 'Question does not allowed "|" character.';
                }
            }

            foreach ($answers as $key => $value) {
                if (strpos($value, '|') !== false) {
                    $errors['answers'][$key] = 'Answer does not allowed "|" character.';
                }
            }

            if ($arr = array_diff_key($questions, $answers)) {
                foreach ($arr as $key => $value) {
                    if (empty($value)) {
                        $errors['questions'][$key] = 'Question is required!';
                    }
                    else {
                        $errors['answers'][$key] = 'Answer is required!';
                    }
                }
            }
        }

        if (empty($errors)) {
            $ecoPoints = count($questions) * 2;
            $questions = implode('|', $questions);
            $options = implode('|', array_reduce($options, 'array_merge', array()));
            $answers = implode(',', $answers);

            $result = $mysqli -> query("INSERT INTO quizzes (uid, name, questions, options, answers, ecoPoints) VALUES ('$uid', '$name', '$questions', '$options', '$answers', '$ecoPoints')");
        }
        break;

    case 'redeemEventCode':
        $uid = checkInput($_POST['uid']);
        $redeemCode = checkInput($_POST['code']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($redeemCode)) {
            $errors['code'] = 'Redeem Code is required!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT eid, ecoPoints FROM events WHERE redeemCode = '$redeemCode'");

            if ($result -> num_rows < 1) {
                $errors['code'] = 'Redeem Code is invalid!';
            }
            else {
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $eid = $row['eid'];
                $awardPoints = $row['ecoPoints'];

                if ($result = $mysqli -> query("SELECT uids, statuses FROM events_attendance WHERE eid = '$eid'")) {
                    if ($result -> num_rows > 0) {
                        $row = $result -> fetch_array(MYSQLI_ASSOC);
                        $uids = explode(',', $row['uids']);
                        $statuses = explode(',', $row['statuses']);

                        $i = array_search($uid, $uids);
                        if ($i !== false) {
                            if ($statuses[$i] == 0) {
                                $statuses[$i] = 1;
                                $uids = implode(',', $uids);
                                $statuses = implode(',', $statuses);

                                $mysqli -> query("UPDATE events_attendance SET uids = '$uids', statuses = '$statuses'");
                                $mysqli -> query("UPDATE users SET ecoPoints = ecoPoints + '$awardPoints', ecoPointsMonth = ecoPointsMonth + '$awardPoints' WHERE uid = '$uid'");
                            }
                            else {
                                $errors['code'] = 'EcoPoints have already been redeemed for this event.';
                            }
                        }
                        else {
                            $errors['code'] = 'You did not joined this event.';
                        }
                    }
                }
            }
        }
        break;

    case 'getRecentQuizzesList':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT qid, date, name, ecoPoints FROM quizzes WHERE uid = '$uid' ORDER BY qid DESC LIMIT 10");

            if ($result -> num_rows > 0) {
                $quizzesList = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $i = count($quizzesList);
                    $quizzesList[$i]['qid'] = $row['qid'];
                    $quizzesList[$i]['date'] = date_format(date_create($row['date']), 'd/m/Y');
                    $quizzesList[$i]['name'] = $row['name'];
                    $quizzesList[$i]['ecoPoints'] = $row['ecoPoints'];
                }

                $data['quizzesList'] = $quizzesList;
            }
            else {
                $errors['quizzesList'] = 'No quizzes to list!';
            }
        }
        break;

    case 'getQuizzesList':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT qid, date, name, questions, ecoPoints FROM quizzes WHERE uid = '$uid' ORDER BY qid DESC");
            if ($result -> num_rows > 0) {
                $quizzesList = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $date = date_format(date_create($row['date']), 'd/m/Y');
                    $i = (array_key_exists($date, $quizzesList) ? count($quizzesList[$date]) : 0);

                    $quizzesList[$date][$i]['qid'] = $row['qid'];
                    $quizzesList[$date][$i]['name'] = $row['name'];
                    $quizzesList[$date][$i]['qNo'] = count(explode('|', $row['questions']));
                    $quizzesList[$date][$i]['ecoPoints'] = $row['ecoPoints'];
                }

                $data['quizzesList'] = $quizzesList;
            }
            else {
                $errors['quizzesList'] = 'No events to list!';
            }
        }
        break;

    case 'getQuizList':
        $uid = checkInput($_POST['uid']);
        $qid = checkInput($_POST['qid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($qid)) {
            $errors['qid'] = 'Quiz ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT * FROM quizzes WHERE uid = '$uid' AND qid = '$qid'");
            if ($result -> num_rows == 1) {
                $result = $result -> fetch_array(MYSQLI_ASSOC);
                $questions = explode('|', $result['questions']);
                $options = explode('|', $result['options']);
                $answers = explode(',', $result['answers']);

                $data['qid'] = $result['qid'];
                $data['date'] = date_format(date_create($result['date']), 'd/m/Y');
                $data['name'] = $result['name'];
                $data['questions'] = $questions;
                $data['options'] = $options;
                $data['answers'] = $answers;
                $data['ecoPoints'] = $result['ecoPoints'];
            }
            else {
                $errors['eid'] = 'Quizzes ID does not exist or has more then one!';
            }
        }
        break;

    case 'submitQuiz':
        $uid = checkInput($_POST['uid']);
        $userAns = (isset($_POST['answers']) ? $_POST['answers'] : '');

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($userAns)) {
            $errors['questions'] = 'You have not answered any of the questions!';
        }

        if (empty($errors)) {
            if ($result = $mysqli -> query("SELECT answers, ecoPoints FROM quizzes WHERE todayQuiz = '1'")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $answers = explode(',', $row['answers']);
                $point = $row['ecoPoints'] / count($answers);

                if (count($userAns) != count($answers)) {
                    $unanswered = array_keys(array_diff_key($answers, $userAns));
                    for ($i=0; $i < count($unanswered); $i++) {
                        $unanswered[$i] += 1;
                    }

                    $errors['questions'] = 'Question(s) ' . implode(', ', $unanswered) . ' unanswered!';
                }
                else {
                    $correct = array_intersect_assoc($answers, $userAns);
                    $ecoPoints = $point * count($correct);

                    if ($result = $mysqli -> query("UPDATE users SET ecoPoints = ecoPoints + '$ecoPoints', ecoPointsMonth = ecoPointsMonth + '$ecoPoints', dailyQuiz = '1' WHERE uid = '$uid' AND dailyQuiz = '0'")) {
                        $data['score'] = count($correct);
                        $data['maxScore'] = count($answers);
                        $data['ecoPoints'] = $ecoPoints;
                        $data['maxEcoPoints'] = $point * count($answers);
                    }
                }
            }
        }
        break;

    case 'getUserQuizStatus':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            if ($result = $mysqli -> query("SELECT dailyQuiz FROM users WHERE uid = '$uid'")) {
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $data['status'] = ($row['dailyQuiz'] ? 0 : 1);
            }
        }
        break;

    case 'getTodayQuiz':
        $result = $mysqli -> query("SELECT * FROM quizzes WHERE todayQuiz = 1");
        $row = $result -> fetch_array(MYSQLI_ASSOC);

        $quiz = [];
        $quiz['name'] = $row['name'];
        $quiz['questions'] = explode('|', $row['questions']);
        $quiz['ecoPoints'] = $row['ecoPoints'];

        $options = explode('|', $row['options']);
        foreach ($quiz['questions'] as $key => $value) {
            $quiz['options'][$key] = array_splice($options, 0, 4);
        }

        $uid = $row['uid'];
        $result = $mysqli -> query("SELECT name FROM users WHERE uid = '$uid'");
        $row = $result -> fetch_array(MYSQLI_ASSOC);

        $quiz['uName'] = $row['name'];

        $data['quiz'] = $quiz;
        break;

    case 'getRewardItems':
        $result = $mysqli -> query("SELECT * FROM items");

        if ($result -> num_rows > 0) {
            $items = [];
            while($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                $items[] = $row;
            }

            $data['items'] = $items;
        }
        else {
            $errors['items'] = 'No items to list!';
        }

        break;

    case 'redeemRewardItems':
        $uid = checkInput($_POST['uid']);
        $items = $_POST['item'];

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($items) || empty($items['rid'])) {
            $errors['items'] = 'No items are selected!';
        }
        else {
            $noneCount = count(array_filter($items['rid'], function($i) { return $i == 'none'; }));
            if ($noneCount >= count($items['rid'])) {
                $errors['items'] = 'No items are selected!';
            }
        }

        if (empty($errors)) {
            $email;
            $sql = [['rid'], ['items'], ['itemsQty'], ['itemsEcoPoints']];
            $totalPoints = 0;
            $ridArr = array_diff($items['rid'], array('none'));
            $ridArr = implode(',', $ridArr);

            $result = $mysqli -> query("SELECT rid, item, ecoPoints, quantity FROM items WHERE rid IN ($ridArr) ORDER BY rid DESC");
            while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                $index = array_search($row['rid'], $items['rid']);
                $rid = $row['rid'];
                $qty = 0;

                $dupRidIndex = array_filter($items['rid'], function($i) use($rid) { return $i == $rid; });
                foreach ($dupRidIndex as $key => $value) {
                    if (empty($items['qty'][$key])) {
                        $errors['quantity'][$key] = 'Quantity is required!';
                    }

                    $qty += (is_numeric($items['qty'][$key]) ? $items['qty'][$key] : 0);
                }

                foreach ($dupRidIndex as $key => $value) {
                    if ($qty > $row['quantity']) {
                        $errors['quantity'][$key] = 'Quantity can\'t be more then stock available!';
                    }
                    elseif ($qty < 1) {
                        $errors['quantity'][$key] = 'Quantity can\'t be less then 1!';
                    }
                }

                if (empty($errors)) {
                    $totalPoints += $row['ecoPoints'] * $qty;
                    $sql['rid'][] = $row['rid'];
                    $sql['items'][] = $row['item'];
                    $sql['itemsQty'][] = $qty;
                    $sql['itemsEcoPoints'][] = $row['ecoPoints'];
                }
            }

            $result = $mysqli -> query("SELECT ecoPoints, email FROM users WHERE uid = '$uid'");
            $result = $result -> fetch_array(MYSQLI_ASSOC);
            $email = $result['email'];
            if (empty($errors) && $totalPoints > $result['ecoPoints']) {
                $errors['ecoPoints'] = $totalPoints - $result['ecoPoints'].' EcoPoints short!';
            }

            if (empty($errors)) {
                $items = implode(',', $sql['items']);
                $qty = implode(',', $sql['itemsQty']);
                $ecoPoints = implode(',', $sql['itemsEcoPoints']);

                $result = $mysqli -> query("INSERT INTO redeemed_history (uid, items, itemsQty, itemsEcoPoints, totalEcoPoints) VALUES ('$uid', '$items', '$qty', '$ecoPoints', '$totalPoints')");

                foreach ($sql['rid'] as $key => $value) {
                    $qty = $sql['itemsQty'][$key];
                    $result = $mysqli -> query("UPDATE items SET quantity = quantity - '$qty' WHERE rid = '$value'");
                }

                $result = $mysqli -> query("UPDATE users SET ecoPoints = ecoPoints - '$totalPoints' WHERE uid = '$uid'");
                $result = $mysqli -> query("SELECT oid, totalEcoPoints FROM redeemed_history WHERE uid = '$uid' ORDER by oid DESC LIMIT 1");
                $row = $result -> fetch_array(MYSQLI_ASSOC);
                $data['oid'] = $row['oid'];
                $data['totalEcoPoints'] = $row['totalEcoPoints'];

                sendMail('[EcoSplash] Redeem #'.$row['oid'], '../templates/email/redeem_success.php?'.http_build_query(array('items' => $sql['items'])).'&'.http_build_query(array('itemsQty' => $sql['itemsQty'])).'&'.http_build_query(array('itemsEcoPoints' => $sql['itemsEcoPoints'])).'&oid='.$row['oid'].'&totalEcoPoints='.$row['totalEcoPoints'], $email);
            }
        }
        break;

    case 'getTopEcoPoints':
        $result = $mysqli -> query("SELECT name, ecoPointsMonth FROM users WHERE type = '0' ORDER BY ecoPointsMonth DESC LIMIT 5");

        $top = [];
        while($row = $result -> fetch_array(MYSQLI_ASSOC)) {
            $i = count($top);
            $top[$i] = $row;
        }

        $data['top'] = $top;
        break;

    case 'getUtilities':
        $uid = $_POST['uid'];

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT * FROM utilities WHERE uid = '$uid'");

            if ($result -> num_rows > 0) {
                $utilities = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $useAmounts = explode(',', $row['useAmounts']);
                    $data[$row['type']]['useAmounts'] = $useAmounts;

                    $prices = explode(',', $row['prices']);
                    $data[$row['type']]['prices'] = $prices;
                }
            }
            else {
                $errors['utilities'] = 'No bills to list';
            }
        }
        break;

    case 'updateAddElectric':
    case 'updateAddGas':
    case 'updateAddWater':
        $uid = checkInput($_POST['uid']);
        $month = (isset($_POST['month']) ? checkInput($_POST['month']) : '');
        $usage = round(checkInput($_POST['usage']), 2);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($usage)) {
            $errors['usage'] = 'Usage is required!';
        }

        if (empty($month) && $month != '0') {
            $errors['month'] = 'Month is required!';
        }

        if (empty($errors)) {
            if ($action == 'updateAddElectric') {
                $result = $mysqli -> query("SELECT * FROM utilities WHERE uid = '$uid' AND type = 'electric'");

                if ($result -> num_rows < 1) {
                    $useAmounts = '';
                    $prices = '';
                    for ($i = 0; $i < 12; $i++) {
                        if ($i == $month && $i == 11) {
                            $useAmounts .= $usage;
                            $prices .= '$'.round(($usage * 23.65) * 0.01, 2);
                        }
                        elseif ($i == $month) {
                            $useAmounts .= $usage.',';
                            $prices .= '$'.round(($usage * 23.65) * 0.01, 2).',';
                        }
                        elseif ($i != 11) {
                            $useAmounts .= '0,';
                            $prices .= '$0,';
                        }
                        else {
                            $useAmounts .= '0';
                            $prices .= '$0';
                        }
                    }

                    $mysqli -> query("INSERT INTO utilities (uid, useAmounts, prices, type) VALUES ('$uid', '$useAmounts', '$prices', 'electric')");
                }
                else {
                    $row = $result -> fetch_array(MYSQLI_ASSOC);

                    $useAmounts = explode(',', $row['useAmounts']);
                    $prices = explode(',', $row['prices']);

                    $useAmounts[$month] = $usage;
                    $prices[$month] = '$'.round(($usage * 23.65) * 0.01, 2);

                    $useAmounts = implode(',', $useAmounts);
                    $prices = implode(',', $prices);

                    $mysqli -> query("UPDATE utilities set useAmounts = '$useAmounts', prices = '$prices' WHERE uid = '$uid' AND type = 'electric'");
                }
            }
            elseif ($action == 'updateAddWater') {
                $result = $mysqli -> query("SELECT * FROM utilities WHERE uid = '$uid' AND type = 'water'");

                if ($result -> num_rows < 1) {
                    $useAmounts = '';
                    $prices = '';
                    for ($i = 0; $i < 12; $i++) {
                        if ($i == $month && $i == 11) {
                            $useAmounts .= $usage;

                            if ($usage > 40) {
                                $calPrices = round((40 * 1.19) * 0.01, 2);
                                $calPrices += round((($usage - 40) * 1.46) * 0.01, 2);
                                $prices .= '$'.$calPrices;
                            }
                            else {
                                $prices .= '$'.round(($usage * 1.19) * 1.19, 2);
                            }
                        }
                        elseif ($i == $month) {
                            $useAmounts .= $usage.',';

                            if ($usage > 40) {
                                $calPrices = round((40 * 1.19) * 0.01, 2);
                                $calPrices += round((($usage - 40) * 1.46) * 0.01, 2);
                                $prices .= '$'.$calPrices.',';
                            }
                            else {
                                $prices .= '$'.round(($usage * 1.19) * 1.19, 2).',';
                            }
                        }
                        elseif ($i != 11) {
                            $useAmounts .= '0,';
                            $prices .= '$0,';
                        }
                        else {
                            $useAmounts .= '0';
                            $prices .= '$0';
                        }
                    }

                    $mysqli -> query("INSERT INTO utilities (uid, useAmounts, prices, type) VALUES ('$uid', '$useAmounts', '$prices', 'water')");
                }
                else {
                    $row = $result -> fetch_array(MYSQLI_ASSOC);

                    $useAmounts = explode(',', $row['useAmounts']);
                    $prices = explode(',', $row['prices']);

                    $useAmounts[$month] = $usage;

                    if ($usage > 40) {
                        $calPrices = round((40 * 1.19) * 0.01, 2);
                        $calPrices += round((($usage - 40) * 1.46) * 0.01, 2);
                        $prices[$month] = '$'.$calPrices;
                    }
                    else {
                        $prices[$month] = '$'.round(($usage * 1.19) * 1.19, 2);
                    }

                    $useAmounts = implode(',', $useAmounts);
                    $prices = implode(',', $prices);

                    $mysqli -> query("UPDATE utilities set useAmounts = '$useAmounts', prices = '$prices' WHERE uid = '$uid' AND type = 'water'");
                }
            }
            elseif ($action == 'updateAddGas') {
                $result = $mysqli -> query("SELECT * FROM utilities WHERE uid = '$uid' AND type = 'gas'");

                if ($result -> num_rows < 1) {
                    $useAmounts = '';
                    $prices = '';
                    for ($i = 0; $i < 12; $i++) {
                        if ($i == $month && $i == 11) {
                            $useAmounts .= $usage;
                            $prices .= '$'.round(($usage * 18.53) * 0.01, 2);
                        }
                        elseif ($i == $month) {
                            $useAmounts .= $usage.',';
                            $prices .= '$'.round(($usage * 18.53) * 0.01, 2).',';
                        }
                        elseif ($i != 11) {
                            $useAmounts .= '0,';
                            $prices .= '$0,';
                        }
                        else {
                            $useAmounts .= '0';
                            $prices .= '$0';
                        }
                    }

                    $mysqli -> query("INSERT INTO utilities (uid, useAmounts, prices, type) VALUES ('$uid', '$useAmounts', '$prices', 'gas')");
                }
                else {
                    $row = $result -> fetch_array(MYSQLI_ASSOC);

                    $useAmounts = explode(',', $row['useAmounts']);
                    $prices = explode(',', $row['prices']);

                    $useAmounts[$month] = $usage;
                    $prices[$month] = '$'.round(($usage * 18.53) * 0.01, 2);

                    $useAmounts = implode(',', $useAmounts);
                    $prices = implode(',', $prices);

                    $mysqli -> query("UPDATE utilities set useAmounts = '$useAmounts', prices = '$prices' WHERE uid = '$uid' AND type = 'gas'");
                }
            }
        }
        break;

    case 'deleteElectric':
    case 'deleteWater':
    case 'deleteGas':
        $uid = checkInput($_POST['uid']);
        $uuid = checkInput($_POST['uuid']);
        $type = '';

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($uuid) && $uuid != '0') {
            $errors['uuid'] = 'utilities ID is missing!';
        }

        if (empty($errors)) {
            if ($action == 'deleteElectric') {
                $type = 'electric';
            }
            elseif ($action == 'deleteWater') {
                $type = 'water';
            }
            elseif ($action == 'deleteGas') {
                $type = 'gas';
            }

            $result = $mysqli -> query("SELECT * FROM utilities WHERE uid = '$uid' AND type = '$type'");

            if ($result -> num_rows == 1) {
                $result = $result -> fetch_array(MYSQLI_ASSOC);

                $useAmounts = explode(',', $result['useAmounts']);
                $prices = explode(',', $result['prices']);

                $useAmounts[$uuid] = 0;
                $prices[$uuid] = '$0';

                $useAmounts = implode(',', $useAmounts);
                $prices = implode(',', $prices);

                $result = $mysqli -> query("UPDATE utilities SET useAmounts = '$useAmounts', prices = '$prices' WHERE uid = '$uid' AND type = '$type'");
            }
        }
        break;

    case 'deleteAllElectric':
    case 'deleteAllWater':
    case 'deleteAllGas':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            if ($action == 'deleteAllElectric') {
                $mysqli -> query("DELETE FROM utilities WHERE uid = '$uid' AND type = 'electric'");
            }
            elseif ($action == 'deleteAllWater') {
                $mysqli -> query("DELETE FROM utilities WHERE uid = '$uid' AND type = 'water'");
            }
            elseif ($action == 'deleteAllGas') {
                $mysqli -> query("DELETE FROM utilities WHERE uid = '$uid' AND type = 'gas'");
            }
        }
        break;

    case 'getAllUsers':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT uid, name, bio, type, ecoPoints FROM users WHERE uid != '$uid'");

            if ($result -> num_rows < 1) {
                $errors['uid'] = 'No accounts to display!';
            }
            else {
                $accs = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $cuid = $row ['uid'];

                    $sql = $mysqli -> query ("SELECT uid_one, uid_two, status FROM friends WHERE uid_one = '$cuid' OR uid_two = '$cuid' AND uid_one = '$uid' OR uid_two = '$uid'");
                    $sqlRow = $sql -> fetch_array(MYSQLI_ASSOC);

                    if ($sqlRow['status'] == 0) {
                        if ($sqlRow['uid_one'] == $uid) {
                            $row['status'] = 'request';
                        }
                        else if ($sqlRow['uid_two'] == $uid) {
                            $row['status'] = 'response';
                        }
                    }
                    elseif ($sqlRow['status'] = 1) {
                        $row['status'] = 'followed';
                    }
                    else {
                        $row['status'] = 'none';
                    }

                    $accs[count($accs)] = $row;
                }

                $data['users'] = $accs;
            }
        }
        break;

    case 'getFriends':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("SELECT * FROM friends WHERE uid_one = '$uid' OR uid_two = '$uid'");

            if ($result -> num_rows > 0) {
                $friends = [];
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $fid = ($row['uid_one'] == $uid ? $row['uid_two'] : $row['uid_one']);
                    $friends['fid'][] = ($row['uid_one'] == $uid ? $row['uid_two'] : $row['uid_one']);
                    $friends['rr_status'][] = ($row['uid_one'] == $uid ? 'request' : 'response');
                    $friends['status'][] = $row['status'];

                    $accResult = $mysqli -> query("SELECT name, bio, ecoPoints, type FROM users WHERE uid = '$fid'");
                    $accResult = $accResult -> fetch_array(MYSQLI_ASSOC);

                    $friends['name'][] = $accResult['name'];
                    $friends['bio'][] = $accResult['bio'];
                    $friends['ecoPoints'][] = $accResult['ecoPoints'];
                    $friends['type'][] = $accResult['type'];
                }

                $data['friends'] = $friends;
            }
        }
        break;

    case 'followFriend':
    case 'unfollowFriend':
    case 'acceptFollowFriend':
    case 'rejectFollowFriend':
    case 'cancelFollowFriend':
        $uid = $_POST['uid'];
        $fuid = $_POST['fuid'];

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing!';
        }

        if (empty($fuid)) {
            $errors['fuid'] = 'Follow user ID is missing!';
        }

        if (empty($errors)) {
            if ($action == 'followFriend') {
                if ($result = $mysqli -> query("INSERT INTO friends (uid_one, uid_two, status) VALUES ('$uid', '$fuid', '0')")) {
                    if ($result = $mysqli -> query("SELECT name FROM users WHERE uid = '$fuid'")) {
                        $row = $result -> fetch_array(MYSQLI_ASSOC);
                        $notiText = '<span class="text-primary font-weight-bold">'.$row['name'].'</span> have send you a follow request.';

                        $mysqli -> query("INSERT INTO notifications (uid, message, nType) VALUES ('$fuid', '$notiText', '0')");
                    }
                }
            }
            elseif ($action == 'unfollowFriend') {
                if ($result = $mysqli -> query("DELETE FROM friends WHERE uid_one = '$uid' AND uid_two = '$fuid' OR uid_one = '$fuid' AND uid_two = '$uid'")) {
                    if ($result = $mysqli -> query("SELECT name FROM users WHERE uid = '$fuid'")) {
                        $row = $result -> fetch_array(MYSQLI_ASSOC);
                        $notiText = '<span class="text-primary font-weight-bold">'.$row['name'].'</span> unfollowed you.';

                        $mysqli -> query("INSERT INTO notifications (uid, message, nType) VALUES ('$fuid', '$notiText', '1')");
                    }
                }
            }
            elseif ($action == 'acceptFollowFriend') {
                if ($result = $mysqli -> query("UPDATE friends SET status = '1' WHERE uid_one = '$fuid' AND uid_two = '$uid'")) {
                    if ($result = $mysqli -> query("SELECT name FROM users WHERE uid = '$fuid'")) {
                        $row = $result -> fetch_array(MYSQLI_ASSOC);
                        $notiText = '<span class="text-primary font-weight-bold">'.$row['name'].'</span> accepted your follow request.';

                        $mysqli -> query("INSERT INTO notifications (uid, message, nType) VALUES ('$fuid', '$notiText', '2')");
                    }
                }
            }
            elseif ($action == 'rejectFollowFriend') {
                if ($result = $mysqli -> query("DELETE FROM friends WHERE uid_one = '$fuid' AND uid_two = '$uid'")) {
                    if ($result = $mysqli -> query("SELECT name FROM users WHERE uid = '$fuid'")) {
                        $row = $result -> fetch_array(MYSQLI_ASSOC);
                        $notiText = '<span class="text-primary font-weight-bold">'.$row['name'].'</span> reject your follow request.';

                        $mysqli -> query("INSERT INTO notifications (uid, message, nType) VALUES ('$fuid', '$notiText', '3')");
                    }
                }
            }
            elseif ($action == 'cancelFollowFriend') {
                if ($result = $mysqli -> query("DELETE FROM friends WHERE uid_one = '$uid' AND uid_two = '$fuid'")) {
                    if ($result = $mysqli -> query("SELECT name FROM users WHERE uid = '$fuid'")) {
                        $row = $result -> fetch_array(MYSQLI_ASSOC);
                        $notiText = '<span class="text-primary font-weight-bold">'.$row['name'].'</span> have canceled their follow request.';

                        $mysqli -> query("INSERT INTO notifications (uid, message, nType) VALUES ('$fuid', '$notiText', '4')");
                    }
                }
            }
        }
        break;

    case 'getNotifications':
        $uid = checkInput($_POST['uid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing';
        }

        if (empty($errors)) {
            if ($result = $mysqli -> query("SELECT nid, message, nType FROM notifications WHERE uid = '$uid' LIMIT 20")) {
                while ($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $data['notifications'][] = $row;
                }
            }
        }
        break;

    case 'deleteNotification':
        $uid = checkInput($_POST['uid']);
        $nid = checkInput($_POST['nid']);

        if (empty($uid)) {
            $errors['uid'] = 'User ID is missing';
        }

        if (empty($nid)) {
            $errors['nid'] = 'Notification ID is missing';
        }

        if (empty($errors)) {
            $result = $mysqli -> query("DELETE FROM notifications WHERE uid = '$uid' AND nid = '$nid'");
        }
        break;
}

if (empty($errors)) {
	$data['success'] = true;
}
else {
	$data['success'] = false;
    $data['errors'] = $errors;
}

echo json_encode($data);

function checkInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);

    return $input;
}

function randAlphaNumeric($length) {
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $code = array();
    $alphaLength = strlen($alphabet) - 1;

    for ($i = 0; $i < $length; $i++) {
        $n = rand(0, $alphaLength);
        $code[] = $alphabet[$n];
    }

    return implode($code);
}

function sendMail($subject, $fileURL, ...$email) {
    require_once 'mailconfig.php';
    $currURL = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);

    if (count($email) == 1) {
        $mail->addAddress($email[0]);
    }
    else {
        foreach ($email as $value) {
            $mail->addBcc($value);
        }
    }

    $mail->Subject = $subject;
    $mail->CharSet = 'utf-8';
    $mail->AddEmbeddedImage('../img/logo/ecosplash_colored.png', 'logo');
    $mail->AddEmbeddedImage('../img/email/facebook.png', 'fb');
    $mail->AddEmbeddedImage('../img/email/twitter.png', 'tw');
    $mail->AddEmbeddedImage('../img/email/instagram.png', 'in');
    $mail->msgHTML(file_get_contents($currURL.'/'.$fileURL), __DIR__);
    $mail -> send();
}
?>
