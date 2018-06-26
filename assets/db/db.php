<?php
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    header('Content-type: application/json');

    require_once "dbconfig.php";
    require_once 'mailconfig.php';

    $mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    $currURL = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
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
                $result = $mysqli -> query("SELECT * FROM users WHERE email = '$email'");
                if ($result -> num_rows == 0) {
                    $errors['email'] = $email.' does not exists!';
                }
            }

            if (empty($password)) {
                $errors['password'] = 'Password is required!';
            }

            if (empty($errors)) {
                $result = $result -> fetch_array();
                if (password_verify($password, $result['password'])) {
                    $data['uid'] = $result['uid'];
                    $data['name'] = $result['name'];
                    $data['ecoPoints'] = $result['ecoPoints'];
                    $data['newNotifications'] = $result['newNotifications'];
                    $data['accType'] = $result['type'];

                    if (!empty($remember)) {
                        $data['remember'] = true;
                    }
                }
                else {
                    $errors['password'] = 'Wrong password!';
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

                $mail->addAddress($email);
                $mail->Subject = '[EcoSplash] Sign Up Successful';
                $mail->CharSet = 'utf-8';
                $mail->AddEmbeddedImage('../img/logo/ecosplash_colored.png', 'logo');
                $mail->AddEmbeddedImage('../img/email/facebook.png', 'fb');
                $mail->AddEmbeddedImage('../img/email/twitter.png', 'tw');
                $mail->AddEmbeddedImage('../img/email/instagram.png', 'in');
                $mail->msgHTML(file_get_contents($currURL.'/../templates/email/signup.php?name='.$name.'&email='.$email.'&password='.$mailPass), __DIR__);
                $mail -> send();
            }
            break;

        case 'getUser':
        case 'getUsers':
            $uid = checkInput($_POST['uid']);

            if (empty($uid)) {
                $errors['uid'] = 'User ID is missing!';
            }

            if (empty($errors)) {
                $result = $mysqli -> query("SELECT * FROM users WHERE uid = '$uid'");
                if ($result -> num_rows == 1) {
                    $result = $result -> fetch_array();
                    $data['uid'] = $result['uid'];
                    $data['name'] = $result['name'];
                    $data['email'] = $result['email'];
                    $data['bio'] = $result['bio'];
                    $data['ecoPoints'] = $result['ecoPoints'];
                    $data['ecoPointsMonth'] = $result['ecoPointsMonth'];

                    if ($action == 'getUser') {
                        $data['dailyQuiz'] = $result['dailyQuiz'];
                        $data['dailyTask'] = $result['dailyTask'];
                        $data['newNotifications'] = $result['newNotifications'];
                    }
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
                    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
                    $fcode = array();
                    $alphaLength = strlen($alphabet) - 1;

                    for ($i = 0; $i < 8; $i++) {
                        $n = rand(0, $alphaLength);
                        $fcode[] = $alphabet[$n];
                    }

                    $fcode = implode($fcode);
                    $mysqli -> query("UPDATE users SET fpCode = '$fcode' WHERE email = '$email'");

                    $mail->addAddress($email);
                    $mail->Subject = '[EcoSplash] Forgot Password Code';
                    $mail->CharSet = 'utf-8';
                    $mail->AddEmbeddedImage('../img/logo/ecosplash_colored.png', 'logo');
                    $mail->AddEmbeddedImage('../img/email/facebook.png', 'fb');
                    $mail->AddEmbeddedImage('../img/email/twitter.png', 'tw');
                    $mail->AddEmbeddedImage('../img/email/instagram.png', 'in');
                    $mail->msgHTML(file_get_contents($currURL.'/../templates/email/forgot_password.php?fcode='.$fcode), __DIR__);
                    $mail -> send();
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
                $result = $mysqli -> query("SELECT * FROM users WHERE email = '$email'");
                if ($result -> num_rows == 0) {
                    $errors['email'] = $email.' is not a registered user with us.';
                }
                else {
                    $result = $result -> fetch_array();
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

            if (empty($cfmPassword)) {
                $errors['cfmPassword'] = 'Confirm password is required!';
            }

            if (empty($errors)) {
                if ($password != $cfmPassword) {
                    $errors['password'] = 'New password doesn\'t match with confirm password!';
                    $errors['cfmPassword'] = 'Confirm password doesn\'t match with new password!';
                }
                else {
                    $result = $mysqli -> query("SELECT * FROM users WHERE email = '$email'");
                    if ($result -> num_rows == 0) {
                        $errors['email'] = $email.' is not a registered user with us.';
                    }
                    else {
                        $result = $result -> fetch_array();
                        if ($fcode != $result['fpCode']) {
                            $errors['fcode'] = 'Generated code is invalid!';
                        }
                        else {
                            $mailPass = $password;
                            $password = password_hash($password, PASSWORD_BCRYPT);
                            $mysqli -> query("UPDATE users SET password = '$password', fpCode = NULL WHERE email = '$email'");

                            $mail->addAddress($email);
                            $mail->Subject = '[EcoSplash] Password Changed Successful';
                            $mail->CharSet = 'utf-8';
                            $mail->AddEmbeddedImage('../img/logo/ecosplash_colored.png', 'logo');
                            $mail->AddEmbeddedImage('../img/email/facebook.png', 'fb');
                            $mail->AddEmbeddedImage('../img/email/twitter.png', 'tw');
                            $mail->AddEmbeddedImage('../img/email/instagram.png', 'in');
                            $mail->msgHTML(file_get_contents($currURL.'/../templates/email/forgot_password_success.php?email='.$email.'&password='.$mailPass), __DIR__);
                            $mail -> send();
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
                    $result = $result -> fetch_array();
                    $errors['email'] = $result['email'].' already has an account with us!';
                }
                elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $errors['email'] = 'Email format is invalid!';
                }
            }

            if (!empty($password)) {
                if (empty($cfmPassword)) {
                    $errors['cfmPassword'] = 'Confirm password is required!';
                }
                elseif ($password != $cfmPassword) {
                    $errors['password'] = 'New password doesn\'t match with confirm password!';
                    $errors['cfmPassword'] = 'Confirm password doesn\'t match with new password!';
                }
            }

            if (empty($errors)) {
                $result = $mysqli -> query("SELECT * FROM users WHERE uid = '$uid'");

                if ($result -> num_rows == 0) {
                    $errors['uid'] = "User not found!";
                }
                else {
                    $result = $result -> fetch_array();
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
                            $mail->addAddress($email);
                        }
                        else {
                            $mail->addBCC($email);
                            $mail->addBCC($oEmail);
                        }
                        $mail->Subject = '[EcoSplash] Login Details Changed Successful';
                        $mail->CharSet = 'utf-8';
                        $mail->AddEmbeddedImage('../img/logo/ecosplash_colored.png', 'logo');
                        $mail->AddEmbeddedImage('../img/email/facebook.png', 'fb');
                        $mail->AddEmbeddedImage('../img/email/twitter.png', 'tw');
                        $mail->AddEmbeddedImage('../img/email/instagram.png', 'in');
                        $mail->msgHTML(file_get_contents($currURL.'/../templates/email/login_details_success.php?email='.$email.'&password='.$mailPass), __DIR__);
                        $mail->send();
                    }

                    $mysqli -> query("UPDATE users set name = '$name', bio = '$bio', email = '$email', password = '$password' WHERE uid = '$uid'");
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
                        $result = $result -> fetch_array();
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
                        $mysqli -> query("UPDATE users SET dailyTask = '$todayTask', ecoPoints = ecoPoints + '$addPoints' WHERE uid = '$uid'");
                    }
                }
            break;

        case 'getRedeemHistories':
            $uid = checkInput($_POST['uid']);

            if (empty($uid)) {
                $errors['uid'] = 'User ID is missing!';
            }

            if (empty($errors)) {
                $result = $mysqli -> query("SELECT * FROM redeemed_history WHERE uid = '$uid' ORDER BY date DESC LIMIT 10");
                if ($result -> num_rows > 0) {
                    while ($row = $result -> fetch_array()) {
                        $lists[] = $row;
                    }

                    $data['redeem_histories'] = $lists;
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
                    $result = $result -> fetch_array();
                    $data['oid'] = $result['oid'];
                    $data['date'] = $result['date'];
                    $data['items'] = $result['items'];
                    $data['itemsQty'] = $result['itemsQty'];
                    $data['itemsEcoPoints'] = $result['itemsEcoPoints'];
                    $data['totalEcoPoints'] = $result['totalEcoPoints'];
                }
                else {
                    $errors['oid'] = 'Redeem history ID does not exist or has more then one!';
                }
            }
            break;

        case 'getEventHistories':
            $uid = checkInput($_POST['uid']);

            if (empty($uid)) {
                $errors['uid'] = 'User ID is missing!';
            }

            if (empty($errors)) {
                $result = $mysqli -> query("SELECT * FROM event_history WHERE uid = '$uid' ORDER BY joinDate DESC LIMIT 10");
                if ($result -> num_rows > 0) {
                    while ($row = $result -> fetch_array()) {
                        $lists[] = $row;
                    }

                    $data['event_histories'] = $lists;
                }
                else {
                    $errors['event_histories'] = 'No events history!';
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
                    $result = $result -> fetch_array();
                    $data['eid'] = $result['eid'];
                    $data['joinDate'] = $result['joinDate'];
                    $data['event'] = $result['event'];
                    $data['dateTime'] = $result['dateTime'];
                    $data['ecoPoints'] = $result['ecoPoints'];
                    $data['status'] = $result['status'];
                }
                else {
                    $errors['eid'] = 'Event history ID does not exist or has more then one!';
                }
            }
            break;

        case 'uploadPhoto':
            $uid = checkInput($_POST['uid']);
            $file;

            if (isset($_FILES['file'])) {
                $file = $_FILES['file'];
            }

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
                        $target = '../img/uploads/'.$uid.'.png';
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

        case 'getRewardItems':
            $result = $mysqli -> query("SELECT * FROM items");

            $items = [];
            while($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                $items[] = $row;
            }

            $data['items'] = $items;
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
                $result = $result -> fetch_array();
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

                    $mail->addAddress($email);
                    $mail->Subject = '[EcoSplash] Redeem #'.$row['oid'];
                    $mail->CharSet = 'utf-8';
                    $mail->AddEmbeddedImage('../img/logo/ecosplash_colored.png', 'logo');
                    $mail->AddEmbeddedImage('../img/email/facebook.png', 'fb');
                    $mail->AddEmbeddedImage('../img/email/twitter.png', 'tw');
                    $mail->AddEmbeddedImage('../img/email/instagram.png', 'in');
                    $mail->msgHTML(file_get_contents($currURL.'/../templates/email/redeem_success.php?'.http_build_query(array('items' => $sql['items'])).'&'.http_build_query(array('itemsQty' => $sql['itemsQty'])).'&'.http_build_query(array('itemsEcoPoints' => $sql['itemsEcoPoints'])).'&oid='.$row['oid'].'&totalEcoPoints='.$row['totalEcoPoints']), __DIR__);
                    $mail->send();
                }
            }
            break;

            case 'getTopEcoPoints':
                $result = $mysqli -> query("SELECT name, ecoPointsMonth FROM users ORDER BY ecoPointsMonth DESC LIMIT 5");

                $top = [];
                while($row = $result -> fetch_array(MYSQLI_ASSOC)) {
                    $top['name'][] = $row['name'];
                    $top['ecoPoints'][] = $row['ecoPointsMonth'];
                }

                $data['top'] = $top;
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
                    $quiz['options'][$key][] = array_splice($options, 0, 4);
                }

                $uid = $row['uid'];
                $result = $mysqli -> query("SELECT name FROM users WHERE uid = '$uid'");
                $row = $result -> fetch_array(MYSQLI_ASSOC);

                $quiz['uName'] = $row['name'];

                $data['quiz'] = $quiz;
                break;

            case 'getRecentEvents':
                $result = $mysqli -> query("SELECT * FROM events WHERE dateTime > CURDATE() ORDER BY dateTime ASC");

                $events = [];
                $i = 0;
                while (($row = $result -> fetch_array(MYSQLI_ASSOC)) && $i < 10) {
                    $date = date_format(date_create($row['dateTime']), 'd/m/Y');
                    if (array_key_exists($date, $events)) {
                        $newIndex = count($events[$date]);
                        $events[$date][$newIndex]['time'] = date_format(date_create($row['dateTime']), 'h:i a');
                        $events[$date][$newIndex]['event'] = $row['event'];
                        $events[$date][$newIndex]['location'] = $row['location'];
                        $events[$date][$newIndex]['ecoPoints'] = $row['ecoPoints'];
                    }
                    else {
                        $events[$date][0]['time'] = date_format(date_create($row['dateTime']), 'h:i a');
                        $events[$date][0]['event'] = $row['event'];
                        $events[$date][0]['location'] = $row['location'];
                        $events[$date][0]['ecoPoints'] = $row['ecoPoints'];
                        $i++;
                    }
                }

                $data['events'] = $events;
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
}

function checkInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);

    return $input;
}
?>
