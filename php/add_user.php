<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: *');


$_POST = json_decode(file_get_contents('php://input'), true);

$name=$_POST['name'];
$vk_id=$_POST['id'];
$faculty=$_POST['faculty'];
$group=$_POST['group'];

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');

if($vk_id!==""){
    $check = $mysqli->query("SELECT * FROM `BSPUMessqge` WHERE vk_id=$vk_id");
    if (!($check&&$check->num_rows>=1)){
        if($mysqli->query("INSERT INTO `BSPUMessage` (`id`, `name`,`vk_id` ,`faculty_id`,`group_id`) VALUES (null,'$name','$vk_id','$faculty','$group')")){
            echo 'posted';
        }else{
            echo $mysqli->error;
            trigger_error($mysqli->error, E_USER_ERROR);
        }
    }
}