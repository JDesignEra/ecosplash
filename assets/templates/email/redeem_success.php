<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style type="text/css">
        .ReadMsgBody {
            width: 100%;
            background-color: #ffffff;
        }

        .ExternalClass {
            width: 100%;
            background-color: #ffffff;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        html {
            width: 100%;
        }

        body {
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            margin: 0;
            padding: 0;
        }

        table {
            border-spacing: 0;
            table-layout: fixed;
            margin: 0 auto;
        }

        table table table {
            table-layout: auto;
        }

        .yshortcuts a {
            border-bottom: none !important;
        }

        img:hover {
            opacity: 0.9 !important;
        }

        a {
            color: #13574a;
            text-decoration: none;
        }

        .textbutton a {
            font-family: 'open sans', arial, sans-serif !important;
        }

        .btn-link a {
            color: #FFFFFF !important;
        }

        @media only screen and (max-width: 640px) {
            body {
                width: auto !important;
            }
            /* image */
            img[class="img1"] {
                width: 100% !important;
                height: auto !important;
            }
        }

        @media only screen and (max-width: 480px) {
            body {
                width: auto !important;
            }
            /* image */
            img[class="img1"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body>
    <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
            <td background="https://www.dropbox.com/s/0kg5ck81wn0qjj3/redeem.jpg?raw=1" bgcolor="#ececec" style="background-size:cover; background-position:center; background-repeat:no-repeat" valign="top">
                <table align="center" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" width="550">
                            <table align="center" width="90%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td height="50"></td>
                                </tr>
                            </table>
                            <table bgcolor="#FFFFFF" style="border-radius:6px;" width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td height="40"></td>
                                </tr>
                                <tr>
                                    <td align="center" style="line-height: 0px;"><img style="display:block; line-height:0px; font-size:0px; border:0px;" src="cid:logo" alt="img" /></td>
                                </tr>
                                <tr>
                                    <td height="30"></td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table align="center" width="90%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="font-family: 'Century Gothic', Arial, sans-serif; color:#414a51; font-size:28px;font-weight: bold;">
                                                    Redeem #<?php echo (isset($_GET['oid']) ? $_GET['oid'] : '') ?>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <table width="150" border="0" align="center" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td height="15" style="border-bottom:3px dotted #13547a;"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="20"></td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-family: 'Open sans', Arial, sans-serif; color:#7f8c8d; font-size:14px; line-height: 28px;">
                                                    You have successfully redeem your items. Your redeemed details are shown below.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td height="50" style="border-bottom:2px solid #4db6ac;"></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="20"></td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <table width="100%" class="table-inner" border="0" cellspacing="0" cellpadding="0">
                                                        <?php
                                                            if (isset($_GET['items']) && isset($_GET['itemsQty']) && isset($_GET['itemsEcoPoints'])) {
                                                                $items = $_GET['items'];
                                                                $quantites = $_GET['itemsQty'];
                                                                $ecoPoints = $_GET['itemsEcoPoints'];

                                                                for ($i = 0; $i < count($items); $i++) {
                                                                    echo '<tr>
                                                                        <td data-link-style="text-decoration:none; color:#3b3b3b;" data-link-color="list" data-size="list" data-color="list" mc:edit="invoice-11" width="50%" align="left" valign="top" style="font-family: \'Open Sans\', Arial, sans-serif; font-size:14px; color:#3b3b3b; line-height:26px;  font-weight: bold;">
                                                                            <singleline label="list-1">
                                                                                '.$items[$i].'
                                                                            </singleline>
                                                                        </td>
                                                                        <td data-link-style="text-decoration:none; color:#3b3b3b;" data-link-color="list" data-size="list" data-color="list" mc:edit="invoice-12" width="20%" align="left" valign="top" style="font-family: \'Open Sans\', Arial, sans-serif; font-size:14px; color:#3b3b3b; line-height:26px;  font-weight: bold;">
                                                                            <singleline label="list-2">
                                                                                '.$quantites[$i].'
                                                                            </singleline>
                                                                        </td>
                                                                        <td data-link-style="text-decoration:none; color:#3b3b3b;" data-link-color="list" data-size="list" data-color="list" mc:edit="invoice-13" width="30%" align="center" valign="top" style="font-family: \'Open Sans\', Arial, sans-serif; font-size:14px; color:#3b3b3b; line-height:26px;  font-weight: bold;">
                                                                            <singleline label="list-3">
                                                                                '.$ecoPoints[$i].' EcoPoints
                                                                            </singleline>
                                                                        </td>
                                                                    </tr>';
                                                                }
                                                            }
                                                        ?>
                                                    </table>

                                                    <table width="100%" class="table-inner" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" colspan="3">
                                                                <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                                    <tr>
                                                                        <td height="20" style="border-bottom:2px solid #4db6ac;"></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td data-bgcolor="Texs BG" bgcolor="#f8f8f8" align="center">
                                                                <table class="table-inner" align="center" width="90%" border="0" cellpadding="0" cellspacing="0">
                                                                    <tr>
                                                                        <td height="10">
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td data-link-style="text-decoration:none; color:#3b3b3b;" data-link-color="Texs" data-size="Texs Title" data-color="Texs Text" style="font-family: 'Open Sans', Arial, sans-serif; font-size:12px; color:#3b3b3b; line-height:26px; text-transform:uppercase;line-height:24px;">
                                                                            <singleline>
                                                                                Total EcoPoints
                                                                            </singleline>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td data-link-style="text-decoration:none; color:#3b3b3b;" data-link-color="Texs" data-size="Texs Total" data-color="Texs Text" style="font-family: 'Open Sans', Arial, sans-serif; font-size:24px; color:#13547a;  font-weight: bold;">
                                                                            <singleline>
                                                                                <?php
                                                                                    echo (isset($_GET['totalEcoPoints']) ? $_GET['totalEcoPoints'] : '');
                                                                                ?>
                                                                            </singleline>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td height="15">
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="40"></td>
                                </tr>
                            </table>
                            <table align="center" width="90%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td height="25"></td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table border="0" align="center" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="line-height: 0px;">
                                                    <a href="https://facebook.com"> <img style="display:block; line-height:0px; font-size:0px; border:0px;" src="cid:fb" alt="img" /> </a>
                                                </td>
                                                <td width="10"></td>
                                                <td align="center" style="line-height: 0px;">
                                                    <a href="https://twitter.com"> <img style="display:block; line-height:0px; font-size:0px; border:0px;" src="cid:tw" alt="img" /> </a>
                                                </td>
                                                <td width="10"></td>
                                                <td align="center" style="line-height: 0px;">
                                                    <a href="https://instagram.com"> <img style="display:block; line-height:0px; font-size:0px; border:0px;" src="cid:in" alt="img" /> </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="55"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
