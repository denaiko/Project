<?php
    $users = $_REQUEST['users'];
    $file = fopen('js/users.json', "r");
    file_put_contents('js/users.json', json_encode($users));
    fclose($file);
?>
