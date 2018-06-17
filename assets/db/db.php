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
            else {
                $result = $mysqli -> query("SELECT * FROM users WHERE uid = '$uid'");
                if ($result -> num_rows == 1) {
                    $result = $result -> fetch_array();
                    $data['uid'] = $result['uid'];
                    $data['name'] = $result['name'];
                    $data['email'] = $result['email'];
                    $data['bio'] = $result['bio'];
                    $data['ecoPoints'] = $result['ecoPoints'];

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
            else {
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
                }
            }
            break;

        case 'fpass_3':
            $email = checkInput($_POST['email']);
            $fcode = checkInput($_POST['fcode']);
            $password = checkInput($_POST['password']);
            $cfmPassword = checkInput($_POST['cfmPassword']);

            if (empty($email) || empty($fcode)) {
                $errors['email'] = 'Email and Code is missing!';
            }

            if (empty($password) || empty($cfmPassword)) {
                if (empty($password)) {
                    $errors['password'] = 'New password is required!';
                }

                if (empty($cfmPassword)) {
                    $errors['cfmPassword'] = 'Confirm password is required!';
                }
            }
            elseif (strlen($password) < 6) {
                $errors["password"] = 'New password has to be more then 5 characters!';
            }
            else if ($password != $cfmPassword) {
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
                        $mysqli -> query("UPDATE users SET password = '$password' WHERE email = '$email'");

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
            break;

            case 'getTodayTask':
                $result = $mysqli -> query("SELECT task FROM today_task");

                $data['task'] = [];
                foreach ($result as $result) {
                    array_push($data['task'], $result['task']);
                }
                break;

            case 'updateUserTask':
                    $uid = checkInput($_POST['uid']);

                    if (empty($uid)) {
                        $data['uid'] = 'User ID is missing!';
                    }
                    else {
                        $result = $mysqli -> query("SELECT dailyTask, ecoPoints FROM users WHERE email = '$email'");
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

                            $mysqli -> query("UPDATE users SET dailyTask = '$todayTask', ecoPoints = ecoPoints + '$addPoints' WHERE email = '$email'");
                        }
                    }
                break;

                case 'getRedeemHistory':
                    $uid = checkInput($_POST['uid']);

                    if (empty($uid)) {
                        $errors['uid'] = 'User ID is missing!';
                    }
                    else {
                        $result = $mysqli -> query("SELECT * FROM redeemed_history WHERE uid = '$uid'");
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
    }

    if (empty($errors)) {
    	$data["success"] = true;
    }
    else {
    	$data["success"] = false;
        $data["errors"] = $errors;
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
