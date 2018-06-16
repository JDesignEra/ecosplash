<?php
    require_once __DIR__.'/../vendor/autoload.php';

    $loader = new Twig_Loader_Filesystem(array(
        __DIR__.'/../templates',
    ));

    /* //Cache Version
    $twig = new Twig_Environment($loader, array(
        'cache' => __DIR__.'/../templates/cahce',
    ));
    */

    $twig = new Twig_Environment($loader);
?>
