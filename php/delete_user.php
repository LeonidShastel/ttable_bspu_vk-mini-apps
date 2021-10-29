<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: *');


$vk_id=$_GET['id'];

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');

if($mysqli->query("DELETE FROM BSPUMessage WHERE vk_id=$vk_id")){
    echo 'deleted';
}else {
    echo $mysqli->error;
    trigger_error($mysqli->error, E_USER_ERROR);
}