<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


$_POST = json_decode(file_get_contents('php://input'), true);

$name=$_POST['name'];
$vk_id=$_POST['id'];
$faculty=$_POST['faculty'];
$group=$_POST['group'];
$access_token=$_POST['access_token'];

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');

if($access_token!==""){
    if($mysqli->query("INSERT INTO `BSPUMessage` (`id`, `name`,`vk_id` ,`faculty_id`,`group_id`,`access_token`) SET (null,'$name','$vk_id','$faculty','$group','$access_token')")){
        echo 'posted';
    }else{
        echo 'error';
        trigger_error($mysqli->error, E_USER_ERROR);
    }
}