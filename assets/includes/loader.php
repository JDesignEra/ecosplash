<?php
    require_once __DIR__.'/../vendor/autoload.php';

    $loader = new Twig_Loader_Filesystem(array(
        __DIR__.'/../templates',
    ));

    $twig = new Twig_Environment($loader);
?>
