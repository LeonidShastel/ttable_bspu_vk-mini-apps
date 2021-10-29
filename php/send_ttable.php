<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: *');

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');
$students = array();
if($result=$mysqli->query("SELECT * FROM `BSPUMessage`")){
    if($result->num_rows>0){
        while ($row = $result->fetch_object()){
            $temp = array($row->vk_id, $row->group_id);
            array_push($students, $temp);
        }
    }
    if(count($students)>0){
        getTTable($students);
    }
}

function getTTable($array){
    foreach ($array as $student){
        $date = new DateTime("2021-01-01");
        $week = $date->format("W");
        if($week%2==0)
            $week = 2;
        else $week=1;
        $group = $student[1];
        $ch = curl_init();
        $url = "https://ttable.bspu.by/timetable?groups=".$group."&week=".$week."&ttype=pairs";
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        $html = curl_exec($ch);
        $dom = new DOMDocument();
        @ $dom->loadHTML($html);
        $tr = $dom->getElementsByTagName('tr');
        $result = array();
        for($i=1;$i<$tr->length;$i++){
            $temp = $tr->item($i)->getElementsByTagName('td');
            $time = $temp->item(0)->textContent;
            $name = $temp->item(1)->textContent;
            $teacher = $temp->item(2)->textContent;
            $place = $temp->item(3)->textContent;
            $type = $temp->item(4)->textContent;
            $count = $temp->item(5)->textContent;

            $message = "Время: $time\nПредмет: $name"."$teacher"."Место: $place\nТип: $type\nПодгруппа: $count\n";
            array_push($result, $message);
        }
        $send = implode("\n", $result);
        sendVkMessage($send, $student[0]);
    }
}


function sendVkMessage($message, $id){
        $request_params = array(
            'message'=>$message,
            'user_id'=>$id,
            'access_token'=>"638ba8100e136841e64d5821141bd5567b15ce55502742c467f8de4d7645db7bb8e79f0483b6100cb8e66",
            'v'=>'5.87'
        );
        $get_params = http_build_query($request_params);
        file_get_contents('https://api.vk.com/method/messages.send?'. $get_params);
}